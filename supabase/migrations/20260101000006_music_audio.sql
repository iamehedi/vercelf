-- ============================================================
--  Music audio: public 'audio' bucket + trim columns
-- ============================================================

-- ---------- Trim columns on music_tracks ----------
alter table public.music_tracks add column if not exists audio_start integer;
alter table public.music_tracks add column if not exists audio_end integer;

-- ---------- Public audio bucket (admin can upload) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio',
  'audio',
  true,
  52428800, -- 50 MiB
  array['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/webm', 'audio/flac']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read audio" on storage.objects;
drop policy if exists "auth insert audio" on storage.objects;
drop policy if exists "auth update audio" on storage.objects;
drop policy if exists "auth delete audio" on storage.objects;

create policy "public read audio" on storage.objects
  for select using (bucket_id = 'audio');

create policy "auth insert audio" on storage.objects
  for insert with check (public.is_admin() and bucket_id = 'audio');

create policy "auth update audio" on storage.objects
  for update using (public.is_admin() and bucket_id = 'audio');

create policy "auth delete audio" on storage.objects
  for delete using (public.is_admin() and bucket_id = 'audio');
