# Supabase Integration Guide

This project has been integrated with Supabase for Authentication and Data Storage. Follow these steps to set up your backend.

## 1. Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign in.
2.  Click "New Project".
3.  Enter your project details (Name, Password, Region).
4.  Wait for the database to be provisioned.

## 2. Get API Credentials

1.  Go to **Project Settings** (gear icon) -> **API**.
2.  Copy the `Project URL`.
3.  Copy the `anon` / `public` key.

## 3. Configure Environment Variables

1.  Create a file named `.env` in the root of your project (`lampkonek/.env`).
2.  Add the following lines, replacing the values with your actual credentials:

```bash
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** `src/lib/supabase.ts` is configured to read these variables.

## 4. Set up Database Schema

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL query to create the `members` table:

```sql
-- Create members table
create table members (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text not null,
  cluster text,
  ministry text,
  status text check (status in ('Active', 'Inactive', 'Visitor')),
  "joinDate" date, -- using joinDate with quotes to match camelCase in JSON if you prefer, or handle mapping. 
                   -- For simplicity in this codebase, Supabase handles JSON keys matching column names if you send them that way, 
                   -- but standard SQL uses snake_case. 
                   -- The code sends 'joinDate'. Let's use snake_case in DB and quotes if needed or just rename column to "joinDate".
  address text,
  birthdate date,
  "emergencyContact" text,
  "emergencyPhone" text
);

-- Note: The frontend code sends camelCase keys (joinDate, emergencyContact, emergencyPhone).
-- Postgres columns are case-insensitive unless quoted.
-- To make it work seamlessly without mapping logic, create columns with quotes or update code to use snake_case.
-- The simplest way for now is to create columns with quotes to match the JS object keys:

create table members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  cluster text,
  ministry text,
  status text,
  "joinDate" text, 
  address text,
  birthdate text,
  "emergencyContact" text,
  "emergencyPhone" text
);
```

**Recommended:** It is better to use `join_date` in SQL and map it in the frontend, but for quick integration, matching names works.

## 5. Enable Authentication

1.  Go to **Authentication** -> **Providers**.
2.  Ensure **Email** is enabled.
3.  (Optional) Disable "Confirm email" in **Authentication** -> **Providers** -> **Email** if you want users to log in immediately without verifying email (for testing).

## 6. How it works

-   **Authentication**: `src/App.tsx` handles valid sessions. It displays `SignIn` or `SignUp` if no session exists.
-   **Data Storage**: `src/components/MemberManagement.tsx` fetches users from the `members` table and handles inserting/updating records.
-   **Client**: `src/lib/supabase.ts` initializes the connection.

## 7. Next Steps

-   Implement Row Level Security (RLS) policies in Supabase to restrict access (e.g., only authenticated users can view/edit members).
-   Update other components (Attendance, Reservations) to use Supabase tables.
