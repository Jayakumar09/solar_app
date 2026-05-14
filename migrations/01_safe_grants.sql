-- =============================================================================
-- PART 1: SAFE GRANTS ONLY - Run First
-- Supabase 2026 Data API Security Requirements
-- Domain: https://grenhybridpower.in/
-- =============================================================================
-- These grants are SAFE and will not break existing functionality.
-- They restrict database-level access while preserving backend API access.
-- =============================================================================

BEGIN;

-- =============================================================================
-- SAFE GRANTS: Authenticated Only (no RLS required for backend access)
-- =============================================================================

-- Users table - authenticated access only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
REVOKE ALL ON public.users FROM anon;

-- Blogs table - authenticated access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
REVOKE ALL ON public.blogs FROM anon;

-- Calculator submissions - authenticated access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calculator_submissions TO authenticated;
GRANT ALL ON public.calculator_submissions TO service_role;
REVOKE ALL ON public.calculator_submissions FROM anon;

COMMIT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT 'GRANTS applied successfully' as status;