-- Project cover image — shows instead of the emoji tile on the site
alter table public.projects add column if not exists cover_url text default '';
