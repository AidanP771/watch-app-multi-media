/*
  # Fix Wishlist Error Handling

  1. Changes
    - Add function to ensure profile exists
    - Update handle_new_user function to be more robust
    - Add better error handling for wishlist operations

  2. Security
    - All functions use SECURITY DEFINER
    - Maintains existing RLS policies
*/

-- Function to ensure profile exists
CREATE OR REPLACE FUNCTION ensure_profile_exists()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id) THEN
    INSERT INTO profiles (id, name)
    SELECT NEW.user_id, email
    FROM auth.users
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to ensure profile exists before wishlist creation
CREATE TRIGGER ensure_profile_exists_trigger
  BEFORE INSERT ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION ensure_profile_exists();

-- Update handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_id uuid;
  wishlist_id uuid;
BEGIN
  -- Insert into profiles first and get the id
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email))
  RETURNING id INTO profile_id;
  
  -- Only create wishlist if profile was created successfully
  IF profile_id IS NOT NULL THEN
    INSERT INTO public.wishlists (user_id, name, is_public)
    VALUES (profile_id, 'Default', false)
    RETURNING id INTO wishlist_id;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create default wishlist
CREATE OR REPLACE FUNCTION get_or_create_default_wishlist(p_user_id uuid)
RETURNS uuid AS $$
DECLARE
  v_wishlist_id uuid;
BEGIN
  -- Ensure profile exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    INSERT INTO profiles (id, name)
    SELECT p_user_id, email
    FROM auth.users
    WHERE id = p_user_id;
  END IF;

  -- Get existing wishlist or create new one
  SELECT id INTO v_wishlist_id
  FROM wishlists
  WHERE user_id = p_user_id AND name = 'Default'
  LIMIT 1;

  IF v_wishlist_id IS NULL THEN
    INSERT INTO wishlists (user_id, name, is_public)
    VALUES (p_user_id, 'Default', false)
    RETURNING id INTO v_wishlist_id;
  END IF;

  RETURN v_wishlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;