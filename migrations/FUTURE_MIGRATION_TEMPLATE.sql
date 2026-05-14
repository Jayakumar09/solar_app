-- =============================================================================
-- Supabase Security Template - For Custom JWT Auth
-- Copy this template for all new table migrations
-- =============================================================================
-- IMPORTANT: This template uses custom JWT claims (id, role) not auth.uid()
-- Architecture: Backend handles auth, database via pg library
-- =============================================================================

-- Replace TABLE_NAME with your actual table name

BEGIN;

-- =============================================================================
-- STEP 1: CREATE TABLE (Idempotent)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.TABLE_NAME (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Add your columns here
);

-- =============================================================================
-- STEP 2: CREATE INDEXES (Idempotent)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_TABLE_NAME_created_at ON public.TABLE_NAME(created_at DESC);

-- =============================================================================
-- STEP 3: SAFE GRANTS (Required for Supabase 2026)
-- =============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.TABLE_NAME TO authenticated;
GRANT ALL ON public.TABLE_NAME TO service_role;
REVOKE ALL ON public.TABLE_NAME FROM anon;

-- =============================================================================
-- STEP 4: OPTIONAL RLS POLICIES (Commented out by default)
-- =============================================================================
-- RLS is OPTIONAL for custom JWT architecture.
-- Uncomment only if you have configured Supabase JWT verification.
--
-- ALTER TABLE public.TABLE_NAME ENABLE ROW LEVEL SECURITY;
--
-- -- Helper functions (if not already created):
-- CREATE OR REPLACE FUNCTION IF NOT EXISTS public.current_user_id()
-- RETURNS text AS $$
--   SELECT nullif(current_setting('request.jwt.claim.id', true), '')::text;
-- $$ LANGUAGE sql STABLE;
--
-- CREATE OR REPLACE FUNCTION IF NOT EXISTS public.current_user_role()
-- RETURNS text AS $$
--   SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
-- $$ LANGUAGE sql STABLE;
--
-- -- Example policies (customize for your table):
-- -- DROP POLICY IF EXISTS "Users can read own records" ON public.TABLE_NAME;
-- -- CREATE POLICY "Users can read own records" ON public.TABLE_NAME
-- --   FOR SELECT
-- --   USING (
-- --     current_user_id()::text = user_id::text
-- --     OR current_user_role() = 'admin'
-- --   );
--
-- -- DROP POLICY IF EXISTS "Admin can manage all" ON public.TABLE_NAME;
-- -- CREATE POLICY "Admin can manage all" ON public.TABLE_NAME
-- --   FOR ALL
-- --   USING (current_user_role() = 'admin');

COMMIT;

-- =============================================================================
-- NOTES:
-- - Custom JWT claims: id, email, role (not sub/uid)
-- - Backend uses pg library, not Supabase client
-- - RLS optional - backend handles auth
-- =============================================================================