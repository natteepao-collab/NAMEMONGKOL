-- 0. Ensure columns exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS provider text;

-- 1. Backfill existing data
-- Update user_profiles with email and metadata from auth.users
UPDATE public.user_profiles
SET
  email = auth.users.email,
  created_at = auth.users.created_at,
  provider = (auth.users.raw_app_meta_data->>'provider')::text,
  first_name = COALESCE(
    public.user_profiles.first_name,
    (auth.users.raw_user_meta_data->>'first_name')::text, 
    split_part((auth.users.raw_user_meta_data->>'name')::text, ' ', 1)
  ),
  last_name = COALESCE(
    public.user_profiles.last_name,
    (auth.users.raw_user_meta_data->>'last_name')::text,
    CASE 
      WHEN position(' ' in (auth.users.raw_user_meta_data->>'name')::text) > 0 
      THEN substring((auth.users.raw_user_meta_data->>'name')::text from position(' ' in (auth.users.raw_user_meta_data->>'name')::text) + 1)
      ELSE ''
    END
  )
FROM auth.users
WHERE public.user_profiles.id = auth.users.id;

-- 2. Create Trigger Function to keep them in sync
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles
  SET
    email = NEW.email,
    provider = (NEW.raw_app_meta_data->>'provider')::text,
    first_name = COALESCE(
      (NEW.raw_user_meta_data->>'first_name')::text, 
      split_part((NEW.raw_user_meta_data->>'name')::text, ' ', 1)
    ),
    last_name = COALESCE(
      (NEW.raw_user_meta_data->>'last_name')::text,
      CASE 
        WHEN position(' ' in (NEW.raw_user_meta_data->>'name')::text) > 0 
        THEN substring((NEW.raw_user_meta_data->>'name')::text from position(' ' in (NEW.raw_user_meta_data->>'name')::text) + 1)
        ELSE ''
      END
    )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Bind Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();

-- 4. Ensure insert trigger also captures email (if not already exists)
-- (Assuming standard handle_new_user exists, modifying it might be complex easier to just rely on the existing update/insert logic if it matches)
-- For now, the backfill fixes the immediate issue.
