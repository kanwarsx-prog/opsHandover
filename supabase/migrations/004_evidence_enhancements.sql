-- Evidence Enhancements Migration
-- Adds file storage capabilities to evidence table

-- Add new columns to evidence table for file storage
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_path TEXT,
ADD COLUMN IF NOT EXISTS uploaded_by TEXT,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for file lookups
CREATE INDEX IF NOT EXISTS idx_evidence_file_path ON evidence(file_path);

-- Add comment
COMMENT ON COLUMN evidence.file_path IS 'Supabase Storage path to uploaded file';
COMMENT ON COLUMN evidence.file_size IS 'File size in bytes';
COMMENT ON COLUMN evidence.file_type IS 'MIME type of the uploaded file';
COMMENT ON COLUMN evidence.thumbnail_path IS 'Path to generated thumbnail for images';

-- Note: Storage bucket and RLS policies should be created via Supabase Dashboard or CLI
-- Bucket name: evidence-files
-- RLS policies:
--   1. Allow authenticated users to upload files
--   2. Allow authenticated users to read files
--   3. Allow users to delete their own files
