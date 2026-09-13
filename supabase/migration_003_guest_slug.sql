-- Run this once in the Supabase SQL Editor, after migration_002_event_settings.sql.
-- Adds a persistent, admin-editable `slug` column to guests, replacing the
-- old scheme where a guest's URL was just their row position (1, 2, 3...).
-- That leaked information: anyone could increment the number in their own
-- link and read other guests' personalized invitations.

alter table guests add column if not exists slug text;

-- Backfill existing rows with their current position-based slug (same value
-- their link already uses today) so nothing breaks. Rename them to real
-- names/words in the admin panel whenever you like.
with numbered as (
  select id, row_number() over (order by id) as rn
  from guests
)
update guests set slug = numbered.rn::text
from numbered
where guests.id = numbered.id and guests.slug is null;

alter table guests alter column slug set not null;
alter table guests add constraint guests_slug_unique unique (slug);
