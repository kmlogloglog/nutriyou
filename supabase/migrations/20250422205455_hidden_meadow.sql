/*
  # Add metrics tracking

  1. Create metrics table if not exists
  2. Set up RLS policies if they don't exist
  3. Grant necessary permissions
*/

-- Create metrics table
CREATE TABLE IF NOT EXISTS public.metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  weight numeric,
  body_fat numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'metrics' 
        AND policyname = 'Users can insert own metrics'
    ) THEN
        CREATE POLICY "Users can insert own metrics"
          ON public.metrics
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'metrics' 
        AND policyname = 'Users can read own metrics'
    ) THEN
        CREATE POLICY "Users can read own metrics"
          ON public.metrics
          FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Grant necessary permissions
GRANT ALL ON public.metrics TO authenticated;