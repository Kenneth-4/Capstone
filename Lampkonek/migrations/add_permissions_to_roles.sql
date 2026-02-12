-- Add permissions column to roles table
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS permissions text[] DEFAULT '{}';

-- Set default permissions for Administrator (all access)
UPDATE public.roles 
SET permissions = ARRAY['Dashboard', 'Attendance', 'Members', 'Reports', 'Settings', 'Reservations'] 
WHERE name = 'Administrator';

-- Set default permissions for Ministry Leader (limited access)
UPDATE public.roles 
SET permissions = ARRAY['Dashboard', 'Attendance', 'Members', 'Reports'] 
WHERE name = 'Ministry Leader';

-- Set default permissions for Member (basic access)
UPDATE public.roles 
SET permissions = ARRAY['Dashboard'] 
WHERE name = 'Member';
