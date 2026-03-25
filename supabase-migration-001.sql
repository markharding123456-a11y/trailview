-- Migration 001: Add Cloudflare R2 fields and submissions table
-- Run this if you already have the base schema and need to upgrade

-- Add new columns to trails
ALTER TABLE trails ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';
ALTER TABLE trails ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS duration_min INTEGER;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS gpx_url TEXT;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS contributor_id UUID;
ALTER TABLE trails ADD COLUMN IF NOT EXISTS contributor_name TEXT;

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trail_name TEXT NOT NULL,
  activity_types TEXT[] NOT NULL DEFAULT '{}',
  region TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'blue' CHECK (difficulty IN ('green','blue','black','expert')),
  description TEXT,
  video_key TEXT,
  gpx_key TEXT,
  thumbnail_key TEXT,
  gpx_coordinates JSONB,
  distance_km DECIMAL(6,2),
  elevation_gain_m INTEGER,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  contributor_name TEXT,
  contributor_email TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);
