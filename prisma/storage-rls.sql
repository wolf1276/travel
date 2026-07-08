-- Storage policies for the "photos" bucket (create the bucket first via the
-- Supabase dashboard, Storage -> New bucket -> name "photos" -> Public).
--
-- Uploads are written client-side to paths namespaced by the uploader's user
-- id: "<user_id>/places/<place_id>/..." and "<user_id>/visits/<visit_id>/...".
-- These policies ensure a signed-in user can only write/delete inside their
-- own folder, while the bucket stays public for reads (cover images and
-- memory photos are simple <img> tags, not access-controlled content).
--
-- Run once via the Supabase SQL editor.

create policy "Public read access to photos bucket"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Users upload into their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own objects"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
