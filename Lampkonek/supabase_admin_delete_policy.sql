-- Add delete policy for administrators
-- This allows administrators to delete member profiles

-- Create a policy that allows administrators to delete profiles
create policy "Administrators can delete profiles."
  on profiles for delete
  using ( 
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'administrator'
    )
  );
