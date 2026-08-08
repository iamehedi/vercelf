-- ============================================================
--  Music: settings (single row) + playlist tracks
--  Public read, admin-only write (matches lockdown pattern)
-- ============================================================

-- ---------- Settings (single row) ----------
create table if not exists public.music_settings (
  id integer primary key check (id = 1),
  vibe text default '',
  spotify_embed_url text default ''
);

insert into public.music_settings (id, vibe, spotify_embed_url)
values (1, 'Lo-fi, indie & synthwave while I build', '')
on conflict (id) do nothing;

-- ---------- Playlist tracks ----------
create table if not exists public.music_tracks (
  id integer primary key generated always as identity,
  title text not null default '',
  artist text default '',
  duration text default '',
  emoji text default '🎵',
  audio_url text default '',
  sort_order integer not null default 0
);

insert into public.music_tracks (title, artist, duration, emoji, audio_url, sort_order)
select v.title, v.artist, v.duration, v.emoji, v.audio_url, v.sort_order
from (values
  ('Midnight City', 'M83', '4:03', '🌃', '', 0),
  ('Nightcall', 'Kavinsky', '4:18', '🚗', '', 1),
  ('Tadow', 'Masego & FKJ', '5:01', '🎷', '', 2),
  ('Sunset Lover', 'Petit Biscuit', '3:57', '🌅', '', 3),
  ('Sleepyhead', 'Passion Pit', '2:55', '💤', '', 4),
  ('Burning', 'Whitney', '3:10', '🔥', '', 5)
) as v(title, artist, duration, emoji, audio_url, sort_order)
where not exists (select 1 from public.music_tracks t where t.title = v.title);

-- ---------- RLS: public read, admin write ----------
alter table public.music_settings enable row level security;
alter table public.music_tracks enable row level security;

drop policy if exists "public read music_settings" on public.music_settings;
drop policy if exists "auth write music_settings" on public.music_settings;
create policy "public read music_settings" on public.music_settings
  for select using (true);
create policy "auth write music_settings" on public.music_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read music_tracks" on public.music_tracks;
drop policy if exists "auth write music_tracks" on public.music_tracks;
create policy "public read music_tracks" on public.music_tracks
  for select using (true);
create policy "auth write music_tracks" on public.music_tracks
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.music_settings;
alter publication supabase_realtime add table public.music_tracks;
