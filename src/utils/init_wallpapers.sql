-- Create table
create table if not exists wallpapers (
  id serial primary key,
  name text not null,
  image text not null,
  day text not null,
  tags text[] not null,
  premium boolean default false,
  downloads integer default 0,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add description column if it doesn't exist (for migration)
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='wallpapers' and column_name='description') then 
    alter table wallpapers add column description text; 
  end if; 
end $$;

-- Turn on RLS
alter table wallpapers enable row level security;

-- Policies
drop policy if exists "Enable read access for all users" on wallpapers;
create policy "Enable read access for all users" on wallpapers for select using (true);

drop policy if exists "Enable insert for authenticated users only" on wallpapers;
create policy "Enable insert for authenticated users only" on wallpapers for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update for authenticated users only" on wallpapers;
create policy "Enable update for authenticated users only" on wallpapers for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete for authenticated users only" on wallpapers;
create policy "Enable delete for authenticated users only" on wallpapers for delete using (auth.role() = 'authenticated');

-- Clean up old restrictive policy if it exists
drop policy if exists "Enable update for service role only" on wallpapers;

-- Functions (drop all overloads first to avoid ambiguity)
drop function if exists public.increment_wallpaper_downloads(int);
drop function if exists public.increment_wallpaper_downloads(int, boolean);

create function increment_wallpaper_downloads(
  wallpaper_id int,
  decrement boolean default false
)
returns table(success boolean, new_downloads int) as $$
declare
  v_new_count int;
begin
  if decrement then
    update wallpapers set downloads = greatest(downloads - 1, 0) where id = wallpaper_id;
  else
    update wallpapers set downloads = downloads + 1 where id = wallpaper_id;
  end if;

  if not found then
    return query select false, 0;
    return;
  end if;

  select downloads into v_new_count from wallpapers where id = wallpaper_id;
  return query select true, v_new_count;
end;
$$ language plpgsql security definer set search_path = '';

-- Seed Data (Upsert)
insert into wallpapers (id, name, image, day, tags, premium, downloads, description)
values
(1, 'มหาเทพประทานทรัพย์ (วันอาทิตย์)', '/wallpapers/sunday.webp', 'sunday', ARRAY['การเงิน', 'อำนาจ'], false, 2540, NULL),
(2, 'เสน่ห์เมตตามหานิยม (วันจันทร์)', '/wallpapers/monday.webp', 'monday', ARRAY['ความรัก', 'เมตตา'], false, 3120, NULL),
(3, 'นักรบกล้าหาญ (วันอังคาร)', '/wallpapers/tuesday.webp', 'tuesday', ARRAY['การงาน', 'แข่งขัน'], false, 1890, NULL),
(4, 'วาจาเรียกทรัพย์ (วันพุธ)', '/wallpapers/wednesday.webp', 'wednesday', ARRAY['การเจรจา', 'ค้าขาย'], false, 2100, NULL),
(5, 'ปัญญาบารมี (วันพฤหัสบดี)', '/wallpapers/thursday.webp', 'thursday', ARRAY['การเรียน', 'ผู้ใหญ่เมตตา'], false, 2750, NULL),
(6, 'ทรัพย์สินพอกพูน (วันศุกร์)', '/wallpapers/friday.webp', 'friday', ARRAY['การเงิน', 'ความสุข'], false, 3420, NULL),
(7, 'อำนาจบารมี (วันเสาร์)', '/wallpapers/saturday.webp', 'saturday', ARRAY['อำนาจ', 'แคล้วคลาด'], false, 1980, NULL),
(8, 'ท้าวเวสสุวรรณ ปลดหนี้', '/wallpapers/thao-wessuwan-v2.webp', 'all', ARRAY['ปลดหนี้', 'กันชง'], true, 4500, NULL),
(9, '4289 ท้าวเวสสุวรรณ (สีชมพู)', '/wallpapers/4289-vessavana-pink.webp', 'all', ARRAY['การเงิน', 'โชคลาภ', '4289'], false, 0, 'เหมาะอย่างยิ่งสำหรับ "คนทำมาค้าขาย, เจ้าของธุรกิจ, Sales, และคนที่ต้องการเสริมดวงโชคลาภและการเงิน" โดยเน้นที่ความราบรื่น (ปางเด็ก) และเงินทองไหลมาเทมา (4289 + ถุงเงิน) ครับ'),
-- Zodiac Wallpapers (ID 1001-1012)
(1001, 'ราศีเมษ', '/wallpapers/ราศีเมษ.webp', 'aries', ARRAY['ราศีเมษ', 'ผู้นำ', 'กล้าหาญ'], true, 0, 'วอลเปเปอร์มงคลราศีเมษ เสริมความเป็นผู้นำ กล้าตัดสินใจ พลังขับเคลื่อนชีวิตไปข้างหน้า'),
(1002, 'ราศีพฤษภ', '/wallpapers/ราศีพฤษภ.webp', 'taurus', ARRAY['ราศีพฤษภ', 'มั่นคง', 'ร่ำรวย'], true, 0, 'วอลเปเปอร์มงคลราศีพฤษภ เสริมความมั่นคง ร่ำรวย อดทนสู่ความสำเร็จ'),
(1003, 'ราศีเมถุน', '/wallpapers/ราศีเมถุน.webp', 'gemini', ARRAY['ราศีเมถุน', 'สื่อสาร', 'เฉลียวฉลาด'], true, 0, 'วอลเปเปอร์มงคลราศีเมถุน เสริมทักษะการสื่อสาร ความเฉลียวฉลาด และไหวพริบ'),
(1004, 'ราศีกรกฎ', '/wallpapers/ราศีกรกฎ .webp', 'cancer', ARRAY['ราศีกรกฎ', 'ครอบครัว', 'อ่อนโยน'], true, 0, 'วอลเปเปอร์มงคลราศีกรกฎ เสริมพลังรัก ครอบครัว และความอบอุ่น'),
(1005, 'ราศีสิงห์', '/wallpapers/ราศีสิงห์.webp', 'leo', ARRAY['ราศีสิงห์', 'บารมี', 'เกียรติยศ'], true, 0, 'วอลเปเปอร์มงคลราศีสิงห์ เสริมบารมี เกียรติยศ ความโดดเด่น'),
(1006, 'ราศีกันย์', '/wallpapers/ราศีกันย์.webp', 'virgo', ARRAY['ราศีกันย์', 'รอบคอบ', 'สติปัญญา'], true, 0, 'วอลเปเปอร์มงคลราศีกันย์ เสริมสติปัญญา ความรอบคอบ และวิจารณญาณ'),
(1007, 'ราศีตุลย์', '/wallpapers/ราศีตุลย์ .webp', 'libra', ARRAY['ราศีตุลย์', 'ความรัก', 'สมดุล'], true, 0, 'วอลเปเปอร์มงคลราศีตุลย์ เสริมความรัก ความสมดุลในชีวิต และเสน่ห์'),
(1008, 'ราศีพิจิก', '/wallpapers/ราศีพิจิก.webp', 'scorpio', ARRAY['ราศีพิจิก', 'พลัง', 'ลึกซึ้ง'], true, 0, 'วอลเปเปอร์มงคลราศีพิจิก เสริมพลังภายใน ความมุ่งมั่น และความลึกซึ้ง'),
(1009, 'ราศีธนู', '/wallpapers/ราศีธนู.webp', 'sagittarius', ARRAY['ราศีธนู', 'โชคลาภ', 'อิสระ'], true, 0, 'วอลเปเปอร์มงคลราศีธนู เสริมโชคลาภ ความอิสรเสรี และการเดินทาง'),
(1010, 'ราศีมังกร', '/wallpapers/ราศีมังกร .webp', 'capricorn', ARRAY['ราศีมังกร', 'ความสำเร็จ', 'อำนาจ'], true, 0, 'วอลเปเปอร์มงคลราศีมังกร เสริมความสำเร็จ อำนาจ และความก้าวหน้า'),
(1011, 'ราศีกุมภ์', '/wallpapers/ราศีกุมภ์.webp', 'aquarius', ARRAY['ราศีกุมภ์', 'สร้างสรรค์', 'อัจฉริยะ'], true, 0, 'วอลเปเปอร์มงคลราศีกุมภ์ เสริมความคิดสร้างสรรค์ นวัตกรรม และความเป็นอัจฉริยะ'),
(1012, 'ราศีมีน', '/wallpapers/ราศีมีน.webp', 'pisces', ARRAY['ราศีมีน', 'จิตวิญญาณ', 'เมตตา'], true, 0, 'วอลเปเปอร์มงคลราศีมีน เสริมญาณทิพย์ พลังจิตวิญญาณ และเมตตา')
on conflict (id) do update 
set name = excluded.name, 
    image = excluded.image, 
    tags = excluded.tags, 
    premium = excluded.premium,
    description = excluded.description;

-- STORAGE SETUP -----------------------------------------------------------

-- Create a new public bucket 'wallpapers' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('wallpapers', 'wallpapers', true)
on conflict (id) do nothing;

-- Set up security policies for the 'wallpapers' bucket

-- 1. Allow public access to view files (SELECT)
drop policy if exists "Give public access to wallpapers" on storage.objects;
create policy "Give public access to wallpapers"
on storage.objects for select
using ( bucket_id = 'wallpapers' );

-- 2. Allow authenticated users (admins) to upload files (INSERT)
drop policy if exists "Allow authenticated uploads" on storage.objects;
create policy "Allow authenticated uploads"
on storage.objects for insert
with check ( bucket_id = 'wallpapers' and auth.role() = 'authenticated' );

-- 3. Allow authenticated users (admins) to update files (UPDATE)
drop policy if exists "Allow authenticated updates" on storage.objects;
create policy "Allow authenticated updates"
on storage.objects for update
with check ( bucket_id = 'wallpapers' and auth.role() = 'authenticated' );

-- 4. Allow authenticated users (admins) to delete files (DELETE)
drop policy if exists "Allow authenticated deletes" on storage.objects;
create policy "Allow authenticated deletes"
on storage.objects for delete
using ( bucket_id = 'wallpapers' and auth.role() = 'authenticated' );

-- Fix sequence sync issue (Critical for avoiding 409 Conflict on new inserts)
-- This ensures the auto-increment counter starts AFTER the last manually inserted ID (e.g., 9)
SELECT setval('wallpapers_id_seq', (SELECT MAX(id) FROM wallpapers));
