-- Add missing columns to the attendance table
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS event text;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS remarks text;

-- (Optional) Add unique constraint to prevent duplicate attendance for the same user, date, and event
-- ALTER TABLE public.attendance ADD CONSTRAINT unique_attendance_record UNIQUE (user_id, date, event);
