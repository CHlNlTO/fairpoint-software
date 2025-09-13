-- Migration: 017_update_fiscal_year_periods_rls.sql
-- Description: Update RLS policies for fiscal_year_periods to allow custom period creation
-- Date: 2024-01-01

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "No modifications to fiscal year periods" ON public.fiscal_year_periods;

-- Allow authenticated users to create custom fiscal year periods
CREATE POLICY "Authenticated users can create custom fiscal year periods" ON public.fiscal_year_periods
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND is_default = false
    AND is_active = true
  );

-- Still prevent updates and deletes to maintain data integrity
CREATE POLICY "No updates to fiscal year periods" ON public.fiscal_year_periods
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes to fiscal year periods" ON public.fiscal_year_periods
  FOR DELETE
  USING (false);

-- Add comment
COMMENT ON POLICY "Authenticated users can create custom fiscal year periods" ON public.fiscal_year_periods IS 'Allow authenticated users to create custom fiscal year periods for their business registrations';
COMMENT ON POLICY "No updates to fiscal year periods" ON public.fiscal_year_periods IS 'Prevent updates to fiscal year periods to maintain data integrity';
COMMENT ON POLICY "No deletes to fiscal year periods" ON public.fiscal_year_periods IS 'Prevent deletes to fiscal year periods to maintain data integrity';
