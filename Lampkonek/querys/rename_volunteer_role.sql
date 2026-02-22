-- Rename 'Volunteer' role to 'Pastor' in roles table
UPDATE public.roles 
SET name = 'Pastor', 
    description = 'Spiritual leader providing guidance and oversight' 
WHERE name = 'Volunteer';

-- Update 'profiles' table to reflect the change for existing users
UPDATE public.profiles 
SET role = 'Pastor' 
WHERE role = 'Volunteer';

-- Ensure 'Pastor' role exists if 'Volunteer' was missing for some reason
INSERT INTO public.roles (name, description)
SELECT 'Pastor', 'Spiritual leader providing guidance and oversight'
WHERE NOT EXISTS (
    SELECT 1 FROM public.roles WHERE name = 'Pastor'
);
