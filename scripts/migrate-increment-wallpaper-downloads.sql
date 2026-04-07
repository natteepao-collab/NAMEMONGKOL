-- Migration: ปรับ increment_wallpaper_downloads ให้คืนผลที่ตรวจสอบได้
-- และรองรับ decrement สำหรับ rollback กรณีธุรกรรมล้มเหลว
--
-- วิธีใช้: รัน SQL นี้ใน Supabase SQL Editor
-- ⚠️  ต้อง DROP ทั้ง 2 signature ก่อน เพื่อลบ overload เก่าทิ้งให้หมด

-- Drop ALL existing overloads to avoid ambiguity
DROP FUNCTION IF EXISTS public.increment_wallpaper_downloads(int);
DROP FUNCTION IF EXISTS public.increment_wallpaper_downloads(int, boolean);

-- Create single version with return value and optional decrement
CREATE FUNCTION public.increment_wallpaper_downloads(
  wallpaper_id int,
  decrement boolean DEFAULT false
)
RETURNS TABLE(success boolean, new_downloads int) AS $$
DECLARE
  v_new_count int;
BEGIN
  IF decrement THEN
    UPDATE public.wallpapers
    SET downloads = GREATEST(downloads - 1, 0)
    WHERE id = wallpaper_id;
  ELSE
    UPDATE public.wallpapers
    SET downloads = downloads + 1
    WHERE id = wallpaper_id;
  END IF;

  -- Check if the row was actually updated
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;

  SELECT downloads INTO v_new_count
  FROM public.wallpapers
  WHERE id = wallpaper_id;

  RETURN QUERY SELECT true, v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ตรวจว่าเหลือฟังก์ชันเดียว
SELECT proname, proargtypes::regtype[], prorettype::regtype
FROM pg_proc
WHERE proname = 'increment_wallpaper_downloads';
