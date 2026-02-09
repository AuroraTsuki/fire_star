-- Create Favorites Table
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, recipe_id)
);

-- Enable RLS
alter table favorites enable row level security;

-- Policies
create policy "Users can view their own favorites." on favorites for select using (auth.uid() = user_id);
create policy "Users can insert their own favorites." on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete their own favorites." on favorites for delete using (auth.uid() = user_id);
