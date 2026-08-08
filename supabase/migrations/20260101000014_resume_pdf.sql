-- Allow PDF résumés in the public photos bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set allowed_mime_types = excluded.allowed_mime_types;
