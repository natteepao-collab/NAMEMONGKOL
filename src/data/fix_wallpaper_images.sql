-- ============================================================================
-- FIX WALLPAPER IMAGES: เปลี่ยนชื่อไฟล์จากภาษาไทยเป็น ASCII
-- ============================================================================
-- สาเหตุ: ชื่อไฟล์ภาษาไทยในพาธ (เช่น /wallpapers/คนเกิดวันเอาทิตย์.png) 
-- ทำให้ Next.js Image optimization ไม่สามารถโหลดภาพได้ถูกต้อง
-- แก้ไข: เปลี่ยนเป็นชื่อไฟล์ ASCII (sunday.png, monday.png, ...)
-- ============================================================================
-- ⚠️ รัน SQL นี้ใน Supabase SQL Editor หลังจาก deploy ไฟล์ใหม่แล้ว

UPDATE wallpapers SET image = '/wallpapers/sunday.webp' WHERE id = 1;
UPDATE wallpapers SET image = '/wallpapers/monday.webp' WHERE id = 2;
UPDATE wallpapers SET image = '/wallpapers/tuesday.webp' WHERE id = 3;
UPDATE wallpapers SET image = '/wallpapers/wednesday.webp' WHERE id = 4;
UPDATE wallpapers SET image = '/wallpapers/thursday.webp' WHERE id = 5;
UPDATE wallpapers SET image = '/wallpapers/friday.webp' WHERE id = 6;
UPDATE wallpapers SET image = '/wallpapers/saturday.webp' WHERE id = 7;
-- ID 8 (thao-wessuwan-v2.webp) ไม่ต้องเปลี่ยน (ชื่อ ASCII อยู่แล้ว)
UPDATE wallpapers SET image = '/wallpapers/4289-vessavana-pink.webp' WHERE id = 9;

-- Verification:
-- SELECT id, name, image FROM wallpapers ORDER BY id;
