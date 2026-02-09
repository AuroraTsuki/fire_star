-- Storage Bucket: recipes
-- Run this in Supabase SQL Editor

-- 1. Create the 'recipes' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('recipes', 'recipes', true)
on conflict (id) do nothing;

-- 2. Policy: Allow public read of recipe images
create policy "Recipe images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'recipes' );

-- 3. Policy: Allow authenticated users to upload recipe images
create policy "Authenticated users can upload recipe images."
  on storage.objects for insert
  with check ( bucket_id = 'recipes' AND auth.role() = 'authenticated' );

-- 4. Policy: Allow users to update/delete their own recipe images
create policy "Users can update their own recipe images."
  on storage.objects for update
  using ( bucket_id = 'recipes' AND auth.uid() = owner )
  with check ( bucket_id = 'recipes' AND auth.uid() = owner );

create policy "Users can delete their own recipe images."
  on storage.objects for delete
  using ( bucket_id = 'recipes' AND auth.uid() = owner );
