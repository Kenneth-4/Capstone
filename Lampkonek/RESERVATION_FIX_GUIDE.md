# 🔧 Fix Reservations Delete Issue - Database Setup Guide

## Problem Identified
The `reservations` table **does not exist** in your Supabase database, which is why:
- ❌ Delete operations fail
- ❌ Creating new reservations fails (400 error)
- ❌ Viewing reservations fails

## Solution: Create the Reservations Table

### Step 1: Open Supabase SQL Editor
1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration SQL

Copy and paste the **entire contents** of this file:
```
migrations/create_reservations_table.sql
```

Or copy the SQL below:

```sql
-- ============================================
-- CREATE RESERVATIONS TABLE
-- ============================================

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS public.reservations CASCADE;

-- Create the reservations table
CREATE TABLE public.reservations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_title text NOT NULL,
    event_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    venue text NOT NULL,
    organizer_name text NOT NULL,
    status text NOT NULL DEFAULT 'PENDING',
    purpose text,
    expected_attendees integer DEFAULT 0,
    setup_required text,
    equipment_needed text[],
    additional_notes text,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Reservations viewable by authenticated users"
    ON public.reservations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Reservations insertable by authenticated users"
    ON public.reservations FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Reservations updatable by authenticated users"
    ON public.reservations FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Reservations deletable by authenticated users"
    ON public.reservations FOR DELETE
    TO authenticated
    USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_reservations_event_date ON public.reservations(event_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_venue ON public.reservations(venue);
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before update
CREATE TRIGGER update_reservations_updated_at_trigger
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_reservations_updated_at();
```

### Step 3: Execute the Query
1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message
3. You should see verification results showing the table was created

### Step 4: Verify the Table
After running the migration, you can verify by running this query:

```sql
SELECT * FROM public.reservations;
```

You should see an empty table with all the columns.

### Step 5: Test the Application
1. Go back to your application at `http://localhost:5173`
2. Navigate to the **Reservations** page
3. Try creating a new reservation
4. Try deleting a reservation

## What This Migration Does

✅ **Creates the `reservations` table** with proper schema
✅ **Enables Row Level Security (RLS)** for data protection
✅ **Adds RLS policies** allowing authenticated users to:
   - View all reservations (SELECT)
   - Create new reservations (INSERT)
   - Update reservations (UPDATE)
   - **Delete reservations (DELETE)** ← This fixes your issue!
✅ **Creates indexes** for better query performance
✅ **Adds auto-updating timestamp** trigger

## Expected Results

After running this migration:
- ✅ Creating reservations will work
- ✅ Viewing reservations will work
- ✅ Updating reservations will work
- ✅ **Deleting reservations will work** (your original issue!)
- ✅ No more 400 errors

## Troubleshooting

If you get an error:
1. Make sure you're logged into the correct Supabase project
2. Make sure you have admin access to the database
3. Check if there are any existing tables or policies with conflicting names
4. Try dropping the table first if it exists (the migration does this automatically)

---

**Once you've run this migration, let me know and we can test the delete functionality!** 🚀
