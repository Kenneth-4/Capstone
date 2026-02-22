-- Add policy to allow administrators to insert new profiles
-- This is needed for the "Add Member" functionality

-- Create a policy that allows administrators to insert new profiles
create policy "Administrators can insert profiles."
  on profiles for insert
  with check ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );
