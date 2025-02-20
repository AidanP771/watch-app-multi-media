/*
  # Fix storage policies and watch listings constraints

  1. Changes
    - Update storage bucket policies to allow bucket creation
    - Modify watch_listings images check constraint
    - Add missing indexes for performance

  2. Security
    - Maintain RLS policies while allowing necessary operations
*/

-- Drop the existing check constraint on watch_listings
ALTER TABLE watch_listings DROP CONSTRAINT IF EXISTS watch_listings_images_check;

-- Add a new, more flexible check constraint
ALTER TABLE watch_listings
ADD CONSTRAINT watch_listings_images_check
CHECK (array_length(images, 1) >= 1);

-- Update storage bucket policies
DO $$
BEGIN
  -- Ensure the listings bucket exists
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('listings', 'listings', true)
  ON CONFLICT (id) DO NOTHING;

  -- Update bucket policies
  ALTER POLICY IF EXISTS "Authenticated users can upload files"
    ON storage.objects
    WITH CHECK (bucket_id = 'listings');

  ALTER POLICY IF EXISTS "Users can manage their own files"
    ON storage.objects
    USING (bucket_id = 'listings')
    WITH CHECK (bucket_id = 'listings');
END $$;

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_watch_listings_seller_id_status ON watch_listings(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_watch_listings_created_at ON watch_listings(created_at DESC);