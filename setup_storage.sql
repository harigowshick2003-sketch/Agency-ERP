-- ═══════════════════════════════════════════════════════════════════
--  Agency ERP — Storage Bucket Creation
--  Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- 1. Create a public bucket for content files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content_files', 'content_files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'content_files');

-- 3. Allow public access to upload files
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'content_files');

-- 4. Allow public access to update files
CREATE POLICY "Public Update" ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'content_files');

-- 5. Allow public access to delete files
CREATE POLICY "Public Delete" ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'content_files');
