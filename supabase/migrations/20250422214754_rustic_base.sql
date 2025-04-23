/*
  # Fix meals database

  1. Changes
    - Add missing columns to meals table
    - Update data types and constraints
    - Add proper RLS policies
    - Fix sample data

  2. Security
    - Enable RLS
    - Add policy for authenticated users to read meals
*/

-- Drop existing meals table if it exists
DROP TABLE IF EXISTS public.meals;

-- Create meals table with correct structure
CREATE TABLE public.meals (
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
CREATE POLICY "Everyone can read meals"
  ON public.meals
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample meals
INSERT INTO public.meals (name, description, category, calories, protein, carbs, fat, image_url, recipe) VALUES
-- Breakfast
('Ful Medames', 'Slow-cooked fava beans with olive oil, lemon juice, and cumin', 'breakfast', 350, 18, 44, 12, 'https://images.pexels.com/photos/7438982/pexels-photo-7438982.jpeg', 'Mash cooked fava beans, mix with lemon juice, garlic, cumin, salt. Serve warm with olive oil.'),
('Greek Yogurt with Honey & Walnuts', 'Thick Greek yogurt topped with honey and chopped walnuts', 'breakfast', 380, 19, 33, 19, 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg', 'Layer Greek yogurt in a bowl, drizzle with honey, top with chopped walnuts.'),
('Mediterranean Breakfast Bowl', 'Eggs, feta, tomatoes, and olives', 'breakfast', 320, 24, 8, 22, 'https://images.pexels.com/photos/6294361/pexels-photo-6294361.jpeg', 'Scramble eggs with feta, serve with fresh tomatoes and olives.'),

-- Lunch
('Greek Salad', 'Classic salad with tomatoes, cucumber, olives, and feta', 'lunch', 400, 15, 15, 33, 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg', 'Combine chopped vegetables, top with feta and olive oil dressing.'),
('Lentil Soup', 'Hearty soup with lentils, vegetables, and Mediterranean spices', 'lunch', 350, 18, 52, 8, 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg', 'Simmer lentils with vegetables and spices until tender.'),
('Falafel Wrap', 'Crispy falafel with tahini sauce in pita bread', 'lunch', 550, 21, 62, 25, 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg', 'Wrap falafel in pita with vegetables and tahini sauce.'),

-- Dinner
('Grilled Sea Bream', 'Fresh fish grilled with lemon and herbs', 'dinner', 450, 56, 9, 22, 'https://images.pexels.com/photos/8697539/pexels-photo-8697539.jpeg', 'Grill fish with lemon, herbs, and olive oil until cooked through.'),
('Moussaka', 'Layered eggplant casserole with spiced meat sauce', 'dinner', 650, 32, 49, 37, 'https://images.pexels.com/photos/6406460/pexels-photo-6406460.jpeg', 'Layer eggplant with meat sauce and bechamel, bake until golden.'),
('Stuffed Grape Leaves', 'Grape leaves filled with rice, herbs, and spices', 'dinner', 300, 8, 38, 12, 'https://images.pexels.com/photos/4193843/pexels-photo-4193843.jpeg', 'Roll grape leaves with rice filling, simmer in broth until tender.'),

-- Snacks
('Mixed Olives', 'Assorted Mediterranean olives', 'snack', 100, 1, 1, 11, 'https://images.pexels.com/photos/4109907/pexels-photo-4109907.jpeg', 'Serve a variety of olives with herbs and olive oil.'),
('Hummus with Pita', 'Classic chickpea dip with olive oil', 'snack', 250, 8, 30, 12, 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg', 'Blend chickpeas with tahini, lemon, and garlic until smooth.'),
('Fresh Fruit Plate', 'Seasonal Mediterranean fruits', 'snack', 150, 2, 35, 1, 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', 'Arrange fresh seasonal fruits on a plate.');