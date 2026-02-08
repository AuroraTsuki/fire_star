-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (Linked to Auth)
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Recipes Table
create table recipes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  cover_image text,
  cooking_time text,
  difficulty text default 'Beginner',
  category text default 'Other',
  status text default 'published', -- 'draft', 'published'
  views int default 0,
  likes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ingredients Table
create table ingredients (
  id uuid default uuid_generate_v4() primary key,
  recipe_id uuid references recipes(id) on delete cascade not null,
  name text not null,
  amount text not null
);

-- Steps Table
create table steps (
  id uuid default uuid_generate_v4() primary key,
  recipe_id uuid references recipes(id) on delete cascade not null,
  step_number int not null,
  title text,
  description text,
  image_url text
);

-- Shopping List / Preparation List Table
create table shopping_list (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  amount text,
  is_completed boolean default false,
  source_recipe_id uuid references recipes(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security (RLS) Policies

-- Profiles: Public read, User update own
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Recipes: Public read, Author update/delete
alter table recipes enable row level security;
create policy "Recipes are viewable by everyone." on recipes for select using (true);
create policy "Users can insert their own recipes." on recipes for insert with check (auth.uid() = user_id);
create policy "Users can update own recipes." on recipes for update using (auth.uid() = user_id);
create policy "Users can delete own recipes." on recipes for delete using (auth.uid() = user_id);

-- Ingredients & Steps: Inherit access from Recipe (simplified for now, or explicit)
-- We'll imply if you can edit the recipe, you can edit its parts. 
-- But standard RLS needs explicit policies.
alter table ingredients enable row level security;
create policy "Ingredients viewable by everyone." on ingredients for select using (true);
create policy "Authors can insert ingredients." on ingredients for insert with check (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);
create policy "Authors can update ingredients." on ingredients for update using (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);
create policy "Authors can delete ingredients." on ingredients for delete using (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);

alter table steps enable row level security;
create policy "Steps viewable by everyone." on steps for select using (true);
create policy "Authors can insert steps." on steps for insert with check (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);
create policy "Authors can update steps." on steps for update using (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);
create policy "Authors can delete steps." on steps for delete using (
  exists ( select 1 from recipes where id = recipe_id and user_id = auth.uid() )
);

-- Shopping List: Private to User
alter table shopping_list enable row level security;
create policy "Users can view own shopping list." on shopping_list for select using (auth.uid() = user_id);
create policy "Users can insert into own shopping list." on shopping_list for insert with check (auth.uid() = user_id);
create policy "Users can update own shopping list." on shopping_list for update using (auth.uid() = user_id);
create policy "Users can delete from own shopping list." on shopping_list for delete using (auth.uid() = user_id);

-- Storage Buckets (Script/Idea)
-- insert into storage.buckets (id, name) values ('covers', 'covers');
-- insert into storage.buckets (id, name) values ('steps', 'steps');
-- Policy for storage... (Omitted for SQL file simplicity, usually done via UI or separate script)
