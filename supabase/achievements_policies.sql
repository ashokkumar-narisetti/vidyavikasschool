-- Achievements table and storage RLS policies.
-- Run this in Supabase SQL Editor.

alter table if exists public.achievements enable row level security;

drop policy if exists "Public can read achievements" on public.achievements;
create policy "Public can read achievements"
on public.achievements
for select
to public
using (true);

drop policy if exists "Authenticated can manage achievements" on public.achievements;
create policy "Authenticated can manage achievements"
on public.achievements
for all
to authenticated
using (true)
with check (true);

-- Storage policies for school-assets/achievements/*
-- Needed when achievement photos are uploaded from admin panel.

drop policy if exists "Achievement photos are publicly readable" on storage.objects;
create policy "Achievement photos are publicly readable"
on storage.objects
for select
to public
using (
  bucket_id = 'school-assets'
  and name like 'achievements/%'
);

drop policy if exists "Authenticated can upload achievement photos" on storage.objects;
create policy "Authenticated can upload achievement photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'school-assets'
  and name like 'achievements/%'
);

drop policy if exists "Authenticated can update achievement photos" on storage.objects;
create policy "Authenticated can update achievement photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'school-assets'
  and name like 'achievements/%'
)
with check (
  bucket_id = 'school-assets'
  and name like 'achievements/%'
);

drop policy if exists "Authenticated can delete achievement photos" on storage.objects;
create policy "Authenticated can delete achievement photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'school-assets'
  and name like 'achievements/%'
);
