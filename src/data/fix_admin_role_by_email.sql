-- FIX ADMIN ROLE & RESTORE SECURITY
-- 2024-02-14

-- 1. Force Update Role to 'admin' for your email
-- wWe look up the ID from auth.users and update user_profiles
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'nattee.pao@gmail.com' LIMIT 1
);

-- 2. Re-enable Strict Security (Revert Debug Mode)
-- We need to ensure that ONLY admins can manage data, not just any authenticated user.

-- Wallpapers: Revert to Admin-Only Management
DROP POLICY IF EXISTS "Admins can manage wallpapers" ON public.wallpapers;
CREATE POLICY "Admins can manage wallpapers"
ON public.wallpapers FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);

-- Articles: Revert to Admin-Only Management
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles"
ON public.articles FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);

-- 3. Restore the Safety Trigger
-- We previously disabled it to allow manual updates. Now we put it back.
DROP TRIGGER IF EXISTS on_profile_update_check ON public.user_profiles;
CREATE TRIGGER on_profile_update_check
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_profile_update_permission();

-- VERIFICATION:
-- Run this to confirm you are now an admin:
SELECT * FROM public.user_profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'nattee.pao@gmail.com');
