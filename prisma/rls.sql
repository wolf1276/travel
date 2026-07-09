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
alter table public.couples enable row level security;
alter table public.couple_invites enable row level security;
alter table public.places enable row level security;
alter table public.visits enable row level security;
alter table public.photos enable row level security;
alter table public.tags enable row level security;
alter table public.place_tags enable row level security;

create policy "Users read/update their own row" on public.users
  for all
  using (auth.uid()::text = id)
  with check (auth.uid()::text = id);

create policy "Users read their own couple" on public.couples
  for select
  using (
    exists (
      select 1 from public.users
      where users.couple_id = couples.id
        and users.id = auth.uid()::text
    )
  );

create policy "Users manage invites for their own couple" on public.couple_invites
  for all
  using (
    exists (
      select 1 from public.users
      where users.couple_id = couple_invites.couple_id
        and users.id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.users
      where users.couple_id = couple_invites.couple_id
        and users.id = auth.uid()::text
    )
  );

create policy "Couple members manage their couple's places" on public.places
  for all
  using (
    exists (
      select 1 from public.users
      where users.couple_id = places.couple_id
        and users.id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.users
      where users.couple_id = places.couple_id
        and users.id = auth.uid()::text
    )
  );

create policy "Couple members manage their couple's visits" on public.visits
  for all
  using (
    exists (
      select 1 from public.places
      join public.users on users.couple_id = places.couple_id
      where places.id = visits.place_id
        and users.id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.places
      join public.users on users.couple_id = places.couple_id
      where places.id = visits.place_id
        and users.id = auth.uid()::text
    )
  );

create policy "Couple members manage their couple's photos" on public.photos
  for all
  using (
    exists (
      select 1 from public.visits
      join public.places on places.id = visits.place_id
      join public.users on users.couple_id = places.couple_id
      where visits.id = photos.visit_id
        and users.id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.visits
      join public.places on places.id = visits.place_id
      join public.users on users.couple_id = places.couple_id
      where visits.id = photos.visit_id
        and users.id = auth.uid()::text
    )
  );

create policy "Users manage their own tags" on public.tags
  for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Couple members manage their couple's place_tags" on public.place_tags
  for all
  using (
    exists (
      select 1 from public.places
      join public.users on users.couple_id = places.couple_id
      where places.id = place_tags.place_id
        and users.id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.places
      join public.users on users.couple_id = places.couple_id
      where places.id = place_tags.place_id
        and users.id = auth.uid()::text
    )
  );

-- Storage: the "photos" bucket is public (object *downloads* bypass RLS by
-- design, via /storage/v1/object/public/...), but the Storage API's list/
-- read-metadata operations still go through these policies. Objects are
-- uploaded into a folder named after the uploader's auth uid
-- (see services/supabase/storage.ts), so folder-name equality below is the
-- ownership check. A blanket `using (bucket_id = 'photos')` SELECT policy
-- would let anyone enumerate every couple's file paths via `.list()`, even
-- though the app itself never calls it, so it's scoped to the owner's own
-- folder like the delete/insert policies.
drop policy if exists "Public read access to photos bucket" on storage.objects;

create policy "Users list/read their own objects" on storage.objects
  for select
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

create policy "Users upload into their own folder" on storage.objects
  for insert
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

create policy "Users delete their own objects" on storage.objects
  for delete
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );
