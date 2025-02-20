/*
  # Fix Duplicate Wishlists

  1. Changes
    - Remove duplicate default wishlists
    - Add unique constraint to prevent future duplicates
    - Update functions to handle single default wishlist

  2. Security
    - Maintains existing RLS policies
    - Uses SECURITY DEFINER for functions
*/

-- Function to clean up duplicate default wishlists
CREATE OR REPLACE FUNCTION cleanup_duplicate_wishlists()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  default_wishlist_id uuid;
BEGIN
  -- For each user with multiple default wishlists
  FOR user_record IN
    SELECT DISTINCT user_id
    FROM wishlists
    WHERE name = 'Default'
    GROUP BY user_id
    HAVING COUNT(*) > 1
  LOOP
    -- Keep the oldest default wishlist
    SELECT id INTO default_wishlist_id
    FROM wishlists
    WHERE user_id = user_record.user_id
    AND name = 'Default'
    ORDER BY created_at ASC
    LIMIT 1;

    -- Move all items to the oldest wishlist
    UPDATE wishlist_items
    SET wishlist_id = default_wishlist_id
    WHERE wishlist_id IN (
      SELECT id
      FROM wishlists
      WHERE user_id = user_record.user_id
      AND name = 'Default'
      AND id != default_wishlist_id
    );

    -- Delete duplicate wishlists
    DELETE FROM wishlists
    WHERE user_id = user_record.user_id
    AND name = 'Default'
    AND id != default_wishlist_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up existing duplicates
SELECT cleanup_duplicate_wishlists();

-- Add unique constraint to prevent future duplicates
ALTER TABLE wishlists
ADD CONSTRAINT unique_default_wishlist UNIQUE (user_id, name)
WHERE name = 'Default';

-- Update get_or_create_default_wishlist function to use FOR UPDATE SKIP LOCKED
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

  -- Get existing wishlist with row lock
  SELECT id INTO v_wishlist_id
  FROM wishlists
  WHERE user_id = p_user_id AND name = 'Default'
  FOR UPDATE SKIP LOCKED;

  -- Create new wishlist if none exists
  IF v_wishlist_id IS NULL THEN
    INSERT INTO wishlists (user_id, name, is_public)
    VALUES (p_user_id, 'Default', false)
    ON CONFLICT (user_id, name) DO NOTHING
    RETURNING id INTO v_wishlist_id;

    -- If insert failed due to concurrent insert, get the existing one
    IF v_wishlist_id IS NULL THEN
      SELECT id INTO v_wishlist_id
      FROM wishlists
      WHERE user_id = p_user_id AND name = 'Default';
    END IF;
  END IF;

  RETURN v_wishlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;