-- Add policy to allow administrators to update any profile
-- This is needed for the Members page edit functionality

-- First, drop the existing restrictive update policy if it exists
drop policy if exists "Users can update their own profile." on profiles;

-- Create a new policy that allows users to update their own profile
create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a policy that allows administrators to update any profile
create policy "Administrators can update any profile."
  on profiles for update
  using ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );
