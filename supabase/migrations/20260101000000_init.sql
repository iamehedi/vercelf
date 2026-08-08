-- ============================================================
--  Portfolio schema for Supabase
--  Run this in Supabase Dashboard → SQL Editor → New query
--  (Tables are public-read, authenticated-write, realtime-enabled)
-- ============================================================

-- ---------- Profile (single row) ----------
create table if not exists public.profile (
  id integer primary key check (id = 1),
  name text default '',
  first_name text default '',
  role text default '',
  tagline text default '',
  bio text default '',
  location text default '',
  email text default '',
  resume_url text default '',
  avatar_emoji text default '🧑‍🚀'
);

insert into public.profile (id, name, first_name, role, tagline, bio, location, email, resume_url, avatar_emoji)
values (
  1,
  'Mehedi Hasan',
  'Mehedi',
  'Full-Stack Developer',
  'I build playful, blazing-fast web apps people love using.',
  'Full-stack developer who turns wild ideas into polished products. I sweat the details — from pixel-perfect UI to API design — and I love shipping fast, friendly software that feels a little more fun than the average.',
  'Dhaka, Bangladesh',
  'hello@mehedi.dev',
  '#',
  '🧑‍🚀'
)
on conflict (id) do nothing;

-- ---------- Socials ----------
create table if not exists public.socials (
  id integer primary key generated always as identity,
  label text not null,
  url text not null default '',
  sort_order integer not null default 0
);

insert into public.socials (label, url, sort_order) values
  ('GitHub', 'https://github.com/', 0),
  ('LinkedIn', 'https://linkedin.com/in/', 1),
  ('Twitter', 'https://x.com/', 2),
  ('Dribbble', 'https://dribbble.com/', 3)
on conflict do nothing;

-- ---------- Projects ----------
create table if not exists public.projects (
  id integer primary key generated always as identity,
  title text not null default '',
  emoji text default '💡',
  description text default '',
  tags jsonb not null default '[]',
  accent text default 'bg-punch/15',
  demo text default '',
  repo text default '',
  featured boolean not null default false,
  sort_order integer not null default 0
);

insert into public.projects (title, emoji, description, tags, accent, demo, repo, featured, sort_order) values
  ('Nimbus Notes', '📝', 'A collaborative note-taking app with real-time sync, markdown, and AI summarisation. Syncs across every device in under 40ms.',
   '["React","Node.js","WebSockets","Redis"]', 'bg-punch/15', '#', 'https://github.com/', true, 0),
  ('Pulse Dashboard', '📊', 'Real-time analytics dashboard streaming 1M+ events a day. Custom charts, alerts and a drag-and-drop widget grid.',
   '["TypeScript","D3.js","PostgreSQL","AWS"]', 'bg-ocean/15', '#', 'https://github.com/', true, 1),
  ('Snacky', '🍜', 'Food delivery web app with live order tracking, smart reordering and a map that makes hunger feel fast.',
   '["Next.js","Tailwind","Stripe","Maps API"]', 'bg-sun/25', '#', 'https://github.com/', true, 2),
  ('FitBot', '💪', 'AI workout coach that generates personalised routines from a quick chat — complete with form-check GIFs.',
   '["React","OpenAI API","Supabase"]', 'bg-mint/15', '#', 'https://github.com/', false, 3),
  ('Travel Tales', '✈️', 'A storytelling platform for travellers with interactive maps, photo journals and community challenges.',
   '["Vue","GraphQL","MongoDB"]', 'bg-grape/15', '#', 'https://github.com/', false, 4),
  ('Noodles Time', '🍜', 'A mood-based music & focus timer app that curates lo-fi playlists to match how you feel right now.',
   '["React Native","Spotify API"]', 'bg-punch/15', '#', 'https://github.com/', false, 5)
on conflict do nothing;

-- ---------- Experience ----------
create table if not exists public.experience (
  id integer primary key generated always as identity,
  role text not null default '',
  company text not null default '',
  period text default '',
  emoji text default '⭐',
  points jsonb not null default '[]',
  sort_order integer not null default 0
);

insert into public.experience (role, company, period, emoji, points, sort_order) values
  ('Senior Full-Stack Developer', 'Pixel Foundry', '2023 — Present', '🔵',
   '["Led a team of 6 shipping a SaaS platform used by 40k+ users","Cut page load times by 58% with code-splitting and edge caching","Designed the API layer now powering 3 client products"]', 0),
  ('Full-Stack Developer', 'Code & Canvas', '2021 — 2023', '🟢',
   '["Built and launched 15+ client web apps end-to-end","Introduced a component library that halved build time","Mentored 4 junior developers into senior roles"]', 1),
  ('Frontend Developer', 'Bright Labs', '2020 — 2021', '🟣',
   '["Shipped accessible, animated marketing sites","Implemented design systems in React + Tailwind","Won \"Best UI of the Year\" at the internal hackathon"]', 2)
on conflict do nothing;

-- ---------- Gallery ----------
create table if not exists public.gallery (
  id integer primary key generated always as identity,
  src text not null default '',
  alt text default '',
  caption text default '',
  sort_order integer not null default 0
);

insert into public.gallery (src, alt, caption, sort_order) values
  ('https://picsum.photos/seed/mhdev1/600/800', 'Hackathon weekend', 'Hackathon mode 🏆', 0),
  ('https://picsum.photos/seed/mhdev2/600/700', 'My desk setup', 'My happy place 🖥️', 1),
  ('https://picsum.photos/seed/mhdev3/600/900', 'Noodles break', 'Fuel: noodles 🍜', 2),
  ('https://picsum.photos/seed/mhdev4/600/700', 'Team offsite', 'Team day 🧑‍🤝‍🧑', 3),
  ('https://picsum.photos/seed/mhdev5/600/800', 'Late night coding', 'Shipping at night 🌙', 4),
  ('https://picsum.photos/seed/mhdev6/600/900', 'Speaking at a meetup', 'On stage 🎤', 5),
  ('https://picsum.photos/seed/mhdev7/600/600', 'Sketching ideas', 'Idea sketches 📓', 6),
  ('https://picsum.photos/seed/mhdev8/600/800', 'Evening city walk', 'Code walk 🚶', 7),
  ('https://picsum.photos/seed/mhdev9/600/700', 'Coffee and code', 'Coffee + code ☕💻', 8)
on conflict do nothing;

-- ---------- Testimonials ----------
create table if not exists public.testimonials (
  id integer primary key generated always as identity,
  quote text not null default '',
  name text not null default '',
  role text default '',
  emoji text default '⭐',
  sort_order integer not null default 0
);

insert into public.testimonials (quote, name, role, emoji, sort_order) values
  ('Mehedi is a unicorn. He delivered a full product in three weeks and the design made our customers say "wow".', 'Sarah Chen', 'CEO, Nimbus', '🧑‍💼', 0),
  ('Fast, communicative and obsessive about quality. Our dashboard load times went from seconds to instant.', 'David Okafor', 'CTO, Pulse', '👨‍💻', 1),
  ('The rare developer who cares about the details most people miss. Every interaction feels delightful.', 'Priya Sharma', 'Product Lead, Snacky', '👩‍🎨', 2)
on conflict do nothing;

-- ---------- RLS: public can read, authenticated can write ----------
alter table public.profile enable row level security;
alter table public.socials enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profile','socials','projects','experience','gallery','testimonials'] loop
    execute format('drop policy if exists "public read %1$s" on public.%1$s', t);
    execute format('drop policy if exists "auth write %1$s" on public.%1$s', t);
    execute format('create policy "public read %1$s" on public.%1$s for select using (true)', t);
    execute format('create policy "auth write %1$s" on public.%1$s for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t);
  end loop;
end $$;

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.profile;
alter publication supabase_realtime add table public.socials;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.experience;
alter publication supabase_realtime add table public.gallery;
alter publication supabase_realtime add table public.testimonials;

-- ---------- Storage bucket for photos ----------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

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
