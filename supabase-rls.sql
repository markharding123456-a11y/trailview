-- TrailView Row Level Security (RLS) Policies
-- Run this migration to replace the permissive "allow all" policies
-- with proper role-based access control.
--
-- Policy summary:
--   trails:       Public read, authenticated write (insert/update)
--   regions:      Public read, authenticated full access
--   submissions:  Authenticated create, own-read + authenticated read/update

-- ===========================================
-- 1. Enable RLS on all tables
-- ===========================================
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 2. Drop old permissive policies (idempotent)
-- ===========================================
DROP POLICY IF EXISTS "Allow all access to trails" ON trails;
DROP POLICY IF EXISTS "Allow all access to regions" ON regions;
DROP POLICY IF EXISTS "Allow all access to submissions" ON submissions;

-- ===========================================
-- 3. TRAILS policies
--    - Anyone (including anon) can read trails
--    - Authenticated users can insert and update trails
-- ===========================================
CREATE POLICY "Public can read trails" ON trails
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert trails" ON trails
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trails" ON trails
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ===========================================
-- 4. SUBMISSIONS policies
--    - Authenticated users can create new submissions
--    - Users can read their own submissions (matched by contributor_id),
--      and any authenticated user can read all submissions (for admin review)
--    - Authenticated users can update submissions (approve/reject workflow)
-- ===========================================
CREATE POLICY "Authenticated users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read own submissions" ON submissions
  FOR SELECT USING (auth.uid()::text = contributor_id OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions" ON submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ===========================================
-- 5. REGIONS policies
--    - Anyone (including anon) can read regions
--    - Authenticated users have full access (insert/update/delete)
-- ===========================================
CREATE POLICY "Public can read regions" ON regions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage regions" ON regions
  FOR ALL USING (auth.role() = 'authenticated');
