-- Enable Storage Extension (usually enabled by default)
-- Create a new private bucket 'wallpapers' if it doesn't exist
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
