-- Add additional profile fields to the profiles table
-- Run this in your Supabase SQL Editor

-- Add phone column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add birth_date column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Add cluster column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cluster TEXT;

-- Add comment to document the columns
COMMENT ON COLUMN profiles.phone IS 'User contact phone number';
COMMENT ON COLUMN profiles.birth_date IS 'User birth date';
COMMENT ON COLUMN profiles.cluster IS 'User assigned cluster (e.g., Cluster A, B, C)';
