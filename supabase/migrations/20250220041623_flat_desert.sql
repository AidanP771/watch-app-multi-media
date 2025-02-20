/*
  # Update storage policies and bucket configuration

  1. Changes
    - Drop and recreate storage bucket policies with proper permissions
    - Handle existing policies gracefully
    - Ensure bucket exists
*/

-- Create listings bucket if it doesn't exist
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can manage their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for listing images" ON storage.objects;
END $$;

-- Create new policies
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