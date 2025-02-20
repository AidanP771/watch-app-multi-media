/*
  # Update watch listings table and policies

  1. Changes
    - Remove views column from watch_listings table
    - Add policy for users to delete their own listings
*/

-- Remove views column from watch_listings table
ALTER TABLE watch_listings DROP COLUMN IF EXISTS views;

-- Update RLS policies for watch_listings
DROP POLICY IF EXISTS "Sellers can manage their own listings" ON watch_listings;

-- Create separate policies for different operations
CREATE POLICY "Sellers can update their own listings"
ON watch_listings
FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete their own listings"
ON watch_listings
FOR DELETE
TO authenticated
USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert listings"
ON watch_listings
FOR INSERT
TO authenticated
WITH CHECK (seller_id = auth.uid());

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_watch_listings_seller_id ON watch_listings(seller_id);