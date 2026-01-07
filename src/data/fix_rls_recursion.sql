-- 1. Create a helper function to get the current user's role safely
-- "SECURITY DEFINER" means this function runs with the privileges of the creator (superuser/admin), 
-- bypassing the RLS on user_profiles table, causing no recursion.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- 2. Drop the problematic policies that caused recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all slips" ON public.slips;

-- 3. Re-create policies using the safe function
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'admin'
);

CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  public.get_my_role() = 'admin'
);

CREATE POLICY "Admins can view all slips"
ON public.slips
FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'admin'
);
