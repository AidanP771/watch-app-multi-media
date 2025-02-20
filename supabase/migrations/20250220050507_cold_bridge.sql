-- Create a function to handle new user profile creation with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_id uuid;
  wishlist_id uuid;
BEGIN
  -- Ensure we're in a transaction
  IF NOT EXISTS (
    SELECT 1 FROM pg_prepared_xacts 
    WHERE gid = (txid_current())::text
  ) THEN
    -- Insert into profiles first and get the id
    INSERT INTO public.profiles (id, name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email))
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name
    RETURNING id INTO profile_id;
    
    -- Only create wishlist if profile was created/updated successfully
    IF profile_id IS NOT NULL THEN
      INSERT INTO public.wishlists (user_id, name, is_public)
      VALUES (profile_id, 'Default', false)
      ON CONFLICT (user_id, name) 
      WHERE name = 'Default' 
      DO NOTHING
      RETURNING id INTO wishlist_id;
    END IF;
  END IF;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the error for debugging
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure we have the required unique constraint for wishlists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'wishlists_user_id_name_key'
  ) THEN
    ALTER TABLE public.wishlists
    ADD CONSTRAINT wishlists_user_id_name_key 
    UNIQUE (user_id, name);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id_name ON wishlists(user_id, name);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger for user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;