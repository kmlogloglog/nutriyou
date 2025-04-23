-- Update admin user metadata with consistent format
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
  'is_admin', true,
  'full_name', COALESCE(raw_user_meta_data->>'full_name', ''),
  'avatar_url', COALESCE(raw_user_meta_data->>'avatar_url', '')
)
WHERE email = 'karimmeleka@karimmeleka.com';