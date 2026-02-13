-- FIX INFINITE RECURSION IN RLS (Final Fix)
-- 2024-02-13

-- 1. Create a "Security Definer" function to get role safely
-- This bypasses RLS because it runs with the privileges of the function creator (superuser/admin).
-- This breaks the infinite loop: Policy -> queries table -> triggers Policy -> ...
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
DECLARE
  extracted_role text;
BEGIN
  -- Read directly from user_profiles without triggering RLS (due to SECURITY DEFINER)
  SELECT role INTO extracted_role
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  RETURN extracted_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. FIX user_profiles Policies (The source of recursion)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow Admins to View ALL (Using the safe function)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);

-- Ensure basic "View Own" still works (ID check is safe, no recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);


-- 3. FIX Wallpapers Policies (Use safe function for performance/safety)
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage wallpapers" ON public.wallpapers;
CREATE POLICY "Admins can manage wallpapers"
ON public.wallpapers FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);


-- 4. FIX Articles Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles"
ON public.articles FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);


-- 5. Fix check_profile_update_permission trigger to use the new function too (consistency)
CREATE OR REPLACE FUNCTION public.check_profile_update_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- Use the safe function
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
