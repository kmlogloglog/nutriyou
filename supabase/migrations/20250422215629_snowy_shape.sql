/*
  # Set up meals table and data
  
  1. New Tables
    - meals
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - category (text)
      - calories (integer)
      - protein (integer)
      - carbs (integer)
      - fat (integer)
      - image_url (text)
      - recipe (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for authenticated users to read meals
*/

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

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read meals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'meals' 
    AND policyname = 'Everyone can read meals'
  ) THEN
    CREATE POLICY "Everyone can read meals"
      ON public.meals
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Insert sample meals if table is empty
INSERT INTO public.meals (name, description, category, calories, protein, carbs, fat, image_url, recipe)
SELECT * FROM (VALUES
  ('Mediterranean Breakfast Bowl', 'Fresh and healthy breakfast bowl with eggs, avocado, tomatoes, and feta cheese', 'breakfast', 450, 22, 35, 28, 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg', 'Combine scrambled eggs with diced avocado, cherry tomatoes, and crumbled feta. Season with salt and pepper.'),
  ('Greek Yogurt Parfait', 'Layered parfait with honey, granola, and berries', 'breakfast', 320, 18, 42, 12, 'https://images.pexels.com/photos/2103949/pexels-photo-2103949.jpeg', 'Layer Greek yogurt with honey, homemade granola, and fresh mixed berries.'),
  ('Quinoa Power Bowl', 'Protein-rich quinoa bowl with roasted vegetables', 'lunch', 520, 24, 68, 22, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'Cook quinoa and top with roasted sweet potatoes, chickpeas, and kale. Drizzle with tahini dressing.'),
  ('Grilled Chicken Salad', 'Fresh mixed greens with grilled chicken and avocado', 'lunch', 420, 38, 12, 28, 'https://images.pexels.com/photos/1352196/pexels-photo-1352196.jpeg', 'Grill seasoned chicken breast and serve over mixed greens with avocado and light vinaigrette.'),
  ('Baked Salmon', 'Herb-crusted salmon with roasted vegetables', 'dinner', 480, 42, 18, 28, 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg', 'Season salmon with herbs and lemon, bake until flaky. Serve with roasted seasonal vegetables.'),
  ('Turkey Meatballs', 'Lean turkey meatballs with zucchini noodles', 'dinner', 380, 35, 15, 22, 'https://images.pexels.com/photos/6941001/pexels-photo-6941001.jpeg', 'Form seasoned turkey meatballs, bake until cooked through. Serve over spiralized zucchini.'),
  ('Trail Mix', 'Mixed nuts, seeds, and dried fruit', 'snack', 180, 6, 14, 12, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', 'Combine almonds, walnuts, pumpkin seeds, and dried cranberries.'),
  ('Hummus & Veggies', 'Classic hummus with fresh vegetable crudités', 'snack', 150, 8, 15, 8, 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg', 'Serve homemade hummus with carrot sticks, cucumber slices, and bell peppers.')
) AS new_meals
WHERE NOT EXISTS (
  SELECT 1 FROM public.meals LIMIT 1
);