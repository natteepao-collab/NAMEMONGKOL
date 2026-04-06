-- ============================================================================
-- MIGRATE WALLPAPER IMAGES: PNG → WebP
-- ============================================================================
-- เปลี่ยน path ภาพ wallpaper จาก .png เป็น .webp
-- เพื่อลดขนาดไฟล์ ~90% และเพิ่มความเร็วในการโหลดหน้าเว็บ
-- ============================================================================
-- ⚠️ รัน SQL นี้ใน Supabase SQL Editor หลังจาก deploy โค้ดที่อัปเดตแล้ว

UPDATE wallpapers
SET image = REPLACE(image, '.png', '.webp')
WHERE image LIKE '/wallpapers/%.png';

-- Verification:
-- SELECT id, name, image FROM wallpapers ORDER BY id;
