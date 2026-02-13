-- SECURITY PATCH 2024-02-13
-- 1. DROP Vulnerable Function
DROP FUNCTION IF EXISTS public.add_credits(int);

-- 2. HARDEN RLS Policies for user_profiles

-- Enable RLS (just in case)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to VIEW their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- RESTRICT updates: Users can ONLY update safe fields.
-- They CANNOT update 'credits', 'role', or 'tier'.
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note: Supabase RLS for UPDATE doesn't natively support column-level permissions 
-- in the simple CREATE POLICY syntax without using a trigger or complex check.
-- However, we can use a BEFORE UPDATE trigger to enforce column immutability for non-admins.

CREATE OR REPLACE FUNCTION public.check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is NOT admin
  IF public.get_my_role() <> 'admin' THEN
    -- Prevent changes to sensitive columns
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

-- Bind the trigger
DROP TRIGGER IF EXISTS on_profile_update_check ON public.user_profiles;
CREATE TRIGGER on_profile_update_check
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_profile_update_permission();
