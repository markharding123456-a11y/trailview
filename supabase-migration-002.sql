-- Migration 002: Add user_roles table for RBAC
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent with DO blocks)
DO $$ BEGIN
  CREATE POLICY "Authenticated users can read roles" ON user_roles
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role can manage roles" ON user_roles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- To make a user an admin, run:
-- INSERT INTO user_roles (user_id, role) VALUES ('your-user-uuid', 'admin');
