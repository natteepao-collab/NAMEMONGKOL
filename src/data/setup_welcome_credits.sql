-- ============================================================================
-- WELCOME CREDITS SYSTEM: 100 เครดิตฟรีสำหรับสมาชิกใหม่ (หมดอายุ 30 วัน)
-- ============================================================================
-- วิธีใช้: รัน SQL นี้ใน Supabase SQL Editor ตามลำดับ Step 1-6
-- ============================================================================


-- ============================================================================
-- STEP 1: เพิ่มคอลัมน์ welcome_credits ใน user_profiles
-- ============================================================================

-- welcome_credits: จำนวนเครดิตฟรีที่ยังเหลืออยู่ (แยกจากเครดิตที่ซื้อ)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS welcome_credits INTEGER DEFAULT 0;

-- welcome_credits_granted: ป้องกันการให้เครดิตซ้ำ (ระดับ DB)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS welcome_credits_granted BOOLEAN DEFAULT FALSE;

-- welcome_credits_granted_at: ใช้คำนวณวันหมดอายุ (30 วัน)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS welcome_credits_granted_at TIMESTAMPTZ DEFAULT NULL;


-- ============================================================================
-- STEP 2: อัพเดต handle_new_user() trigger ให้เพิ่ม 100 เครดิตฟรีอัตโนมัติ
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- สร้าง user profile พร้อมเครดิตฟรี 100 เครดิต
  INSERT INTO public.user_profiles (
    id, email, first_name, last_name, provider, created_at,
    credits, welcome_credits, welcome_credits_granted, welcome_credits_granted_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'first_name')::text,
      split_part((NEW.raw_user_meta_data->>'name')::text, ' ', 1),
      ''
    ),
    COALESCE(
      (NEW.raw_user_meta_data->>'last_name')::text,
      CASE
        WHEN position(' ' in (NEW.raw_user_meta_data->>'name')::text) > 0
        THEN substring((NEW.raw_user_meta_data->>'name')::text from position(' ' in (NEW.raw_user_meta_data->>'name')::text) + 1)
        ELSE ''
      END,
      ''
    ),
    COALESCE((NEW.raw_app_meta_data->>'provider')::text, 'email'),
    NOW(),
    0,             -- credits (เครดิตซื้อ) เริ่มที่ 0
    100,           -- welcome_credits: 100 เครดิตฟรี
    TRUE,          -- welcome_credits_granted: ให้แล้ว
    NOW()          -- welcome_credits_granted_at: เริ่มนับหมดอายุ
  )
  ON CONFLICT (id) DO NOTHING;

  -- บันทึก transaction log
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 100, 'earn', 'Welcome Bonus: สมาชิกใหม่ 100 เครดิต (หมดอายุ 30 วัน)')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- STEP 3: ฟังก์ชัน get_effective_credits() - คำนวณเครดิตที่ใช้ได้จริง
-- ============================================================================
-- คืนค่า: { total_credits, purchased_credits, welcome_credits, welcome_expires_at, welcome_expired }

CREATE OR REPLACE FUNCTION public.get_effective_credits()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_credits INT;
  v_welcome_credits INT;
  v_welcome_granted_at TIMESTAMPTZ;
  v_welcome_expired BOOLEAN;
  v_expires_at TIMESTAMPTZ;
  v_total INT;
BEGIN
  SELECT credits, welcome_credits, welcome_credits_granted_at
  INTO v_credits, v_welcome_credits, v_welcome_granted_at
  FROM public.user_profiles
  WHERE id = v_user_id;

  -- ค่า default
  v_credits := COALESCE(v_credits, 0);
  v_welcome_credits := COALESCE(v_welcome_credits, 0);

  -- ตรวจสอบว่า welcome credits หมดอายุหรือยัง (30 วัน)
  IF v_welcome_granted_at IS NOT NULL AND v_welcome_credits > 0 THEN
    v_expires_at := v_welcome_granted_at + INTERVAL '30 days';
    IF NOW() > v_expires_at THEN
      -- หมดอายุแล้ว: zero out welcome_credits
      v_welcome_expired := TRUE;
      
      -- อัพเดตในฐานข้อมูล
      PERFORM set_config('app.bypass_credit_check', 'true', true);
      UPDATE public.user_profiles
      SET welcome_credits = 0
      WHERE id = v_user_id AND welcome_credits > 0;
      PERFORM set_config('app.bypass_credit_check', '', true);

      -- บันทึก transaction
      IF v_welcome_credits > 0 THEN
        INSERT INTO public.credit_transactions (user_id, amount, type, description)
        VALUES (v_user_id, -v_welcome_credits, 'expire', 'Welcome Bonus หมดอายุ (30 วัน)');
      END IF;

      v_welcome_credits := 0;
    ELSE
      v_welcome_expired := FALSE;
    END IF;
  ELSE
    v_welcome_expired := TRUE; -- ไม่มี welcome credits
    v_expires_at := NULL;
  END IF;

  v_total := v_credits + v_welcome_credits;

  RETURN jsonb_build_object(
    'total_credits', v_total,
    'purchased_credits', v_credits,
    'welcome_credits', v_welcome_credits,
    'welcome_expires_at', v_expires_at,
    'welcome_expired', v_welcome_expired
  );
END;
$$;


-- ============================================================================
-- STEP 4: อัพเดต deduct_credits() ให้ใช้ welcome credits ก่อน (FIFO)
-- ============================================================================

DROP FUNCTION IF EXISTS public.deduct_credits(int);

CREATE OR REPLACE FUNCTION public.deduct_credits(amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_credits INT;
  v_welcome_credits INT;
  v_welcome_granted_at TIMESTAMPTZ;
  v_effective_welcome INT;
  v_total INT;
  v_deduct_from_welcome INT;
  v_deduct_from_purchased INT;
BEGIN
  -- Validate amount
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive.';
  END IF;

  -- Get current credits
  SELECT credits, welcome_credits, welcome_credits_granted_at
  INTO v_credits, v_welcome_credits, v_welcome_granted_at
  FROM public.user_profiles
  WHERE id = auth.uid();

  v_credits := COALESCE(v_credits, 0);
  v_welcome_credits := COALESCE(v_welcome_credits, 0);

  -- ตรวจ welcome credits หมดอายุหรือยัง
  IF v_welcome_granted_at IS NOT NULL AND v_welcome_credits > 0 THEN
    IF NOW() > (v_welcome_granted_at + INTERVAL '30 days') THEN
      -- หมดอายุ: ลบ welcome credits ก่อน
      v_effective_welcome := 0;

      -- บันทึก transaction การหมดอายุ
      INSERT INTO public.credit_transactions (user_id, amount, type, description)
      VALUES (auth.uid(), -v_welcome_credits, 'expire', 'Welcome Bonus หมดอายุ (30 วัน)');

      v_welcome_credits := 0;
    ELSE
      v_effective_welcome := v_welcome_credits;
    END IF;
  ELSE
    v_effective_welcome := 0;
  END IF;

  -- คำนวณ total
  v_total := v_credits + v_effective_welcome;

  -- Check sufficient balance
  IF v_total < amount THEN
    RAISE EXCEPTION 'Insufficient credits. Available: %, Required: %', v_total, amount;
  END IF;

  -- FIFO: ใช้ welcome credits ก่อน (เพราะหมดอายุก่อน)
  IF v_effective_welcome >= amount THEN
    v_deduct_from_welcome := amount;
    v_deduct_from_purchased := 0;
  ELSE
    v_deduct_from_welcome := v_effective_welcome;
    v_deduct_from_purchased := amount - v_effective_welcome;
  END IF;

  -- Set bypass signal
  PERFORM set_config('app.bypass_credit_check', 'true', true);

  -- Deduct credits
  UPDATE public.user_profiles
  SET 
    credits = credits - v_deduct_from_purchased,
    welcome_credits = CASE 
      WHEN v_effective_welcome = 0 THEN 0  -- หมดอายุแล้ว ให้เป็น 0
      ELSE welcome_credits - v_deduct_from_welcome
    END
  WHERE id = auth.uid();

  -- Reset bypass signal
  PERFORM set_config('app.bypass_credit_check', '', true);
END;
$$;


-- ============================================================================
-- STEP 5: ฟังก์ชัน expire_welcome_credits() - สำหรับ Cron Job
-- ============================================================================
-- ใช้กับ pg_cron หรือ Supabase Edge Function (รันวันละครั้ง)
-- SELECT cron.schedule('expire-welcome-credits', '0 3 * * *', 'SELECT public.expire_welcome_credits()');

CREATE OR REPLACE FUNCTION public.expire_welcome_credits()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_expired_count INT := 0;
  v_record RECORD;
BEGIN
  -- หา users ที่ welcome credits หมดอายุแล้ว
  FOR v_record IN
    SELECT id, welcome_credits
    FROM public.user_profiles
    WHERE welcome_credits > 0
      AND welcome_credits_granted_at IS NOT NULL
      AND welcome_credits_granted_at + INTERVAL '30 days' < NOW()
  LOOP
    -- บันทึก transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (v_record.id, -v_record.welcome_credits, 'expire', 'Welcome Bonus หมดอายุ (30 วัน) - Cron');

    v_expired_count := v_expired_count + 1;
  END LOOP;

  -- Batch update ทั้งหมด
  PERFORM set_config('app.bypass_credit_check', 'true', true);

  UPDATE public.user_profiles
  SET welcome_credits = 0
  WHERE welcome_credits > 0
    AND welcome_credits_granted_at IS NOT NULL
    AND welcome_credits_granted_at + INTERVAL '30 days' < NOW();

  PERFORM set_config('app.bypass_credit_check', '', true);

  RETURN jsonb_build_object(
    'success', true,
    'expired_count', v_expired_count
  );
END;
$$;


-- ============================================================================
-- STEP 6: อัพเดต check_profile_update_permission trigger
-- ============================================================================
-- เพิ่ม welcome_credits ในรายการคอลัมน์ที่ user ห้ามแก้ไขตรง

CREATE OR REPLACE FUNCTION public.check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow bypass from trusted SECURITY DEFINER functions
  IF current_setting('app.bypass_credit_check', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- If user is NOT admin, block sensitive column changes
  IF public.get_my_role() <> 'admin' THEN
    IF NEW.credits IS DISTINCT FROM OLD.credits THEN
      RAISE EXCEPTION 'You are not allowed to update credits.';
    END IF;
    IF NEW.welcome_credits IS DISTINCT FROM OLD.welcome_credits THEN
      RAISE EXCEPTION 'You are not allowed to update welcome_credits.';
    END IF;
    IF NEW.welcome_credits_granted IS DISTINCT FROM OLD.welcome_credits_granted THEN
      RAISE EXCEPTION 'You are not allowed to update welcome_credits_granted.';
    END IF;
    IF NEW.welcome_credits_granted_at IS DISTINCT FROM OLD.welcome_credits_granted_at THEN
      RAISE EXCEPTION 'You are not allowed to update welcome_credits_granted_at.';
    END IF;
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'You are not allowed to update role.';
    END IF;
    IF NEW.tier IS DISTINCT FROM OLD.tier THEN
      RAISE EXCEPTION 'You are not allowed to update tier.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- STEP 7 (OPTIONAL): ให้เครดิตฟรีแก่สมาชิกเก่าที่สมัครภายใน 30 วันที่ผ่านมา
-- ============================================================================
-- ⚠️ รันครั้งเดียวหลัง deploy เท่านั้น!
-- ถ้าไม่ต้องการให้สมาชิกเก่า uncomment ส่วนนี้ได้

-- DO $$
-- DECLARE
--   v_record RECORD;
-- BEGIN
--   PERFORM set_config('app.bypass_credit_check', 'true', true);
--
--   FOR v_record IN
--     SELECT id FROM public.user_profiles
--     WHERE (welcome_credits_granted IS NULL OR welcome_credits_granted = FALSE)
--       AND created_at > (NOW() - INTERVAL '30 days')
--   LOOP
--     UPDATE public.user_profiles
--     SET welcome_credits = 100,
--         welcome_credits_granted = TRUE,
--         welcome_credits_granted_at = created_at
--     WHERE id = v_record.id;
--
--     INSERT INTO public.credit_transactions (user_id, amount, type, description)
--     VALUES (v_record.id, 100, 'earn', 'Welcome Bonus: สมาชิกใหม่ 100 เครดิต (Retroactive)');
--   END LOOP;
--
--   PERFORM set_config('app.bypass_credit_check', '', true);
-- END;
-- $$;


-- ============================================================================
-- VERIFICATION: ตรวจสอบว่าระบบทำงานถูกต้อง
-- ============================================================================

-- ตรวจว่าคอลัมน์ใหม่มีอยู่:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'user_profiles'
-- AND column_name IN ('welcome_credits', 'welcome_credits_granted', 'welcome_credits_granted_at');

-- ตรวจ handle_new_user function:
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';

-- ตรวจ deduct_credits function:
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'deduct_credits';

-- ทดสอบ get_effective_credits:
-- SELECT public.get_effective_credits();

-- ทดสอบ expire_welcome_credits:
-- SELECT public.expire_welcome_credits();
