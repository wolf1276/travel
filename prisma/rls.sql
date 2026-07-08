-- Row Level Security policies for the Supabase Postgres database.
--
-- All application reads/writes go through server-side Route Handlers using
-- Prisma with a direct Postgres connection, and every query is already
-- scoped to the authenticated user's id there. This file is defense-in-depth
-- only: Supabase exposes these same tables over PostgREST/the anon key by
-- default, so RLS must be on to prevent a client from bypassing the app
-- layer and querying tables directly with the anon key.
--
-- Run this once against your Supabase database after `prisma migrate dev`
-- (e.g. via the Supabase SQL editor, or `psql "$DIRECT_URL" -f prisma/rls.sql`).

alter table public.users enable row level security;
alter table public.places enable row level security;
alter table public.visits enable row level security;
alter table public.photos enable row level security;
alter table public.tags enable row level security;
alter table public.place_tags enable row level security;

create policy "Users read/update their own row" on public.users
  for all
  using (auth.uid()::text = id)
  with check (auth.uid()::text = id);

create policy "Users manage their own places" on public.places
  for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users manage their own visits" on public.visits
  for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users manage their own photos" on public.photos
  for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users manage their own tags" on public.tags
  for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users manage their own place_tags" on public.place_tags
  for all
  using (
    exists (
      select 1 from public.places
      where places.id = place_tags.place_id
        and places.user_id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.places
      where places.id = place_tags.place_id
        and places.user_id = auth.uid()::text
    )
  );
