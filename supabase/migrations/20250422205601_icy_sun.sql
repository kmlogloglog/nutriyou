/*
  # Add admin user

  1. Update user to have admin privileges
  2. Add RLS policy for admin access
*/

-- Set admin flag for the user (replace with your user's email)
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('is_admin', true)
WHERE email = 'karimmeleka@karimmeleka.com';

-- Add admin policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nutrition_assessments' 
        AND policyname = 'Admins have full access'
    ) THEN
        CREATE POLICY "Admins have full access"
          ON public.nutrition_assessments
          FOR ALL
          TO authenticated
          USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
          WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);
    END IF;
END
$$;