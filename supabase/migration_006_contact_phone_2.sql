-- Run this once in the Supabase SQL Editor, after migration_005_message_attendance.sql.
-- Adds an optional second contact phone number to event_settings.

alter table event_settings
  add column if not exists contact_phone_2 text not null default '';
