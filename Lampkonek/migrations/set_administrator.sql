-- ============================================
-- SET USER AS ADMINISTRATOR
-- ============================================
-- This script promotes an existing user to Administrator role
-- Run this AFTER you've created your user account via signup
-- ============================================

-- STEP 1: Replace 'your-email@example.com' with your actual email
-- STEP 2: Run this script in Supabase SQL Editor

-- Set user as Administrator
UPDATE public.profiles 
SET role = 'Administrator' 
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT 
    full_name,
    email,
    role,
    created_at
FROM public.profiles 
WHERE email = 'your-email@example.com';

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Sign up for an account in your application first
-- 2. Copy this script to Supabase SQL Editor
-- 3. Replace 'your-email@example.com' with your actual email (keep the quotes)
-- 4. Click "Run" to execute
-- 5. You should see your profile with role = 'Administrator'
-- 6. Log out and log back in to see the changes take effect
-- ============================================

-- Optional: Set multiple administrators at once
-- Uncomment and modify the emails below:

-- UPDATE public.profiles 
-- SET role = 'Administrator' 
-- WHERE email IN (
--     'admin1@example.com',
--     'admin2@example.com',
--     'admin3@example.com'
-- );

-- Optional: View all administrators
-- SELECT full_name, email, role, created_at 
-- FROM public.profiles 
-- WHERE role = 'Administrator';
