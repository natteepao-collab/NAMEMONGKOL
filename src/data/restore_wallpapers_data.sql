-- RESTORE WALLPAPERS DATA
-- 2024-02-14

-- Insert defaults (Upsert to avoid duplicates if any partial data exists)
INSERT INTO public.wallpapers (id, name, image, day, tags, premium, downloads, description)
VALUES
(1, 'มหาเทพประทานทรัพย์ (วันอาทิตย์)', '/wallpapers/คนเกิดวันเอาทิตย์.png', 'sunday', ARRAY['การเงิน', 'อำนาจ'], false, 2540, NULL),
(2, 'เสน่ห์เมตตามหานิยม (วันจันทร์)', '/wallpapers/คนเกิดวันจันทร์.png', 'monday', ARRAY['ความรัก', 'เมตตา'], false, 3120, NULL),
(3, 'นักรบกล้าหาญ (วันอังคาร)', '/wallpapers/คนเกิดวันอังคาร.png', 'tuesday', ARRAY['การงาน', 'แข่งขัน'], false, 1890, NULL),
(4, 'วาจาเรียกทรัพย์ (วันพุธ)', '/wallpapers/คนเกิดพุธ.png', 'wednesday', ARRAY['การเจรจา', 'ค้าขาย'], false, 2100, NULL),
(5, 'ปัญญาบารมี (วันพฤหัสบดี)', '/wallpapers/คนเกิดพฤหัส.png', 'thursday', ARRAY['การเรียน', 'ผู้ใหญ่เมตตา'], false, 2750, NULL),
(6, 'ทรัพย์สินพอกพูน (วันศุกร์)', '/wallpapers/คนเกิดศุกร์.png', 'friday', ARRAY['การเงิน', 'ความสุข'], false, 3420, NULL),
(7, 'อำนาจบารมี (วันเสาร์)', '/wallpapers/คนเกิดวันเสาร์.png', 'saturday', ARRAY['อำนาจ', 'แคล้วคลาด'], false, 1980, NULL),
(8, 'ท้าวเวสสุวรรณ ปลดหนี้', '/wallpapers/thao-wessuwan-v2.png', 'all', ARRAY['ปลดหนี้', 'กันชง'], true, 4500, NULL),
(9, '4289 ท้าวเวสสุวรรณ (สีชมพู)', '/wallpapers/4289_ท้าวเวสสุวรรณ_สีชมพู.png', 'all', ARRAY['การเงิน', 'โชคลาภ', '4289'], false, 0, 'เหมาะอย่างยิ่งสำหรับ "คนทำมาค้าขาย, เจ้าของธุรกิจ, Sales, และคนที่ต้องการเสริมดวงโชคลาภและการเงิน" โดยเน้นที่ความราบรื่น (ปางเด็ก) และเงินทองไหลมาเทมา (4289 + ถุงเงิน) ครับ')
ON CONFLICT (id) DO UPDATE 
SET name = excluded.name, 
    image = excluded.image, 
    tags = excluded.tags, 
    premium = excluded.premium,
    description = excluded.description;

-- Fix sequence sync issue to prevent "duplicate key value violates unique constraint" later
SELECT setval('wallpapers_id_seq', (SELECT MAX(id) FROM wallpapers));
