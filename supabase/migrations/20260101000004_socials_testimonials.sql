-- ============================================================
--  Restore starter testimonials + expand social buttons
--  Adds Facebook, Instagram, WhatsApp; restores Dribbble.
--  Idempotent: only inserts rows that don't already exist.
-- ============================================================

-- ---------- Testimonials: restore originals (if missing) ----------
insert into public.testimonials (quote, name, role, emoji, sort_order)
select v.quote, v.name, v.role, v.emoji, v.sort_order
from (values
  ('Mehedi is a unicorn. He delivered a full product in three weeks and the design made our customers say "wow".', 'Sarah Chen', 'CEO, Nimbus', '🧑‍💼', 0),
  ('Fast, communicative and obsessive about quality. Our dashboard load times went from seconds to instant.', 'David Okafor', 'CTO, Pulse', '👨‍💻', 1),
  ('The rare developer who cares about the details most people miss. Every interaction feels delightful.', 'Priya Sharma', 'Product Lead, Snacky', '👩‍🎨', 2)
) as v(quote, name, role, emoji, sort_order)
where not exists (select 1 from public.testimonials t where t.name = v.name);

-- ---------- Clean up temporary test rows ----------
delete from public.testimonials where name in ('Temp Person', 'T2');

-- ---------- Socials: restore Dribbble + add Facebook / Instagram / WhatsApp ----------
insert into public.socials (label, url, sort_order)
select v.label, v.url, v.sort_order
from (values
  ('Dribbble',   'https://dribbble.com/',    3),
  ('Facebook',   'https://facebook.com/',    4),
  ('Instagram',  'https://instagram.com/',   5),
  ('WhatsApp',   'https://wa.me/',           6)
) as v(label, url, sort_order)
where not exists (select 1 from public.socials s where s.label = v.label);
