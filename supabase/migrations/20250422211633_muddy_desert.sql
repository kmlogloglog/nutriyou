/*
  # Update admin user metadata

  1. Changes
    - Sets is_admin flag to true for specified admin user
    - Preserves existing metadata values
    - Updates raw_user_meta_data only (correct column name)
*/

UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
  'is_admin', true,
  'full_name', COALESCE(raw_user_meta_data->>'full_name', ''),
  'avatar_url', COALESCE(raw_user_meta_data->>'avatar_url', '')
)
WHERE email = 'karimmeleka@karimmeleka.com';