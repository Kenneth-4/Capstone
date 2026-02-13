-- Step 1: Remove duplicate records
-- Keeps the record with the highest ID (most recently added)
DELETE FROM public.attendance a
USING public.attendance b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.date = b.date
  AND COALESCE(a.event, '') = COALESCE(b.event, '');

-- Step 2: Now that duplicates are gone, we can safely add the constraint
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS unique_attendance_record;

ALTER TABLE public.attendance ADD CONSTRAINT unique_attendance_record UNIQUE (user_id, date, event);
