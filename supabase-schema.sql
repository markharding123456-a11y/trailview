-- TrailView Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Regions table
CREATE TABLE regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  center_lat DECIMAL(9,6),
  center_lng DECIMAL(9,6)
);

INSERT INTO regions (name, slug, center_lat, center_lng) VALUES
  ('Kootenays / Grand Forks', 'kootenays', 49.0333, -118.4400),
  ('Okanagan (Vernon / Kelowna)', 'okanagan', 50.2670, -119.2720),
  ('Whistler / Squamish', 'whistler', 50.1163, -122.9574),
  ('North Shore Vancouver', 'north-shore', 49.3500, -123.0700),
  ('Kamloops / Sun Peaks', 'kamloops', 50.6745, -120.3273),
  ('Fraser Valley', 'fraser-valley', 49.1042, -121.9530),
  ('Other BC', 'other-bc', 53.7267, -127.6476);

-- Trails table
CREATE TABLE trails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region_id UUID REFERENCES regions(id),
  activity_types TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'blue' CHECK (difficulty IN ('green','blue','black','expert')),
  distance_km DECIMAL(6,2),
  elevation_gain_m INTEGER,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  gpx_coordinates JSONB,
  video_status TEXT DEFAULT 'not_filmed' CHECK (video_status IN ('not_filmed','filmed','uploaded','processing','live')),
  filmed_date DATE,
  notes TEXT,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  season TEXT,
  duration_min INTEGER,
  -- Cloudflare R2 asset URLs
  video_url TEXT,
  gpx_url TEXT,
  thumbnail_url TEXT,
  -- Contributor tracking
  contributor_id UUID,
  contributor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table — pending uploads awaiting admin review
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trail_name TEXT NOT NULL,
  activity_types TEXT[] NOT NULL DEFAULT '{}',
  region TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'blue' CHECK (difficulty IN ('green','blue','black','expert')),
  description TEXT,
  -- R2 asset keys
  video_key TEXT,
  gpx_key TEXT,
  thumbnail_key TEXT,
  -- Parsed GPX data
  gpx_coordinates JSONB,
  distance_km DECIMAL(6,2),
  elevation_gain_m INTEGER,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  -- Review workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  -- Contributor info
  contributor_name TEXT,
  contributor_email TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================
-- RLS ensures the anon key only has read access to public data,
-- while authenticated users can write. See supabase-rls.sql for
-- the standalone migration if upgrading from permissive policies.

ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- TRAILS: public read, authenticated write
CREATE POLICY "Public can read trails" ON trails
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert trails" ON trails
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trails" ON trails
  FOR UPDATE USING (auth.role() = 'authenticated');

-- SUBMISSIONS: authenticated create, own-read + authenticated read/update
CREATE POLICY "Authenticated users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read own submissions" ON submissions
  FOR SELECT USING (auth.uid()::text = contributor_id OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions" ON submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- REGIONS: public read, authenticated full access
CREATE POLICY "Public can read regions" ON regions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage regions" ON regions
  FOR ALL USING (auth.role() = 'authenticated');
