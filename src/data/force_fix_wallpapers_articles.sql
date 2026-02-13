-- FORCE FIX WALLPAPERS & ARTICLES POLICIES
-- 2024-02-14

-- This script completely resets the policies for Wallpapers and Articles
-- to ensure NO previous errors caused them to be missing.

-- ==========================================
-- 1. WALLPAPERS
-- ==========================================
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;

-- 1.1 Public Read Access (Everyone can view)
DROP POLICY IF EXISTS "Public can view wallpapers" ON public.wallpapers;
CREATE POLICY "Public can view wallpapers"
ON public.wallpapers FOR SELECT
USING (true);

-- 1.2 Admin Full Access (Admins can do everything)
DROP POLICY IF EXISTS "Admins can manage wallpapers" ON public.wallpapers;
CREATE POLICY "Admins can manage wallpapers"
ON public.wallpapers FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);


-- ==========================================
-- 2. ARTICLES
-- ==========================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 2.1 Public Read Access (Everyone can view Published)
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
ON public.articles FOR SELECT
USING (is_published = true);

-- 2.2 Admin Full Access (Admins can view ALL and edit)
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
CREATE POLICY "Admins can manage articles"
ON public.articles FOR ALL
USING (
  public.get_my_role() = 'admin' 
  OR auth.role() = 'service_role'
);


-- ==========================================
-- 3. VERIFICATION
-- ==========================================
-- This part outputs the number of rows in each table to the SQL Editor results.
-- If these numbers are 0, then your data was deleted (not a permission issue).

SELECT 'wallpapers' as table_name, count(*) as row_count FROM public.wallpapers
UNION ALL
SELECT 'articles' as table_name, count(*) as row_count FROM public.articles;
