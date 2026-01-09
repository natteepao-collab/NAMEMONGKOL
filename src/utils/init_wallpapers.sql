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

-- Functions
create or replace function increment_wallpaper_downloads(wallpaper_id int)
returns void as $$
begin
  update wallpapers
  set downloads = downloads + 1
  where id = wallpaper_id;
end;
$$ language plpgsql security definer;

-- Seed Data (Upsert)
insert into wallpapers (id, name, image, day, tags, premium, downloads, description)
values
(1, 'มหาเทพประทานทรัพย์ (วันอาทิตย์)', '/Wallpaper/คนเกิดวันเอาทิตย์.png', 'sunday', ARRAY['การเงิน', 'อำนาจ'], false, 2540, NULL),
(2, 'เสน่ห์เมตตามหานิยม (วันจันทร์)', '/Wallpaper/คนเกิดวันจันทร์.png', 'monday', ARRAY['ความรัก', 'เมตตา'], false, 3120, NULL),
(3, 'นักรบกล้าหาญ (วันอังคาร)', '/Wallpaper/คนเกิดวันอังคาร.png', 'tuesday', ARRAY['การงาน', 'แข่งขัน'], false, 1890, NULL),
(4, 'วาจาเรียกทรัพย์ (วันพุธ)', '/Wallpaper/คนเกิดพุธ.png', 'wednesday', ARRAY['การเจรจา', 'ค้าขาย'], false, 2100, NULL),
(5, 'ปัญญาบารมี (วันพฤหัสบดี)', '/Wallpaper/คนเกิดพฤหัส.png', 'thursday', ARRAY['การเรียน', 'ผู้ใหญ่เมตตา'], false, 2750, NULL),
(6, 'ทรัพย์สินพอกพูน (วันศุกร์)', '/Wallpaper/คนเกิดศุกร์.png', 'friday', ARRAY['การเงิน', 'ความสุข'], false, 3420, NULL),
(7, 'อำนาจบารมี (วันเสาร์)', '/Wallpaper/คนเกิดวันเสาร์.png', 'saturday', ARRAY['อำนาจ', 'แคล้วคลาด'], false, 1980, NULL),
(8, 'ท้าวเวสสุวรรณ ปลดหนี้', '/Wallpaper/thao-wessuwan-v2.png', 'all', ARRAY['ปลดหนี้', 'กันชง'], true, 4500, NULL),
(9, '4289 ท้าวเวสสุวรรณ (สีชมพู)', '/Wallpaper/4289_ท้าวเวสสุวรรณ_สีชมพู.png', 'all', ARRAY['การเงิน', 'โชคลาภ', '4289'], false, 0, 'เหมาะอย่างยิ่งสำหรับ "คนทำมาค้าขาย, เจ้าของธุรกิจ, Sales, และคนที่ต้องการเสริมดวงโชคลาภและการเงิน" โดยเน้นที่ความราบรื่น (ปางเด็ก) และเงินทองไหลมาเทมา (4289 + ถุงเงิน) ครับ')
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
