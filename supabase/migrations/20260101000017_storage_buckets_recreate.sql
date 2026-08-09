-- ============================================================
--  Recreate the public storage buckets
--  The photos & audio buckets went missing on the remote project,
--  which made every file upload fail with "failed to fetch".
--  This re-creates them with the exact config from the original
--  migrations and restores the storage RLS policies
--  (public reads, admin-only writes).
--  Idempotent: safe to run multiple times.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  52428800, -- 50 MiB (matches supabase/config.toml)
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio',
  'audio',
  true,
  52428800, -- 50 MiB
  array['audio/mpeg', 'audio/mp3', 'audio/mpeg3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/webm', 'audio/flac']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------- Storage RLS policies ----------
drop policy if exists "public read photos" on storage.objects;
drop policy if exists "public read audio" on storage.objects;
drop policy if exists "auth insert photos" on storage.objects;
drop policy if exists "auth update photos" on storage.objects;
drop policy if exists "auth delete photos" on storage.objects;
drop policy if exists "auth insert audio" on storage.objects;
drop policy if exists "auth update audio" on storage.objects;
drop policy if exists "auth delete audio" on storage.objects;

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "public read audio" on storage.objects
  for select using (bucket_id = 'audio');

create policy "auth insert photos" on storage.objects
  for insert with check (public.is_admin() and bucket_id = 'photos');

create policy "auth update photos" on storage.objects
  for update using (public.is_admin() and bucket_id = 'photos');

create policy "auth delete photos" on storage.objects
  for delete using (public.is_admin() and bucket_id = 'photos');

create policy "auth insert audio" on storage.objects
  for insert with check (public.is_admin() and bucket_id = 'audio');

create policy "auth update audio" on storage.objects
  for update using (public.is_admin() and bucket_id = 'audio');

create policy "auth delete audio" on storage.objects
  for delete using (public.is_admin() and bucket_id = 'audio');
