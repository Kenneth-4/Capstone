-- Add missing columns if they don't exist
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS event text DEFAULT '';
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS remarks text;

-- Update existing NULL events to empty string to ensure uniqueness works expectedly
UPDATE public.attendance SET event = '' WHERE event IS NULL;

-- Drop the constraint if it exists to ensure we can recreate it correctly
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS unique_attendance_record;

-- Add the unique constraint
-- This ensures that a user can have only one attendance record per event per day
ALTER TABLE public.attendance ADD CONSTRAINT unique_attendance_record UNIQUE (user_id, date, event);
