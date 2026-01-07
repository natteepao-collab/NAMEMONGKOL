-- 1. Add role column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Create an index for faster lookups by role
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- 3. Create a helper function to get the current user's role safely
-- "SECURITY DEFINER" prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- 4. RLS Policies for Admin Access
-- Admin can see ALL user profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'admin'
);

-- Admin can update ALL user profiles (e.g. to give credits)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  public.get_my_role() = 'admin'
);

-- Admin can view ALL slips
DROP POLICY IF EXISTS "Admins can view all slips" ON public.slips;
CREATE POLICY "Admins can view all slips"
ON public.slips
FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'admin'
);

-- INSTRUCTIONS TO SET YOURSELF AS ADMIN:
-- Run this query with your specific User UID found in Authentication -> Users
-- UPDATE public.user_profiles SET role = 'admin' WHERE id = 'YOUR_USER_UID_HERE';
