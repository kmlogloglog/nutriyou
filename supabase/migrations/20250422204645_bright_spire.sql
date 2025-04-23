/*
  # Create Nutrition Assessment Schema

  1. New Tables
    - `nutrition_assessments`
      - Personal information
      - Health background
      - Lifestyle details
      - Dietary habits
      - Goals and preferences
      
  2. Security
    - Enable RLS
    - Add policies for user access
    - Add policies for admin access
*/

-- Create nutrition assessments table
CREATE TABLE IF NOT EXISTS public.nutrition_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Personal Information
  full_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  height numeric NOT NULL,
  current_weight numeric NOT NULL,
  goal_weight numeric,
  email text NOT NULL,
  phone text,

  -- Health Background
  medical_conditions text[],
  medications text[],
  allergies text[],
  previous_diets text[],
  family_history text,

  -- Lifestyle Assessment
  occupation text,
  work_schedule text,
  activity_level text NOT NULL,
  exercise_routine text,
  exercise_frequency text,
  sleep_pattern text,
  stress_level integer,
  smoking_status boolean,
  alcohol_consumption text,

  -- Dietary Habits
  meal_structure jsonb,
  food_preferences text[],
  dietary_restrictions text[],
  typical_daily_food text,
  water_consumption text,
  supplements text[],

  -- Goals and Preferences
  primary_goals text[] NOT NULL,
  timeline text,
  preferred_meal_frequency integer,
  budget_range text,
  meal_prep_time text,
  special_requirements text
);

-- Enable RLS
ALTER TABLE public.nutrition_assessments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own assessments"
  ON public.nutrition_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments"
  ON public.nutrition_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending assessments"
  ON public.nutrition_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins have full access"
  ON public.nutrition_assessments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nutrition_assessments_updated_at
  BEFORE UPDATE ON public.nutrition_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();