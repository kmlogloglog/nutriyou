/*
  # Set up admin user and policies

  1. Changes
    - Set admin flag for specific user
    - Add admin-specific policies
*/

-- Set admin flag for the user
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('is_admin', true)
WHERE email = 'karimmeleka@karimmeleka.com';

-- Add admin policies
DO $$
BEGIN
  -- Admin policy for full access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins have full access'
  ) THEN
    CREATE POLICY "Admins have full access"
      ON public.profiles
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
END
$$;