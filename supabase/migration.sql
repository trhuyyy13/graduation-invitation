-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists guests (
  id bigint generated always as identity primary key,
  name text not null,
  display_name text not null,
  salutation text not null default 'Bạn',
  self_ref text not null default 'mình',
  active boolean not null default true
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  slug text,
  name text not null,
  message text not null,
  submitted_at timestamptz not null default now()
);

-- RLS is on with no policies: only the server (using the secret key, which
-- bypasses RLS) can read or write these tables. The publishable/anon key
-- gets nothing, which is correct since this app never queries Supabase
-- from the browser.
alter table guests enable row level security;
alter table messages enable row level security;

-- Seed with the guest list that used to live in src/data/guests.json.
-- Insert order matters: row 1 becomes slug "1", row 2 becomes slug "2", etc.
insert into guests (name, display_name, salutation, self_ref, active) values
  ('Nguyễn Văn Minh', 'Anh Minh', 'Anh', 'em', true),
  ('Nguyễn Đức Anh', 'Đức Anh', 'Bạn', 'mình', true),
  ('Gia đình cô Lan', 'Gia đình cô Lan', 'Cô', 'con', true),
  ('Trần Trung Kiên', 'Em Kiên', 'Anh', 'em', true);
