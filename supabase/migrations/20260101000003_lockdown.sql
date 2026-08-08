-- ============================================================
--  SECURITY LOCKDOWN: single-admin write access
--  Only user d1e93222-bd7d-4d67-8e59-5704399e4cf2
--  (iamehedihsn@gmail.com) may INSERT/UPDATE/DELETE.
--  Public SELECT (read) is unchanged.
-- ============================================================

-- ---------- Helper: is the current user the admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.uid() = 'd1e93222-bd7d-4d67-8e59-5704399e4cf2'::uuid,
    false
  );
$$;

-- ---------- Content tables: write only as admin ----------
do $$
declare t text;
begin
  foreach t in array array['profile','socials','projects','experience','gallery','testimonials'] loop
    execute format('drop policy if exists "auth write %1$s" on public.%1$s', t);
    execute format(
      'create policy "auth write %1$s" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- ---------- Storage: upload/overwrite/delete only as admin ----------
drop policy if exists "auth insert photos" on storage.objects;
drop policy if exists "auth update photos" on storage.objects;
drop policy if exists "auth delete photos" on storage.objects;

create policy "auth insert photos" on storage.objects
  for insert with check (public.is_admin() and bucket_id = 'photos');

create policy "auth update photos" on storage.objects
  for update using (public.is_admin() and bucket_id = 'photos');

create policy "auth delete photos" on storage.objects
  for delete using (public.is_admin() and bucket_id = 'photos');
