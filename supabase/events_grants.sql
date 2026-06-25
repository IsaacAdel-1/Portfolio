-- ---------------------------------------------------------------------------
-- Fix: 401 "permission denied for table events" (Postgres error 42501) on
-- client-side inserts using the publishable (anon) key.
--
-- Root cause: RLS policies and table GRANTs are SEPARATE layers. Postgres
-- checks the base-table privilege BEFORE any RLS policy runs. The `events`
-- table had permissive RLS policies but the `anon` role was never granted the
-- underlying table privilege, so inserts were rejected with 42501 (surfaced as
-- HTTP 401) before RLS was ever evaluated.
--
-- Run this ONCE in the Supabase dashboard -> SQL Editor (it executes as an
-- admin role, so no service_role key is needed in app code).
--
-- Least privilege:
--   anon          -> INSERT only  (public site writes events, cannot read)
--   authenticated -> INSERT + SELECT (dashboard reads its own data later)
-- The existing RLS policies still apply on top of these grants.
-- ---------------------------------------------------------------------------

grant insert on table public.events to anon;
grant insert, select on table public.events to authenticated;

-- Verify the grants landed:
--   select grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_schema = 'public' and table_name = 'events'
--   order by grantee, privilege_type;
