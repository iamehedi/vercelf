-- Tighten the social URL scheme guard to also reject scriptable schemes with
-- leading whitespace (browsers trim href attribute whitespace before parsing).
alter table public.socials drop constraint if exists socials_url_scheme_check;

alter table public.socials
  add constraint socials_url_scheme_check check (
    coalesce(url, '') !~* '^[[:space:]]*(javascript|data|vbscript):'
  );
