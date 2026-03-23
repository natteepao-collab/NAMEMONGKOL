-- ============================================================================
-- LINE VERIFICATION SYSTEM: one-time token flow for +80 credits
-- ============================================================================
-- วิธีใช้: รัน SQL นี้ใน Supabase SQL Editor หลังจากรัน setup_welcome_credits.sql แล้ว
-- ============================================================================


-- ============================================================================
-- STEP 1: เพิ่มคอลัมน์ LINE verification ใน user_profiles
-- ============================================================================

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS line_verified_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS line_bonus_granted BOOLEAN DEFAULT FALSE;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS line_bonus_granted_at TIMESTAMPTZ DEFAULT NULL;


-- ============================================================================
-- STEP 2: ลบ duplicate line_user_id ก่อนเพิ่ม UNIQUE constraint
-- ============================================================================
-- เก็บไว้เฉพาะ record ที่สร้างก่อน (created_at เก่าสุด) ต่อ line_user_id หนึ่งค่า
-- record ที่เหลือจะถูก nullify ออก
WITH ranked AS (
  SELECT id, line_user_id,
    ROW_NUMBER() OVER (
      PARTITION BY line_user_id
      ORDER BY created_at ASC NULLS LAST
    ) AS rn
  FROM public.user_profiles
  WHERE line_user_id IS NOT NULL
)
UPDATE public.user_profiles
SET line_user_id = NULL
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 1
);

-- เพิ่ม UNIQUE constraint: 1 LINE account = 1 บัญชีเว็บเท่านั้น
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_line_user_id'
      AND conrelid = 'public.user_profiles'::regclass
  ) THEN
    ALTER TABLE public.user_profiles
    ADD CONSTRAINT unique_line_user_id UNIQUE (line_user_id);
  END IF;
END $$;


-- ============================================================================
-- STEP 3: สร้างตาราง line_verification_tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.line_verification_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token       TEXT        UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
  used_at     TIMESTAMPTZ DEFAULT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_line_verification_tokens_token
  ON public.line_verification_tokens (token);

CREATE INDEX IF NOT EXISTS idx_line_verification_tokens_user_id
  ON public.line_verification_tokens (user_id);

-- RLS: deny all client access — only service_role (via webhook/API route) can read/write
ALTER TABLE public.line_verification_tokens ENABLE ROW LEVEL SECURITY;
-- (no policies created intentionally — no anon/authenticated access)


-- ============================================================================
-- STEP 4: RPC grant_line_bonus(p_token, p_line_user_id)
-- ============================================================================
-- เรียกจาก LINE webhook ผ่าน service_role เท่านั้น
-- Logic:
--   1. ตรวจ token ที่ยังใช้ได้ (ไม่หมดอายุ + ยังไม่ถูกใช้)
--   2. ตรวจว่า user ยังไม่เคยได้รับ LINE bonus
--   3. ตรวจว่า LINE ID นี้ยังไม่ถูกผูกกับบัญชีอื่น
--   4. ผูก LINE ID + ให้ 80 เครดิต + mark bonus + reset expiry window
-- ============================================================================

CREATE OR REPLACE FUNCTION public.grant_line_bonus(
  p_token        TEXT,
  p_line_user_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_token_record  public.line_verification_tokens%ROWTYPE;
  v_user_id       UUID;
  v_already_used  BOOLEAN;
  v_line_taken    BOOLEAN;
BEGIN
  -- 1. ค้นหา token ที่ยังใช้ได้
  SELECT * INTO v_token_record
  FROM public.line_verification_tokens
  WHERE token = p_token
    AND expires_at > NOW()
    AND used_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'code', 'invalid_token');
  END IF;

  v_user_id := v_token_record.user_id;

  -- 2. ตรวจว่า user ยังไม่เคยได้ LINE bonus
  SELECT line_bonus_granted INTO v_already_used
  FROM public.user_profiles
  WHERE id = v_user_id;

  IF v_already_used THEN
    RETURN jsonb_build_object('success', false, 'code', 'already_claimed');
  END IF;

  -- 3. ตรวจว่า LINE ID นี้ยังไม่ถูกใช้กับบัญชีอื่น
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE line_user_id = p_line_user_id
      AND id <> v_user_id
  ) INTO v_line_taken;

  IF v_line_taken THEN
    RETURN jsonb_build_object('success', false, 'code', 'line_already_used');
  END IF;

  -- 4. Bypass signal (allow privileged credit update)
  PERFORM set_config('app.bypass_credit_check', 'true', true);

  -- 5. ผูก LINE ID + ให้ 80 เครดิต + reset 30-day expiry window นับจากวันยืนยัน
  UPDATE public.user_profiles
  SET
    line_user_id             = p_line_user_id,
    line_verified_at         = NOW(),
    line_bonus_granted       = TRUE,
    line_bonus_granted_at    = NOW(),
    welcome_credits          = welcome_credits + 80,
    welcome_credits_granted_at = NOW()
  WHERE id = v_user_id;

  -- 6. บันทึก credit transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (v_user_id, 80, 'earn', 'LINE Verification Bonus: ยืนยัน LINE รับ 80 เครดิต');

  -- 7. Mark token as used (single-use enforcement)
  UPDATE public.line_verification_tokens
  SET used_at = NOW()
  WHERE token = p_token;

  -- 8. Reset bypass
  PERFORM set_config('app.bypass_credit_check', '', true);

  RETURN jsonb_build_object('success', true, 'code', 'ok', 'user_id', v_user_id::text);
END;
$$;

-- GRANT เฉพาะ service_role เท่านั้น (webhook ใช้ service_role key)
REVOKE ALL ON FUNCTION public.grant_line_bonus(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.grant_line_bonus(text, text) TO service_role;


-- ============================================================================
-- STEP 5: Revoke anon access from link_line_id_by_email (security fix)
-- ============================================================================
-- (ถ้ายังไม่ได้รัน setup_link_email_rpc.sql ที่แก้แล้ว ให้รัน statement นี้ก่อน)
REVOKE EXECUTE ON FUNCTION public.link_line_id_by_email(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.link_line_id_by_email(text, text) FROM authenticated;


-- ============================================================================
-- STEP 6: Optional — Cron cleanup สำหรับ expired tokens
-- ============================================================================
-- รัน 1 ครั้งต่อวันเพื่อลบ token ที่หมดอายุ > 1 วัน
-- SELECT cron.schedule(
--   'cleanup-line-tokens',
--   '0 4 * * *',
--   $$DELETE FROM public.line_verification_tokens
--     WHERE expires_at < NOW() - INTERVAL '1 day'$$
-- );
