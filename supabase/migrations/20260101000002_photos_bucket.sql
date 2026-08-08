-- ============================================================
--  Ensure the public 'photos' storage bucket exists
--  Idempotent: safe to run multiple times
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  52428800, -- 50 MiB (matches supabase/config.toml)
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Make sure the object-level policies from the init migration exist
-- (idempotent re-application is safe because each is guarded by drops)
drop policy if exists "public read photos" on storage.objects;
drop policy if exists "auth insert photos" on storage.objects;
drop policy if exists "auth update photos" on storage.objects;
drop policy if exists "auth delete photos" on storage.objects;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "auth insert photos" on storage.objects
  for insert with check (auth.role() = 'authenticated' and bucket_id = 'photos');

create policy "auth update photos" on storage.objects
  for update using (auth.role() = 'authenticated' and bucket_id = 'photos');

create policy "auth delete photos" on storage.objects
  for delete using (auth.role() = 'authenticated' and bucket_id = 'photos');
