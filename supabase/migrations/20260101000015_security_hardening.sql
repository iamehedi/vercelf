-- ============================================================
--  SECURITY HARDENING: DB-level input constraints (defense in depth)
--  RLS is the access boundary; these CHECK constraints are the
--  data-integrity boundary. They enforce sane limits and block
--  scriptable URL schemes (javascript:, data:, vbscript:) even if
--  a client is bypassed. Limits are generous so existing content
--  is never rejected.
-- ============================================================

-- ---------- profile ----------
alter table public.profile
  add constraint profile_len_check check (
    char_length(coalesce(name, '')) <= 120
    and char_length(coalesce(first_name, '')) <= 80
    and char_length(coalesce(role, '')) <= 200
    and char_length(coalesce(tagline, '')) <= 300
    and char_length(coalesce(bio, '')) <= 6000
    and char_length(coalesce(location, '')) <= 200
    and char_length(coalesce(email, '')) <= 254
    and char_length(coalesce(resume_url, '')) <= 500
    and char_length(coalesce(avatar_emoji, '')) <= 32
  );

alter table public.profile
  add constraint profile_email_format_check check (
    coalesce(email, '') = ''
    or email ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
  );

alter table public.profile
  add constraint profile_resume_url_check check (
    coalesce(resume_url, '') = ''
    or resume_url = '#'
    or resume_url ~* '^https?://'
  );

-- ---------- socials ----------
alter table public.socials
  add constraint socials_len_check check (
    char_length(coalesce(label, '')) <= 100
    and char_length(coalesce(url, '')) <= 500
  );

-- Social links may be scheme-less (the app prepends https://) — block only scriptable schemes.
alter table public.socials
  add constraint socials_url_scheme_check check (
    coalesce(url, '') !~* '^javascript:'
    and coalesce(url, '') !~* '^data:'
    and coalesce(url, '') !~* '^vbscript:'
  );

-- ---------- projects ----------
alter table public.projects
  add constraint projects_len_check check (
    char_length(coalesce(title, '')) <= 200
    and char_length(coalesce(emoji, '')) <= 32
    and char_length(coalesce(description, '')) <= 6000
    and char_length(coalesce(accent, '')) <= 64
    and char_length(coalesce(demo, '')) <= 500
    and char_length(coalesce(repo, '')) <= 500
    and jsonb_array_length(coalesce(tags, '[]'::jsonb)) <= 50
  );

alter table public.projects
  add constraint projects_url_check check (
    (coalesce(demo, '') = '' or demo = '#' or demo ~* '^https?://')
    and (coalesce(repo, '') = '' or repo = '#' or repo ~* '^https?://')
  );

-- ---------- experience ----------
alter table public.experience
  add constraint experience_len_check check (
    char_length(coalesce(role, '')) <= 200
    and char_length(coalesce(company, '')) <= 200
    and char_length(coalesce(period, '')) <= 200
    and char_length(coalesce(emoji, '')) <= 32
    and jsonb_array_length(coalesce(points, '[]'::jsonb)) <= 30
  );

-- ---------- gallery ----------
alter table public.gallery
  add constraint gallery_len_check check (
    char_length(coalesce(src, '')) <= 500
    and char_length(coalesce(alt, '')) <= 300
    and char_length(coalesce(caption, '')) <= 300
  );

alter table public.gallery
  add constraint gallery_src_check check (
    coalesce(src, '') = ''
    or src = '#'
    or src ~* '^https?://'
  );

-- ---------- testimonials ----------
alter table public.testimonials
  add constraint testimonials_len_check check (
    char_length(coalesce(quote, '')) <= 3000
    and char_length(coalesce(name, '')) <= 200
    and char_length(coalesce(role, '')) <= 300
    and char_length(coalesce(emoji, '')) <= 32
  );

-- ---------- music_settings ----------
alter table public.music_settings
  add constraint music_settings_len_check check (
    char_length(coalesce(vibe, '')) <= 300
    and char_length(coalesce(spotify_embed_url, '')) <= 500
  );

-- The Spotify embed is rendered as an <iframe> — only allow official embed URLs.
alter table public.music_settings
  add constraint music_settings_embed_check check (
    coalesce(spotify_embed_url, '') = ''
    or spotify_embed_url ~* '^https://open\.spotify\.com/embed/'
  );

-- ---------- music_tracks ----------
alter table public.music_tracks
  add constraint music_tracks_len_check check (
    char_length(coalesce(title, '')) <= 200
    and char_length(coalesce(artist, '')) <= 200
    and char_length(coalesce(duration, '')) <= 50
    and char_length(coalesce(emoji, '')) <= 32
    and char_length(coalesce(audio_url, '')) <= 500
    and char_length(coalesce(cover_url, '')) <= 500
  );

alter table public.music_tracks
  add constraint music_tracks_url_check check (
    (coalesce(audio_url, '') = '' or audio_url ~* '^https?://')
    and (coalesce(cover_url, '') = '' or cover_url ~* '^https?://')
  );

alter table public.music_tracks
  add constraint music_tracks_trim_check check (
    (audio_start is null or (audio_start >= 0 and audio_start <= 36000))
    and (audio_end is null or (audio_end >= 0 and audio_end <= 36000))
    and (audio_start is null or audio_end is null or audio_start < audio_end)
  );

-- ---------- skills ----------
alter table public.skills
  add constraint skills_len_check check (
    char_length(coalesce(group_title, '')) <= 100
    and char_length(coalesce(group_emoji, '')) <= 32
    and char_length(coalesce(name, '')) <= 100
  );

alter table public.skills
  add constraint skills_level_check check (
    level is null or (level >= 0 and level <= 100)
  );

-- ---------- skills_settings ----------
alter table public.skills_settings
  add constraint skills_settings_marquee_check check (
    char_length(coalesce(marquee, '')) <= 6000
  );

-- jsonb arrays can't be validated inside a CHECK constraint (no subqueries) — use a trigger
create or replace function public.check_text_array()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  col_name text := TG_ARGV[0];
  max_len  int  := TG_ARGV[1]::int;
  item     jsonb;
begin
  for item in select * from jsonb_array_elements(to_jsonb(NEW) -> col_name) loop
    if jsonb_typeof(item) <> 'string' or char_length(item #>> '{}') > max_len then
      raise exception 'Array item in % is not a string or exceeds % chars', col_name, max_len;
    end if;
  end loop;
  return NEW;
end;
$$;

drop trigger if exists trg_projects_tags_check on public.projects;
create trigger trg_projects_tags_check
before insert or update on public.projects
for each row execute function public.check_text_array('tags', 100);

drop trigger if exists trg_experience_points_check on public.experience;
create trigger trg_experience_points_check
before insert or update on public.experience
for each row execute function public.check_text_array('points', 2000);
