-- Run this once in the Supabase SQL Editor, after migration_003_guest_slug.sql.
-- Backs the admin cookie with a real server-side session: a random opaque
-- token (not derived from the password) that can be revoked on logout and
-- gets rotated periodically by the app.

create table if not exists admin_sessions (
  token text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table admin_sessions enable row level security;
