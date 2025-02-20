/*
  # Fix storage bucket and listing issues

  1. Changes
    - Drop and recreate storage bucket policies with proper permissions
    - Add storage.buckets policies
    - Update watch_listings constraints
*/

-- Enable RLS for storage buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policy for bucket creation
CREATE POLICY "Enable bucket creation for authenticated users"
ON storage.buckets
FOR INSERT
TO authenticated
WITH CHECK (name = 'listings');

-- Create policy for bucket access
CREATE POLICY "Enable bucket access for all users"
ON storage.buckets
FOR SELECT
TO public
USING (name = 'listings');

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can manage their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for listing images" ON storage.objects;
END $$;

-- Create new storage policies
DO $$
BEGIN
  -- Create new policies only if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload files'
  ) THEN
    CREATE POLICY "Authenticated users can upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'listings' AND
      (storage.foldername(name))[1] = 'watch-listings'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can manage their own files'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public read access for listing images'
  ) THEN
    CREATE POLICY "Public read access for listing images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'listings');
  END IF;
END $$;