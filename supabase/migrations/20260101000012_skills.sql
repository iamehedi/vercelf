-- ============================================================
--  Skills: editable rows + a single-row settings table
--  Public read, admin-only write (matches lockdown pattern)
--  Grouping happens client-side via group_title
-- ============================================================

create table if not exists public.skills (
  id integer primary key generated always as identity,
  group_title text not null default '',
  group_emoji text default '⭐',
  name text not null default '',
  level integer not null default 0,
  sort_order integer not null default 0
);

insert into public.skills (group_title, group_emoji, name, level, sort_order)
select v.group_title, v.group_emoji, v.name, v.level, v.sort_order
from (values
  ('Frontend', '🎨', 'Flutter', 96, 0),
  ('Frontend', '🎨', 'React', 92, 1),
  ('Frontend', '🎨', 'TypeScript', 88, 2),
  ('Frontend', '🎨', 'Tailwind CSS', 95, 3),
  ('Frontend', '🎨', 'Next.js', 85, 4),
  ('Frontend', '🎨', 'Vite', 90, 5),
  ('Backend', '⚙️', 'Python', 95, 6),
  ('Backend', '⚙️', 'C++', 90, 7),
  ('Backend', '⚙️', 'Node.js', 90, 8),
  ('Backend', '⚙️', 'Express', 87, 9),
  ('Backend', '⚙️', 'PostgreSQL', 80, 10),
  ('Backend', '⚙️', 'MongoDB', 82, 11),
  ('Backend', '⚙️', 'GraphQL', 75, 12),
  ('Tools & Cloud', '🚀', 'Supabase', 96, 13),
  ('Tools & Cloud', '🚀', 'Firebase', 92, 14),
  ('Tools & Cloud', '🚀', 'WordPress', 94, 15),
  ('Tools & Cloud', '🚀', 'Git & GitHub', 93, 16),
  ('Tools & Cloud', '🚀', 'Docker', 78, 17),
  ('Tools & Cloud', '🚀', 'AWS', 70, 18),
  ('Tools & Cloud', '🚀', 'Vercel', 88, 19),
  ('Tools & Cloud', '🚀', 'CI/CD', 76, 20)
) as v(group_title, group_emoji, name, level, sort_order)
where not exists (select 1 from public.skills);

create table if not exists public.skills_settings (
  id integer primary key check (id = 1),
  marquee text default ''
);

insert into public.skills_settings (id, marquee)
values (1, 'React
Node.js
TypeScript
Tailwind
Next.js
Flutter
Python
C++
GraphQL
PostgreSQL
Supabase
Firebase
Docker
AWS
Vite
WordPress
Figma
Three.js')
on conflict (id) do nothing;

-- ---------- RLS: public read, admin write ----------
alter table public.skills enable row level security;
alter table public.skills_settings enable row level security;

drop policy if exists "public read skills" on public.skills;
drop policy if exists "auth write skills" on public.skills;
create policy "public read skills" on public.skills
  for select using (true);
create policy "auth write skills" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read skills_settings" on public.skills_settings;
drop policy if exists "auth write skills_settings" on public.skills_settings;
create policy "public read skills_settings" on public.skills_settings
  for select using (true);
create policy "auth write skills_settings" on public.skills_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.skills;
alter publication supabase_realtime add table public.skills_settings;
