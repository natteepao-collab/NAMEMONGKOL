-- FIX: deduct_credits function (v2)
-- Root Cause: SECURITY DEFINER changes the DB role, but auth.uid() still returns
-- the real user. So get_my_role() in the trigger still returns 'user' -> blocked.
--
-- Solution: Use a session variable (app.bypass_credit_check) as a signal.
-- Trusted SECURITY DEFINER functions set this variable before updating credits.
-- The trigger checks for this variable and allows the update if set.

-- ============================================================
-- STEP 1: Update the trigger function to check for bypass signal
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow bypass from trusted SECURITY DEFINER functions (e.g. deduct_credits, add_credits_v2)
  IF current_setting('app.bypass_credit_check', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- If user is NOT admin, block sensitive column changes
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STEP 2: Recreate deduct_credits with bypass signal
-- ============================================================
DROP FUNCTION IF EXISTS public.deduct_credits(int);

CREATE OR REPLACE FUNCTION public.deduct_credits(amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits int;
BEGIN
  -- Validate amount
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive.';
  END IF;

  -- Get current credits
  SELECT credits INTO current_credits
  FROM public.user_profiles
  WHERE id = auth.uid();

  -- Check sufficient balance
  IF current_credits IS NULL OR current_credits < amount THEN
    RAISE EXCEPTION 'Insufficient credits.';
  END IF;

  -- Set bypass signal (local to this transaction only)
  PERFORM set_config('app.bypass_credit_check', 'true', true);

  -- Deduct credits (trigger will see the bypass signal and allow it)
  UPDATE public.user_profiles
  SET credits = credits - amount
  WHERE id = auth.uid();

  -- Reset bypass signal
  PERFORM set_config('app.bypass_credit_check', '', true);
END;
$$;
