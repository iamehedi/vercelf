-- Album cover image for each music track
 alter table public.music_tracks add column if not exists cover_url text default '';
