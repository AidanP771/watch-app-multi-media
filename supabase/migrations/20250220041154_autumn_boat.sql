/*
  # Add storage bucket policies

  1. Changes
    - Create storage bucket for listings if it doesn't exist
    - Add policies to allow authenticated users to manage their own files
    - Add policy to allow public read access to listing images

  2. Security
    - Enable RLS on storage bucket
    - Restrict file uploads to authenticated users
    - Allow public read access for listing images
*/

-- Create listings bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('listings', 'listings', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listings' AND
  (storage.foldername(name))[1] = 'watch-listings'
);

-- Allow users to manage their own files
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

-- Allow public read access to listing images
CREATE POLICY "Public read access for listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listings');