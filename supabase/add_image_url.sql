-- Add image_url column to recipes table
-- Run this in Supabase SQL Editor

alter table recipes
add column image_url text;

-- Add comment
comment on column recipes.image_url is 'URL of the recipe cover image';
