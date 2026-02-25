-- ============================================================================
-- FIX: Supabase Security Advisor Issues (2026-02-25)
-- ============================================================================
-- เป้าหมาย:
--   1. แก้ Error: Security Definer View (public.debug_my_role)
--   2. แก้ Warnings: Function Search Path Mutable (14 functions)
--
-- วิธีใช้: คัดลอก SQL ทั้งหมดไปรันใน Supabase SQL Editor
-- ============================================================================


-- ████████████████████████████████████████████████████████████████████████████
-- PART 1: แก้ Error - Security Definer View (public.debug_my_role)
-- ████████████████████████████████████████████████████████████████████████████
-- ปัญหา: View ที่สร้างด้วย SECURITY DEFINER จะใช้สิทธิ์ของผู้สร้าง View
--         แทนที่จะใช้สิทธิ์ของผู้ Query ทำให้ข้าม RLS ได้
-- วิธีแก้: Drop view แล้วสร้างใหม่ด้วย SECURITY INVOKER (default)

DROP VIEW IF EXISTS public.debug_my_role;

CREATE OR REPLACE VIEW public.debug_my_role
WITH (security_invoker = true)
AS
SELECT
  auth.uid() AS my_auth_id,
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) AS my_profile_role,
  public.get_my_role() AS role_from_function;


-- ████████████████████████████████████████████████████████████████████████████
-- PART 2: แก้ Warnings - Function Search Path Mutable (14 functions)
-- ████████████████████████████████████████████████████████████████████████████
-- ปัญหา: ฟังก์ชัน SECURITY DEFINER ที่ไม่ได้ตั้ง search_path อาจถูก
--         exploit ผ่าน search_path injection (สร้าง schema ปลอมที่มี
--         table/function ชื่อเดียวกัน แล้วเปลี่ยน search_path ให้ชี้ไปหา)
-- วิธีแก้: เพิ่ม SET search_path = '' ให้ทุกฟังก์ชัน SECURITY DEFINER
--         แล้วใช้ schema-qualified names (public.xxx) ในทุก query


-- ============================================================================
-- 2.1 public.get_my_role()
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
DECLARE
  extracted_role text;
BEGIN
  SELECT role INTO extracted_role
  FROM public.user_profiles
  WHERE id = auth.uid();

  RETURN extracted_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- 2.2 public.is_admin()
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- 2.3 public.increment_credits(uuid, int)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.increment_credits(user_uuid uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.user_profiles
  SET credits = coalesce(credits, 0) + amount
  WHERE id = user_uuid;
END;
$$;


-- ============================================================================
-- 2.4 public.deduct_credits(int)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.deduct_credits(amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_credits int;
BEGIN
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive.';
  END IF;

  SELECT credits INTO current_credits
  FROM public.user_profiles
  WHERE id = auth.uid();

  IF current_credits IS NULL OR current_credits < amount THEN
    RAISE EXCEPTION 'Insufficient credits.';
  END IF;

  PERFORM set_config('app.bypass_credit_check', 'true', true);

  UPDATE public.user_profiles
  SET credits = credits - amount
  WHERE id = auth.uid();

  PERFORM set_config('app.bypass_credit_check', '', true);
END;
$$;


-- ============================================================================
-- 2.5 public.add_credits_v2(int, numeric, text)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.add_credits_v2(
  credit_amount int,
  payment_amount numeric,
  slip_ref text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  existing_ref text;
  new_balance int;
BEGIN
  SELECT trans_ref INTO existing_ref
  FROM public.payment_transactions
  WHERE trans_ref = slip_ref LIMIT 1;

  IF existing_ref IS NOT NULL THEN
    RETURN json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate Slip)');
  END IF;

  INSERT INTO public.payment_transactions (user_id, amount, credits_added, trans_ref)
  VALUES (auth.uid(), payment_amount, credit_amount, slip_ref);

  UPDATE public.user_profiles
  SET credits = coalesce(credits, 0) + credit_amount
  WHERE id = auth.uid()
  RETURNING credits INTO new_balance;

  RETURN json_build_object('success', true, 'new_balance', new_balance);

EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว');
WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;


-- ============================================================================
-- 2.6 public.add_credits_v3(int, int, text, uuid)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.add_credits_v3(
  credit_amount int,
  payment_amount int,
  slip_ref text,
  user_id_arg uuid DEFAULT auth.uid()
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_exists boolean;
BEGIN
  SELECT exists(SELECT 1 FROM public.user_profiles WHERE id = user_id_arg) INTO user_exists;

  IF NOT user_exists THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;

  IF exists(SELECT 1 FROM public.payment_history WHERE session_id = slip_ref) THEN
    RETURN json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate)', 'code', 'DUPLICATE_SLIP');
  END IF;

  UPDATE public.user_profiles
  SET credits = coalesce(credits, 0) + credit_amount
  WHERE id = user_id_arg;

  INSERT INTO public.payment_history (session_id, user_id, amount, credits, status)
  VALUES (slip_ref, user_id_arg, payment_amount, credit_amount, 'completed');

  RETURN json_build_object('success', true, 'message', 'Credits added successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;


-- ============================================================================
-- 2.7 public.handle_stripe_payment_success() [TRIGGER FUNCTION]
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_stripe_payment_success()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  userId uuid;
  creditsAmount int;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'succeeded') OR
     (TG_OP = 'UPDATE' AND NEW.status = 'succeeded' AND OLD.status != 'succeeded') THEN

    userId := (NEW.metadata->>'user_id')::uuid;
    creditsAmount := (NEW.metadata->>'credits')::int;

    IF userId IS NOT NULL AND creditsAmount IS NOT NULL THEN
      UPDATE public.profiles
      SET credits = coalesce(credits, 0) + creditsAmount
      WHERE id = userId;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 2.8 public.approve_review(uuid)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.approve_review(p_review_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_current_status TEXT;
BEGIN
    SELECT user_id, status INTO v_user_id, v_current_status
    FROM public.reviews
    WHERE id = p_review_id;

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Review not found');
    END IF;

    IF v_current_status = 'approved' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Review is already approved');
    END IF;

    UPDATE public.reviews
    SET status = 'approved', updated_at = NOW()
    WHERE id = p_review_id;

    UPDATE public.user_profiles
    SET credits = credits + 50
    WHERE id = v_user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (v_user_id, 50, 'earn', 'Reward: Review Approved');

    RETURN jsonb_build_object('success', true);
END;
$$;


-- ============================================================================
-- 2.9 public.check_profile_update_permission() [TRIGGER FUNCTION]
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('app.bypass_credit_check', true) = 'true' THEN
    RETURN NEW;
  END IF;

  IF public.get_my_role() <> 'admin' THEN
    IF NEW.credits IS DISTINCT FROM OLD.credits THEN
      RAISE EXCEPTION 'You are not allowed to update credits.';
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- 2.10 public.handle_user_update() [TRIGGER FUNCTION]
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles
  SET
    email = NEW.email,
    provider = (NEW.raw_app_meta_data->>'provider')::text,
    first_name = COALESCE(
      (NEW.raw_user_meta_data->>'first_name')::text,
      split_part((NEW.raw_user_meta_data->>'name')::text, ' ', 1)
    ),
    last_name = COALESCE(
      (NEW.raw_user_meta_data->>'last_name')::text,
      CASE
        WHEN position(' ' in (NEW.raw_user_meta_data->>'name')::text) > 0
        THEN substring((NEW.raw_user_meta_data->>'name')::text from position(' ' in (NEW.raw_user_meta_data->>'name')::text) + 1)
        ELSE ''
      END
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- 2.11 public.handle_new_user() [TRIGGER FUNCTION]
-- หมายเหตุ: ฟังก์ชันนี้ไม่พบในไฟล์ SQL ในโปรเจค แต่มีอยู่ใน DB
--           ให้ตรวจสอบ definition ปัจจุบันใน Supabase SQL Editor ก่อน:
--           SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';
-- ============================================================================
-- ⚠️ ตรวจสอบ definition ที่มีอยู่ก่อนรัน! รันคำสั่งด้านล่างเพื่อดู:
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';
--
-- ตัวอย่างที่พบบ่อยสำหรับ Supabase:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, provider, created_at)
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
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- 2.12 public.increment_wallpaper_downloads(int)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.increment_wallpaper_downloads(wallpaper_id int)
RETURNS void AS $$
BEGIN
  UPDATE public.wallpapers
  SET downloads = downloads + 1
  WHERE id = wallpaper_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';


-- ============================================================================
-- PART 3: ตรวจสอบว่าแก้สำเร็จ (Verification Queries)
-- ============================================================================
-- รันคำสั่งด้านล่างหลังจากรัน SQL ด้านบนแล้ว เพื่อตรวจสอบ

-- 3.1 ตรวจ View ว่าไม่มี security_definer แล้ว
-- SELECT viewname, pg_get_viewdef(viewname::regclass) FROM pg_views WHERE viewname = 'debug_my_role';

-- 3.2 ตรวจ Functions ว่ามี search_path แล้ว
-- SELECT
--   p.proname AS function_name,
--   p.proconfig AS config
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND p.proname IN (
--     'handle_new_user', 'increment_credits', 'deduct_credits',
--     'add_credits_v3', 'handle_stripe_payment_success', 'get_my_role',
--     'add_credits_v2', 'approve_review', 'check_profile_update_permission',
--     'handle_user_update', 'is_admin', 'increment_wallpaper_downloads'
--   );
-- คาดหวัง: ทุกฟังก์ชันควรมี config = {search_path=}
