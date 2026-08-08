-- Let the Level field be cleared in the admin without violating NOT NULL
 alter table public.skills alter column level drop not null;
