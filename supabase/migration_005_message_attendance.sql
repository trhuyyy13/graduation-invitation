-- Run this once in the Supabase SQL Editor, after migration_004_admin_sessions.sql.
-- Adds RSVP status to each guest message so the admin page can show who
-- expects to attend, who cannot, and who will confirm later.

alter table messages
  add column if not exists attendance text;

alter table messages
  alter column attendance set default 'attending';

update messages
set attendance = 'attending'
where attendance is null;

alter table messages
  alter column attendance set not null;

alter table messages
  drop constraint if exists messages_attendance_check;

alter table messages
  add constraint messages_attendance_check
  check (
    attendance in ('attending', 'not_attending', 'maybe_later')
  );
