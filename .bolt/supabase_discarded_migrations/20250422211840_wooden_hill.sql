/*
  # Fix admin user permissions

  1. Updates
    - Set admin flag in raw_user_meta_data
    - Add admin role claim
    - Ensure proper RLS policies
*/

-- Update admin user with proper metadata and role
UPDATE auth.users 
SET 
  raw_user_meta_data = jsonb_build_object(
    'is_admin', true,
    'full_name', COALESCE(raw_user_meta_data->>'full_name', ''),
    'avatar_url', COALESCE(raw_user_meta_data->>'avatar_url', ''),
    'role', 'admin'
  )
WHERE email = 'karimmeleka@karimmeleka.com';

-- Ensure admin policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins have full access'
  ) THEN
    CREATE POLICY "Admins have full access"
      ON public.profiles
      FOR ALL
      TO authenticated
      USING (
        (auth.jwt() ->> 'role' = 'admin') OR 
        (auth.uid() IN (
          SELECT id FROM auth.users 
          WHERE raw_user_meta_data->>'is_admin' = 'true'
        ))
      )
      WITH CHECK (
        (auth.jwt() ->> 'role' = 'admin') OR 
        (auth.uid() IN (
          SELECT id FROM auth.users 
          WHERE raw_user_meta_data->>'is_admin' = 'true'
        ))
      );
  END IF;
END
$$;