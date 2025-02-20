-- Create a function to get or create default wishlist
CREATE OR REPLACE FUNCTION get_or_create_default_wishlist(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wishlist_id uuid;
BEGIN
  -- First try to get existing wishlist
  SELECT id INTO v_wishlist_id
  FROM wishlists
  WHERE user_id = p_user_id AND name = 'Default'
  LIMIT 1;

  -- If no wishlist exists, create one
  IF v_wishlist_id IS NULL THEN
    -- Ensure profile exists first
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
      INSERT INTO profiles (id, name)
      SELECT p_user_id, email
      FROM auth.users
      WHERE id = p_user_id;
    END IF;

    -- Create new wishlist
    INSERT INTO wishlists (user_id, name, is_public)
    VALUES (p_user_id, 'Default', false)
    RETURNING id INTO v_wishlist_id;
  END IF;

  RETURN v_wishlist_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_default_wishlist TO authenticated;