-- Run this once in the Supabase SQL Editor, after migration.sql.
-- Adds an editable event-info settings row (date/time/venue/address/phone)
-- that the admin panel can update instead of these being hardcoded.

create table if not exists event_settings (
  id int primary key default 1,
  date text not null,
  start_time text not null,
  end_time text not null,
  venue text not null,
  university text not null,
  address text not null,
  contact_phone text not null,
  constraint event_settings_singleton check (id = 1)
);

alter table event_settings enable row level security;

insert into event_settings (id, date, start_time, end_time, venue, university, address, contact_phone)
values (
  1,
  '2026-09-26',
  '09:00',
  '12:00',
  'Hội trường C2',
  'Đại học Bách khoa Hà Nội',
  'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
  '0865.505.899'
)
on conflict (id) do nothing;
