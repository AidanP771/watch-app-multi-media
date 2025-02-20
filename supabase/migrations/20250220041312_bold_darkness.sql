/*
  # Add description column to watch_listings table

  1. Changes
    - Add description column to watch_listings table
    - Add condition_notes column for detailed condition information
    - Add indexes for improved search performance

  2. Security
    - No changes to existing RLS policies required
*/

-- Add description column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watch_listings' AND column_name = 'description'
  ) THEN
    ALTER TABLE watch_listings ADD COLUMN description text NOT NULL;
  END IF;
END $$;

-- Add condition_notes column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watch_listings' AND column_name = 'condition_notes'
  ) THEN
    ALTER TABLE watch_listings ADD COLUMN condition_notes text;
  END IF;
END $$;

-- Add indexes for search performance
CREATE INDEX IF NOT EXISTS idx_watch_listings_description ON watch_listings USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_watch_listings_condition_notes ON watch_listings USING gin(to_tsvector('english', condition_notes));