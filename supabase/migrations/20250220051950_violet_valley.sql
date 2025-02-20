-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user profile creation with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  _name text;
BEGIN
  -- Get the name from metadata or fallback to email
  _name := COALESCE(
    new.raw_user_meta_data->>'name',
    new.email
  );

  -- Insert into profiles with conflict handling
  BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (new.id, _name)
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
  END;

  -- Create default wishlist with conflict handling
  BEGIN
    INSERT INTO public.wishlists (user_id, name, is_public)
    VALUES (new.id, 'Default', false)
    ON CONFLICT (user_id, name) WHERE name = 'Default'
    DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error creating wishlist for user %: %', new.id, SQLERRM;
  END;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Unexpected error in handle_new_user for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure we have the required unique constraint for wishlists
ALTER TABLE public.wishlists
DROP CONSTRAINT IF EXISTS wishlists_user_id_name_key;

ALTER TABLE public.wishlists
ADD CONSTRAINT wishlists_user_id_name_key 
UNIQUE (user_id, name);

-- Create or update indexes
DROP INDEX IF EXISTS idx_profiles_id;
DROP INDEX IF EXISTS idx_wishlists_user_id_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id_name ON wishlists(user_id, name);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;