/*
  # Fix Profile and Wishlist Handling

  1. Changes
    - Add function to handle profile creation for new users
    - Add trigger for profile creation
    - Add function to ensure profile exists before wishlist operations
    - Add indexes for better performance

  2. Security
    - Functions use SECURITY DEFINER to ensure proper permissions
    - Maintains existing RLS policies
*/

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles first
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email));
  
  -- Create default wishlist
  INSERT INTO public.wishlists (user_id, name, is_public)
  VALUES (new.id, 'Default', false);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to ensure profile exists before wishlist operations
CREATE OR REPLACE FUNCTION ensure_profile_exists(p_user_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    INSERT INTO profiles (id, name)
    SELECT p_user_id, email
    FROM auth.users
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id_name ON wishlists(user_id, name);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id_product_id ON wishlist_items(wishlist_id, product_id);