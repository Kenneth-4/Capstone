-- 1. Create the profiles table
-- This table will store additional user information like role and full name
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Enable Row Level Security (RLS)
-- This is important for security so users can't edit others' profiles
alter table public.profiles enable row level security;

-- 3. Create Access Policies
-- Policy: Everyone can view profiles (needed for fetching user data)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Policy: Users can update their own profile
create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create a Trigger to automatically create a profile on Signup
-- This function copies the data (full_name, role) from the auth metadata to the profiles table
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$;

-- Trigger the function every time a new user is created in auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
