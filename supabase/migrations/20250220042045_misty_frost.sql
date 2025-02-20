/*
  # Remove views from marketplace listings

  1. Changes
    - Remove views column from watch_listings table
    - Update indexes to remove views-related indexes
*/

-- Remove views column from watch_listings table
ALTER TABLE watch_listings DROP COLUMN IF EXISTS views;

-- Remove any views-related indexes
DROP INDEX IF EXISTS idx_watch_listings_views;