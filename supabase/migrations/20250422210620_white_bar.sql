/*
  # Connect User Relations

  1. Changes
    - Add foreign key constraints to link nutrition_assessments and profiles to users
    - Update RLS policies to ensure proper data access
    - Add cascading deletes to maintain referential integrity

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add admin policies for full access
*/

-- Ensure profiles table has proper foreign key constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Update nutrition_assessments foreign key
ALTER TABLE public.nutrition_assessments
DROP CONSTRAINT IF EXISTS nutrition_assessments_user_id_fkey,
ADD CONSTRAINT nutrition_assessments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_assessments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DO $$
BEGIN
  -- Users can read their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Users can update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Admins can view all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;

  -- Admins can update all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Admins can update all profiles'
  ) THEN
    CREATE POLICY "Admins can update all profiles"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
END
$$;

-- Nutrition Assessments policies
DO $$
BEGIN
  -- Users can read their own assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nutrition_assessments' 
    AND policyname = 'Users can view own assessments'
  ) THEN
    CREATE POLICY "Users can view own assessments"
      ON public.nutrition_assessments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Users can create their own assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nutrition_assessments' 
    AND policyname = 'Users can create own assessments'
  ) THEN
    CREATE POLICY "Users can create own assessments"
      ON public.nutrition_assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can update their own pending assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nutrition_assessments' 
    AND policyname = 'Users can update own pending assessments'
  ) THEN
    CREATE POLICY "Users can update own pending assessments"
      ON public.nutrition_assessments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id AND status = 'pending')
      WITH CHECK (auth.uid() = user_id AND status = 'pending');
  END IF;

  -- Admins have full access to nutrition assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'nutrition_assessments' 
    AND policyname = 'Admins have full access to assessments'
  ) THEN
    CREATE POLICY "Admins have full access to assessments"
      ON public.nutrition_assessments
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin')
      WITH CHECK (auth.jwt() ->> 'role' = 'admin');
  END IF;
END
$$;

-- Create trigger to automatically create profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;