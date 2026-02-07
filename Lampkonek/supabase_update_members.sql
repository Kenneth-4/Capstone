-- Add missing columns to support the Members page
alter table public.profiles 
  add column if not exists cluster text default 'Unassigned',
  add column if not exists ministry text default 'None',
  add column if not exists status text default 'Active';

-- Update the handle_new_user function to include these new fields if you want to set them explicitly, 
-- though the table defaults will handle it for now.
-- Ideally, you might want to allow users to select these on signup in the future, 
-- but for now, defaults are fine.
