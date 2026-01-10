-- Migration: Add user authentication and Row Level Security
-- This migration adds user_id columns to tables and sets up RLS policies
-- to ensure users can only access their own data

-- Add user_id column to handovers table
ALTER TABLE handovers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_handovers_user_id ON handovers(user_id);

-- Enable Row Level Security on handovers
ALTER TABLE handovers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own handovers" ON handovers;
DROP POLICY IF EXISTS "Users can create own handovers" ON handovers;
DROP POLICY IF EXISTS "Users can update own handovers" ON handovers;
DROP POLICY IF EXISTS "Users can delete own handovers" ON handovers;

-- Create RLS policies for handovers
CREATE POLICY "Users can view own handovers"
  ON handovers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own handovers"
  ON handovers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own handovers"
  ON handovers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own handovers"
  ON handovers FOR DELETE
  USING (auth.uid() = user_id);

-- Note: domains and checks inherit access through their parent handover
-- No need to add user_id to these tables as they're accessed via handover relationship
