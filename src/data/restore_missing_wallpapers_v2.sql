-- RESTORE MISSING WALLPAPERS (IDs 10-13)
-- 2024-02-14
-- Restores "God of Wealth" (Caishen) wallpapers that were lost during previous reset.

INSERT INTO public.wallpapers (id, name, image, day, tags, premium, downloads, description)
VALUES
(10, 'ท้าวเวสสุวรรณ (แดง)', '/wallpapers/wallpaper-10.png', 'all', ARRAY['ท้าวเวสสุวรรณ', 'คุ้มครอง', 'อำนาจ'], false, 0, 'ท้าวเวสสุวรรณ ปางสีแดง เสริมอำนาจบารมี และการปกครอง'),
(11, 'เทพเจ้าไฉ่ซิงเอี๊ย (เขียวเหนี่ยวทรัพย์)', '/wallpapers/wallpaper-11.png', 'all', ARRAY['ไฉ่ซิงเอี๊ย', 'โชคลาภ', 'การเงิน'], false, 0, 'เทพเจ้าไฉ่ซิงเอี๊ย ปางมหาเศรษฐี สีเขียวเหนี่ยวทรัพย์ เสริมดวงการเงิน โชคลาภ และความมั่งคั่งร่ำรวย'),
(12, 'เทพเจ้าไฉ่ซิงเอี๊ย (ชมพูดูดทรัพย์)', '/wallpapers/wallpaper-12.png', 'all', ARRAY['ไฉ่ซิงเอี๊ย', 'ความรัก', 'เมตตามหานิยม'], false, 0, 'เทพเจ้าไฉ่ซิงเอี๊ย ปางมหาเศรษฐี สีชมพูดูดทรัพย์ เสริมเสน่ห์ เมตตามหานิยม พร้อมโชคลาภการเงิน'),
(13, 'เทพเจ้าไฉ่ซิงเอี๊ย (ครีมพารวย)', '/wallpapers/wallpaper-13.png', 'all', ARRAY['ไฉ่ซิงเอี๊ย', 'บารมี', 'ความมั่นคง'], false, 0, 'เทพเจ้าไฉ่ซิงเอี๊ย ปางมหาเศรษฐี สีครีมพารวย เสริมความมั่นคง วาสนาบารมี และความสำเร็จในธุรกิจ')
ON CONFLICT (id) DO UPDATE
SET name = excluded.name,
    image = excluded.image,
    tags = excluded.tags,
    premium = excluded.premium,
    description = excluded.description;

-- Fix sequence again to be safe
SELECT setval('wallpapers_id_seq', (SELECT MAX(id) FROM wallpapers));
