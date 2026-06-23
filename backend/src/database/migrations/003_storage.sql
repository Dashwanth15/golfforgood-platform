-- Migration: Set up Charity Media Storage Bucket
-- Description: Creates the charity-media bucket and configures public access policies.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('charity-media', 'charity-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access (so frontend can load images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'charity-media');

-- 3. Allow authenticated users to upload (specifically admins, controlled by backend middleware)
CREATE POLICY "Auth Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'charity-media' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow authenticated users to update/overwrite files
CREATE POLICY "Auth Update Access"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'charity-media' 
    AND auth.role() = 'authenticated'
);

-- 5. Allow authenticated users to delete files
CREATE POLICY "Auth Delete Access"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'charity-media' 
    AND auth.role() = 'authenticated'
);
