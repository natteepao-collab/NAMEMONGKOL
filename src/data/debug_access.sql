-- DEBUG & FIX ACCESS
-- 2024-02-14

-- 1. Temporarily relax RLS on Wallpapers and Articles to "Authenticated"
-- This helps us verify if the data actually exists and if the issue is just the 'admin' check.

DROP POLICY IF EXISTS "Admins can manage wallpapers" ON public.wallpapers;
CREATE POLICY "Admins can manage wallpapers"
ON public.wallpapers FOR ALL
USING (auth.role() = 'authenticated'); -- TEMPORARY: Allow all logged-in users to manage

DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles"
ON public.articles FOR ALL
USING (auth.role() = 'authenticated'); -- TEMPORARY: Allow all logged-in users to manage


-- 2. Check your current ROLE
-- This view will help you see what your user ID and Role are.
-- Run this, then go to the "Table Editor" or "SQL Editor" output to see the result.
CREATE OR REPLACE VIEW debug_my_role AS
SELECT 
  auth.uid() as my_auth_id,
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) as my_profile_role,
  public.get_my_role() as role_from_function;


-- 3. Fix the Trigger temporarily (in case you need to update your role)
-- We disable the strict check so you can manually update your role if needed.
DROP TRIGGER IF EXISTS on_profile_update_check ON public.user_profiles;

-- INSTRUCTIONS:
-- 1. Run this script.
-- 2. Check the Admin Dashboard. If data appears, it means you were NOT recognized as 'admin'.
-- 3. To fix your role permanently, find your user_id (from auth.users) and run:
--    UPDATE public.user_profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
