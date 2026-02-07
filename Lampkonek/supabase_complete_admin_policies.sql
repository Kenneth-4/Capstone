-- Complete RLS policies for administrator member management
-- Run this in your Supabase SQL Editor

-- 1. Drop existing policies to avoid conflicts
drop policy if exists "Users can update their own profile." on profiles;
drop policy if exists "Administrators can update any profile." on profiles;
drop policy if exists "Administrators can insert profiles." on profiles;
drop policy if exists "Administrators can delete profiles." on profiles;

-- 2. Recreate the user self-update policy
create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 3. Allow administrators to update any profile
create policy "Administrators can update any profile."
  on profiles for update
  using ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );

-- 4. Allow administrators to insert new profiles
create policy "Administrators can insert profiles."
  on profiles for insert
  with check ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );

-- 5. Allow administrators to delete profiles
create policy "Administrators can delete profiles."
  on profiles for delete
  using ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );

-- Note: The trigger 'handle_new_user' will automatically create profiles
-- when new users sign up, but these policies allow admins to manually insert,
-- update, or delete profiles as needed.
