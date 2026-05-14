-- =============================================================================
-- PART 2: OPTIONAL RLS POLICIES - Run After Part 1
-- Supabase 2026 Data API Security Requirements
-- =============================================================================
-- WARNING: This is OPTIONAL. Your backend handles auth via custom JWT.
-- Apply only if you need database-level row security.
-- Requires Supabase JWT configuration to work with custom tokens.
-- =============================================================================

BEGIN;

-- =============================================================================
-- ENABLE RLS (Optional - requires JWT claims configuration)
-- =============================================================================

-- Only enable RLS if you have configured Supabase to accept your custom JWT
-- Uncomment the following lines AFTER configuring JWT claims:

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.calculator_submissions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CUSTOM JWT CLAIMS FUNCTION (For Supabase to read your JWT)
-- =============================================================================

-- Create a function to extract user ID from custom JWT
-- This assumes your JWT has 'id' claim (not 'sub')

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.id', true), '')::text;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ LANGUAGE sql STABLE;

-- =============================================================================
-- RLS POLICIES (Uncomment after RLS is enabled)
-- =============================================================================

-- =============================================================================
-- USERS POLICIES
-- =============================================================================
/*
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (
    current_user_id()::text = id::text
    OR current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (
    current_user_id()::text = id::text
    OR current_user_role() = 'admin'
  );
*/

-- =============================================================================
-- BLOGS POLICIES (Public read for published, authenticated write)
-- =============================================================================
/*
DROP POLICY IF EXISTS "Public can read published blogs" ON public.blogs;
CREATE POLICY "Public can read published blogs" ON public.blogs
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated can create blogs" ON public.blogs;
CREATE POLICY "Authenticated can create blogs" ON public.blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage all blogs" ON public.blogs;
CREATE POLICY "Admin can manage all blogs" ON public.blogs
  FOR ALL
  USING (current_user_role() = 'admin');
*/

-- =============================================================================
-- CALCULATOR SUBMISSIONS POLICIES
-- =============================================================================
/*
DROP POLICY IF EXISTS "Users can view own submissions" ON public.calculator_submissions;
CREATE POLICY "Users can view own submissions" ON public.calculator_submissions
  FOR SELECT
  USING (
    current_user_id()::text = user_id::text
    OR current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "Users can create submissions" ON public.calculator_submissions;
CREATE POLICY "Users can create submissions" ON public.calculator_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage all submissions" ON public.calculator_submissions;
CREATE POLICY "Admin can manage all submissions" ON public.calculator_submissions
  FOR ALL
  USING (current_user_role() = 'admin');
*/

COMMIT;

-- =============================================================================
-- NOTE: To enable RLS, you must also:
-- 1. Add 'user_id' column to calculator_submissions (schema change)
-- 2. Update frontend to send user_id with submissions
-- 3. Configure Supabase to validate your custom JWT
-- =============================================================================