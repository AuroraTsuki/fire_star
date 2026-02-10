-- 1. 创建触发器函数：自动为新用户创建 Profile Record
-- 这样可以确保存储在 auth.users 中的新用户在 public.profiles 表中也有对应的行，
-- 从而避免 recipes 表的 user_id 外键约束报错。

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. 创建触发器：在 auth.users 插入新行后执行
-- 如果触发器已存在，先删除再创建
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. 手动同步现有用户
-- 确保那些已经在 auth.users 中但还没 profile 的用户也能正常使用
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- 4. 优化 Storage RLS
-- 确保 recipes 存储桶是公开的
update storage.buckets set public = true where id = 'recipes';

-- 重新创建上传政策，移除过严的限制
drop policy if exists "Authenticated users can upload recipe images." on storage.objects;
create policy "Authenticated users can upload recipe images."
  on storage.objects for insert
  with check ( bucket_id = 'recipes' ); 

-- 确保用户可以操作自己上传的对象
-- 使用 ::text 进行显式转换以避免部分 Supabase 版本中 text = uuid 的类型不匹配错误
drop policy if exists "Users can update their own recipe images." on storage.objects;
create policy "Users can update their own recipe images."
  on storage.objects for update
  using ( bucket_id = 'recipes' AND (auth.uid()::text = owner::text OR owner is null) );

drop policy if exists "Users can delete their own recipe images." on storage.objects;
create policy "Users can delete their own recipe images."
  on storage.objects for delete
  using ( bucket_id = 'recipes' AND (auth.uid()::text = owner::text OR owner is null) );
