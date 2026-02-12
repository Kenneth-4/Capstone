-- Add status column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';

-- Update existing profiles to have 'Active' status if null (so they don't show as Inactive)
UPDATE public.profiles SET status = 'Active' WHERE status IS NULL;
