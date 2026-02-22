-- ============================================
-- CREATE RESERVATIONS TABLE
-- ============================================
-- This migration creates the reservations table for managing
-- venue reservations and event bookings
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

-- Policy: Allow authenticated users to view all reservations
CREATE POLICY "Reservations viewable by authenticated users"
    ON public.reservations FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to insert reservations
CREATE POLICY "Reservations insertable by authenticated users"
    ON public.reservations FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update reservations
CREATE POLICY "Reservations updatable by authenticated users"
    ON public.reservations FOR UPDATE
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to delete reservations
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

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that the table was created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = 'reservations' AND table_schema = 'public') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name = 'reservations';

-- Show all columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'reservations'
ORDER BY ordinal_position;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If you see the table and columns above, the reservations table has been created successfully!
-- 
-- TABLE FEATURES:
-- ✅ UUID primary key for unique identification
-- ✅ All required fields for reservation management
-- ✅ Status constraint (PENDING, APPROVED, REJECTED)
-- ✅ RLS policies for authenticated users
-- ✅ Indexes for performance optimization
-- ✅ Auto-updating timestamp on updates
-- ============================================
