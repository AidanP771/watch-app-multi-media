-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email))
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name;
  
  -- Create default wishlist
  INSERT INTO public.wishlists (user_id, name, is_public)
  VALUES (new.id, 'Default', false)
  ON CONFLICT (user_id, name) 
  WHERE name = 'Default' 
  DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure we have the required unique constraint for wishlists
ALTER TABLE public.wishlists
DROP CONSTRAINT IF EXISTS wishlists_user_id_name_key;

ALTER TABLE public.wishlists
ADD CONSTRAINT wishlists_user_id_name_key 
UNIQUE (user_id, name);

-- Create or update indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id_name ON wishlists(user_id, name);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;