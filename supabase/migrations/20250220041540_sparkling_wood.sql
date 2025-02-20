/*
  # Fix storage bucket policies and authorization

  1. Changes
    - Drop and recreate storage bucket policies with proper permissions
    - Update watch_listings constraints
    - Add performance indexes
*/

-- Drop the existing check constraint on watch_listings
ALTER TABLE watch_listings DROP CONSTRAINT IF EXISTS watch_listings_images_check;

-- Add a new, more flexible check constraint
ALTER TABLE watch_listings
ADD CONSTRAINT watch_listings_images_check
CHECK (array_length(images, 1) >= 1);

-- Create storage bucket policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can manage their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for listing images" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listings' AND
    (storage.foldername(name))[1] = 'watch-listings'
  );

  CREATE POLICY "Users can manage their own files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'listings' AND
    auth.uid()::text = (storage.foldername(name))[2]
  )
  WITH CHECK (
    bucket_id = 'listings' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

  CREATE POLICY "Public read access for listing images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'listings');
END $$;

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_watch_listings_seller_id_status ON watch_listings(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_watch_listings_created_at ON watch_listings(created_at DESC);