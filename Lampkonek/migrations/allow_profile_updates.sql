-- Allow authenticated users to update ANY profile (needed for Admins to edit other users)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Authenticated users can update any profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete profiles
CREATE POLICY "Authenticated users can delete any profile"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (true);

-- Allow authenticated users to insert profiles (just in case, though trigger handles it usually)
CREATE POLICY "Authenticated users can insert profiles"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (true);
