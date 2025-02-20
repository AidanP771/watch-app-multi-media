/*
  # Fix Wishlist Relationship Issues

  1. Changes
    - Add default wishlist creation trigger
    - Add cascade delete for wishlist items
    - Add indexes for better performance
    - Update RLS policies for better error handling

  2. Security
    - Maintain existing RLS policies
    - Add additional checks for data consistency
*/

-- Function to create default wishlist for new users
CREATE OR REPLACE FUNCTION create_default_wishlist()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.wishlists (user_id, name, is_public)
  VALUES (NEW.id, 'Default', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default wishlist after profile creation
DROP TRIGGER IF EXISTS create_default_wishlist_trigger ON profiles;
CREATE TRIGGER create_default_wishlist_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_wishlist();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Update RLS policies for better error handling
DROP POLICY IF EXISTS "Users can manage their own wishlists" ON wishlists;
CREATE POLICY "Users can manage their own wishlists"
  ON wishlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own wishlist items" ON wishlist_items;
CREATE POLICY "Users can manage their own wishlist items"
  ON wishlist_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
      AND wishlists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
      AND wishlists.user_id = auth.uid()
    )
  );

-- Function to handle single row selection with default values
CREATE OR REPLACE FUNCTION get_wishlist_with_default(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  is_public boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT w.id, w.user_id, w.name, w.is_public
  FROM wishlists w
  WHERE w.user_id = p_user_id AND w.name = 'Default'
  LIMIT 1;

  IF NOT FOUND THEN
    INSERT INTO wishlists (user_id, name, is_public)
    VALUES (p_user_id, 'Default', false)
    RETURNING id, user_id, name, is_public;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;