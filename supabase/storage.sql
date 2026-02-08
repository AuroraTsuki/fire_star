
-- Storage Bucket: avatars
-- Note: You need to create a bucket named 'avatars' in Supabase Dashboard Storage first.

-- Policy: Allow public read of avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to upload avatars
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Policy: Allow users to update their own avatar (Optional, depending on file naming strategy)
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.uid() = owner )
  with check ( bucket_id = 'avatars' AND auth.uid() = owner );
