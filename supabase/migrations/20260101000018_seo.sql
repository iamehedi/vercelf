-- ============================================================
--  SEO foundation
--  • Adds admin-editable SEO fields to the profile row
--    (driven by the <Seo /> runtime metadata + JSON-LD)
--  • Syncs the starter identity to the owner-provided details
--  • Points the GitHub social at the real profile
--  Idempotent: safe to run multiple times.
-- ============================================================

-- ---------- New SEO columns on profile ----------
alter table public.profile
  add column if not exists seo_title text default '';
alter table public.profile
  add column if not exists meta_description text default '';
alter table public.profile
  add column if not exists og_image text default '';

-- ---------- Length + URL constraints (defense in depth) ----------
alter table public.profile
  add constraint profile_seo_len_check check (
    char_length(coalesce(seo_title, '')) <= 120
    and char_length(coalesce(meta_description, '')) <= 320
    and char_length(coalesce(og_image, '')) <= 500
  );

alter table public.profile
  add constraint profile_og_image_check check (
    coalesce(og_image, '') = ''
    or og_image ~* '^https?://'
  );

-- ---------- Sync starter identity to the owner-provided details ----------
-- Only touches rows that still carry the original template values, so any
-- admin edits made after setup are preserved.
update public.profile
set role = 'AI-Assisted Full-Stack Developer',
    location = 'Rajshahi, Bangladesh',
    email = 'iamehedihsn@gmail.com',
    bio = 'I''m Mehedi Hasan, an AI-assisted full-stack developer from Rajshahi, Bangladesh. I turn wild ideas into polished products — from pixel-perfect UI to API design — and I love shipping fast, friendly software that feels a little more fun than the average.'
where id = 1
  and (location = 'Dhaka, Bangladesh' or email = 'hello@mehedi.dev');

-- ---------- Point the GitHub social at the real profile ----------
update public.socials
set url = 'https://github.com/iamehedi'
where label = 'GitHub' and url = 'https://github.com/';
