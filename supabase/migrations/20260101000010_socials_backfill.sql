-- Backfill socials to match the default seed (idempotent)
insert into public.socials (label, url, sort_order)
select v.label, v.url, v.sort_order
from (values
  ('Facebook', 'https://facebook.com/', 4),
  ('Instagram', 'https://instagram.com/', 5),
  ('WhatsApp', 'https://wa.me/', 6)
) as v(label, url, sort_order)
where not exists (select 1 from public.socials s where s.label = v.label);
