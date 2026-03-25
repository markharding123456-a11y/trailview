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

-- ===========================================
-- Row Level Security (RLS) — idempotent
-- ===========================================
-- Enable RLS on all tables (safe to re-run)
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies if they exist
DROP POLICY IF EXISTS "Allow all access to trails" ON trails;
DROP POLICY IF EXISTS "Allow all access to regions" ON regions;
DROP POLICY IF EXISTS "Allow all access to submissions" ON submissions;

-- TRAILS: public read, authenticated write
DO $$ BEGIN
  CREATE POLICY "Public can read trails" ON trails FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert trails" ON trails
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update trails" ON trails
    FOR UPDATE USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- SUBMISSIONS: authenticated create, own-read, owner-or-admin update
-- SECURITY NOTE: contributor_email should be protected in application code —
-- the SELECT policy allows any authenticated user to read all submissions
-- (needed for admin review), but the application layer should strip
-- contributor_email from responses unless the requester is the owner or admin.
DO $$ BEGIN
  CREATE POLICY "Authenticated users can create submissions" ON submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read own submissions" ON submissions
    FOR SELECT USING (auth.uid()::text = contributor_id OR auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Restrict UPDATE to own submissions or service_role (admin) to prevent
-- unauthorized modification of other users' submissions.
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update submissions" ON submissions
    FOR UPDATE USING (auth.uid()::text = contributor_id OR auth.jwt() ->> 'role' = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- REGIONS: public read, authenticated full access
DO $$ BEGIN
  CREATE POLICY "Public can read regions" ON regions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage regions" ON regions
    FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
