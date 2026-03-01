-- ============================================================================
-- FIX WALLPAPER IMAGES: เปลี่ยนชื่อไฟล์จากภาษาไทยเป็น ASCII
-- ============================================================================
-- สาเหตุ: ชื่อไฟล์ภาษาไทยในพาธ (เช่น /wallpapers/คนเกิดวันเอาทิตย์.png) 
-- ทำให้ Next.js Image optimization ไม่สามารถโหลดภาพได้ถูกต้อง
-- แก้ไข: เปลี่ยนเป็นชื่อไฟล์ ASCII (sunday.png, monday.png, ...)
-- ============================================================================
-- ⚠️ รัน SQL นี้ใน Supabase SQL Editor หลังจาก deploy ไฟล์ใหม่แล้ว

UPDATE wallpapers SET image = '/wallpapers/sunday.png' WHERE id = 1;
UPDATE wallpapers SET image = '/wallpapers/monday.png' WHERE id = 2;
UPDATE wallpapers SET image = '/wallpapers/tuesday.png' WHERE id = 3;
UPDATE wallpapers SET image = '/wallpapers/wednesday.png' WHERE id = 4;
UPDATE wallpapers SET image = '/wallpapers/thursday.png' WHERE id = 5;
UPDATE wallpapers SET image = '/wallpapers/friday.png' WHERE id = 6;
UPDATE wallpapers SET image = '/wallpapers/saturday.png' WHERE id = 7;
-- ID 8 (thao-wessuwan-v2.png) ไม่ต้องเปลี่ยน (ชื่อ ASCII อยู่แล้ว)
UPDATE wallpapers SET image = '/wallpapers/4289-vessavana-pink.png' WHERE id = 9;

-- Verification:
-- SELECT id, name, image FROM wallpapers ORDER BY id;
