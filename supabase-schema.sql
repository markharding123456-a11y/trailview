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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (open for now — Jim is the only user)
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to trails" ON trails FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to regions" ON regions FOR ALL USING (true) WITH CHECK (true);
