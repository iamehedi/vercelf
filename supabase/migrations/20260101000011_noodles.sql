-- Rename chai → noodles in existing content rows
update public.projects set title = 'Noodles Time', emoji = '🍜' where title = 'Chai Time';
update public.gallery set alt = 'Noodles break', caption = 'Fuel: noodles 🍜' where alt = 'Chai break';
