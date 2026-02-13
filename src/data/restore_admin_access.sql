-- RESTORE ADMIN ACCESS & FIX RLS
-- 2024-02-13

-- ==========================================
-- 1. WALLPAPERS (Fix missing/strict RLS)
-- ==========================================
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;

-- Allow Public to VIEW wallpapers
DROP POLICY IF EXISTS "Public can view wallpapers" ON public.wallpapers;
CREATE POLICY "Public can view wallpapers"
ON public.wallpapers FOR SELECT
USING (true);

-- Allow Admin to MANAGE wallpapers (Insert, Update, Delete)
-- We check if the user has 'admin' role in user_profiles OR is service_role
DROP POLICY IF EXISTS "Admins can manage wallpapers" ON public.wallpapers;
CREATE POLICY "Admins can manage wallpapers"
ON public.wallpapers FOR ALL
USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin' 
  OR auth.role() = 'service_role'
);


-- ==========================================
-- 2. ARTICLES (Fix missing/strict RLS)
-- ==========================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow Public to VIEW published articles
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
ON public.articles FOR SELECT
USING (is_published = true);

-- Allow Admin to VIEW ALL (including drafts) and MANAGE
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles"
ON public.articles FOR ALL
USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin' 
  OR auth.role() = 'service_role'
);


-- ==========================================
-- 3. USER PROFILES (Ensure Admin Visibility)
-- ==========================================
-- The previous security patch restricted users to view ONLY their own profile.
-- We must explicitly allow Admins to view ALL profiles to manage users.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin' 
  OR auth.role() = 'service_role'
);


-- ==========================================
-- 4. STORAGE (Buckets)
-- ==========================================
-- Ensure Admins can upload to 'articles' and 'wallpapers' buckets
-- (Assuming standard storage.objects policies need Admin check)

-- Function to check generic admin access (reusable helper)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
