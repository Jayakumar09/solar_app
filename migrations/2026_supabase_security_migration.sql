-- =============================================================================
-- SUPABASE 2026 SECURITY MIGRATION - SAFE VERSION
-- Green Hybrid Power | Domain: https://greenhybridpower.in/
-- =============================================================================
-- IMPORTANT: This migration is designed for CUSTOM JWT auth (not Supabase Auth).
-- Architecture: Backend (Express) handles auth, database is accessed via pg library.
-- =============================================================================
--
-- MIGRATION ORDER:
--   Step 1: Run 01_safe_grants.sql (SAFE - won't break anything)
--   Step 2: Run 02_rls_policies_optional.sql (OPTIONAL - requires JWT config)
--
-- OR run this combined file which applies grants safely:
-- =============================================================================

BEGIN;

-- =============================================================================
-- STEP 1: SAFE GRANTS - Does not break existing functionality
-- =============================================================================

-- These grants restrict direct database access but backend API continues working
-- because backend connects as authenticated/service_role via pg library

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
REVOKE ALL ON public.users FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
REVOKE ALL ON public.blogs FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.calculator_submissions TO authenticated;
GRANT ALL ON public.calculator_submissions TO service_role;
REVOKE ALL ON public.calculator_submissions FROM anon;

-- =============================================================================
-- STEP 2: JWT CLAIMS FUNCTIONS (Optional - for future RLS)
-- =============================================================================

-- Helper functions to read custom JWT claims (id, role) instead of auth.uid()
CREATE OR REPLACE FUNCTION IF NOT EXISTS public.current_user_id()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.id', true), '')::text;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION IF NOT EXISTS public.current_user_role()
RETURNS text AS $$
  SELECT nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ LANGUAGE sql STABLE;

-- =============================================================================
-- STEP 3: RLS ENABLEMENT (COMMENTED OUT - OPTIONAL)
-- =============================================================================
-- RLS is DISABLED by default to preserve existing functionality.
-- Uncomment the lines below ONLY after:
--   1. Testing grants don't break production
--   2. Adding user_id column to calculator_submissions
--   3. Configuring Supabase to accept custom JWT
--
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.calculator_submissions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

SELECT 
  'Migration completed successfully' as status,
  'Step 1: GRANTS applied' as step_1_status,
  'Step 2: JWT functions created' as step_2_status,
  'Step 3: RLS disabled (optional)' as step_3_status;

-- Check grants applied:
SELECT 
  table_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('users', 'blogs', 'calculator_submissions')
AND grantee IN ('authenticated', 'service_role', 'anon')
ORDER BY table_name, grantee;

COMMIT;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- To rollback grants only (preserves data):
-- BEGIN;
-- REVOKE ALL ON public.users FROM authenticated, service_role;
-- REVOKE ALL ON public.blogs FROM authenticated, service_role;
-- REVOKE ALL ON public.calculator_submissions FROM authenticated, service_role;
-- GRANT ALL ON public.users TO public;
-- GRANT ALL ON public.blogs TO public;
-- GRANT ALL ON public.calculator_submissions TO public;
-- COMMIT;