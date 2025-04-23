/*
  # Create meals table and sample data

  1. New Tables
    - `meals`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text, not null, with check constraint)
      - `calories` (integer, not null)
      - `protein` (integer, not null)
      - `carbs` (integer, not null)
      - `fat` (integer, not null)
      - `image_url` (text)
      - `recipe` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `meals` table
    - Add policy for authenticated users to read meals

  3. Data
    - Insert sample meals for testing
*/

DO $$ BEGIN
  -- Create meals table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.meals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
    calories integer NOT NULL CHECK (calories > 0),
    protein integer NOT NULL CHECK (protein >= 0),
    carbs integer NOT NULL CHECK (carbs >= 0),
    fat integer NOT NULL CHECK (fat >= 0),
    image_url text,
    recipe text,
    created_at timestamptz DEFAULT now()
  );

  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'meals'
      AND rowsecurity = true
  ) THEN
    ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'meals'
      AND policyname = 'Everyone can read meals'
  ) THEN
    CREATE POLICY "Everyone can read meals"
      ON public.meals
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert sample meals
INSERT INTO public.meals (name, description, category, calories, protein, carbs, fat, image_url, recipe)
VALUES
  ('Mediterranean Breakfast Bowl', 'Fresh and healthy breakfast bowl with eggs, avocado, tomatoes, and feta cheese', 'breakfast', 450, 22, 35, 28, 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg', 'Combine scrambled eggs with diced avocado, cherry tomatoes, and crumbled feta. Season with salt and pepper.'),
  ('Greek Yogurt Parfait', 'Layered parfait with honey, granola, and berries', 'breakfast', 320, 18, 42, 12, 'https://images.pexels.com/photos/2103949/pexels-photo-2103949.jpeg', 'Layer Greek yogurt with honey, homemade granola, and fresh mixed berries.'),
  ('Quinoa Power Bowl', 'Protein-rich quinoa bowl with roasted vegetables', 'lunch', 520, 24, 68, 22, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'Cook quinoa and top with roasted sweet potatoes, chickpeas, and kale. Drizzle with tahini dressing.'),
  ('Grilled Chicken Salad', 'Fresh mixed greens with grilled chicken and avocado', 'lunch', 420, 38, 12, 28, 'https://images.pexels.com/photos/1352196/pexels-photo-1352196.jpeg', 'Grill seasoned chicken breast and serve over mixed greens with avocado and light vinaigrette.')
ON CONFLICT (id) DO NOTHING;