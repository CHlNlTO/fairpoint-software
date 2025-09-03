-- Migration: 012_complete_rls_policies.sql
-- Description: Complete RLS policies for all business registration tables
-- Date: 2024-01-01

-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_year_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts_template_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TAX RATES TABLE POLICIES
-- ============================================================================

-- Tax rates are read-only for all authenticated users (they're reference data)
CREATE POLICY "Anyone can view tax rates" ON public.tax_rates
  FOR SELECT
  USING (true);

-- Only authenticated users can view tax rates
CREATE POLICY "Authenticated users can view tax rates" ON public.tax_rates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super admins can modify tax rates (this would be configured later)
-- For now, restrict all modifications
CREATE POLICY "No modifications to tax rates" ON public.tax_rates
  FOR ALL
  USING (false);

-- ============================================================================
-- GOVERNMENT AGENCIES TABLE POLICIES
-- ============================================================================

-- Government agencies are read-only for all authenticated users
CREATE POLICY "Anyone can view government agencies" ON public.government_agencies
  FOR SELECT
  USING (true);

-- Only authenticated users can view government agencies
CREATE POLICY "Authenticated users can view government agencies" ON public.government_agencies
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super admins can modify government agencies
-- For now, restrict all modifications
CREATE POLICY "No modifications to government agencies" ON public.government_agencies
  FOR ALL
  USING (false);

-- ============================================================================
-- FISCAL YEAR PERIODS TABLE POLICIES
-- ============================================================================

-- Fiscal year periods are read-only for all authenticated users
CREATE POLICY "Anyone can view fiscal year periods" ON public.fiscal_year_periods
  FOR SELECT
  USING (true);

-- Only authenticated users can view fiscal year periods
CREATE POLICY "Authenticated users can view fiscal year periods" ON public.fiscal_year_periods
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super admins can modify fiscal year periods
-- For now, restrict all modifications
CREATE POLICY "No modifications to fiscal year periods" ON public.fiscal_year_periods
  FOR ALL
  USING (false);

-- ============================================================================
-- CHART OF ACCOUNTS TEMPLATES TABLE POLICIES
-- ============================================================================

-- COA templates are read-only for all authenticated users
CREATE POLICY "Anyone can view COA templates" ON public.chart_of_accounts_templates
  FOR SELECT
  USING (true);

-- Only authenticated users can view COA templates
CREATE POLICY "Authenticated users can view COA templates" ON public.chart_of_accounts_templates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super admins can modify COA templates
-- For now, restrict all modifications
CREATE POLICY "No modifications to COA templates" ON public.chart_of_accounts_templates
  FOR ALL
  USING (false);

-- ============================================================================
-- CHART OF ACCOUNTS TEMPLATE ITEMS TABLE POLICIES
-- ============================================================================

-- COA template items are read-only for all authenticated users
CREATE POLICY "Anyone can view COA template items" ON public.chart_of_accounts_template_items
  FOR SELECT
  USING (true);

-- Only authenticated users can view COA template items
CREATE POLICY "Authenticated users can view COA template items" ON public.chart_of_accounts_template_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only super admins can modify COA template items
-- For now, restrict all modifications
CREATE POLICY "No modifications to COA template items" ON public.chart_of_accounts_template_items
  FOR ALL
  USING (false);

-- ============================================================================
-- BUSINESS REGISTRATIONS TABLE POLICIES (REVIEW AND ENHANCE)
-- ============================================================================

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Users can view own business registrations" ON public.business_registrations;
DROP POLICY IF EXISTS "Users can insert own business registrations" ON public.business_registrations;
DROP POLICY IF EXISTS "Users can update own business registrations" ON public.business_registrations;
DROP POLICY IF EXISTS "Users can delete own business registrations" ON public.business_registrations;

-- Enhanced business registrations policies
CREATE POLICY "Users can view own business registrations" ON public.business_registrations
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can insert own business registrations" ON public.business_registrations
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update own business registrations" ON public.business_registrations
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can delete own business registrations" ON public.business_registrations
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

-- ============================================================================
-- BUSINESS ADDRESSES TABLE POLICIES (REVIEW AND ENHANCE)
-- ============================================================================

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Users can view own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can insert own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can update own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can delete own business addresses" ON public.business_addresses;

-- Enhanced business addresses policies
CREATE POLICY "Users can view own business addresses" ON public.business_addresses
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own business addresses" ON public.business_addresses
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own business addresses" ON public.business_addresses
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own business addresses" ON public.business_addresses
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- BUSINESS GOVERNMENT REGISTRATIONS TABLE POLICIES (REVIEW AND ENHANCE)
-- ============================================================================

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Users can view own government registrations" ON public.business_government_registrations;
DROP POLICY IF EXISTS "Users can insert own government registrations" ON public.business_government_registrations;
DROP POLICY IF EXISTS "Users can update own government registrations" ON public.business_government_registrations;
DROP POLICY IF EXISTS "Users can delete own government registrations" ON public.business_government_registrations;

-- Enhanced business government registrations policies
CREATE POLICY "Users can view own government registrations" ON public.business_government_registrations
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own government registrations" ON public.business_government_registrations
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own government registrations" ON public.business_government_registrations
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own government registrations" ON public.business_government_registrations
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- BUSINESS CHART OF ACCOUNTS TABLE POLICIES (REVIEW AND ENHANCE)
-- ============================================================================

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Users can view own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can insert own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can update own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can delete own chart of accounts" ON public.business_chart_of_accounts;

-- Enhanced business chart of accounts policies
CREATE POLICY "Users can view own chart of accounts" ON public.business_chart_of_accounts
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own chart of accounts" ON public.business_chart_of_accounts
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own chart of accounts" ON public.business_chart_of_accounts
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own chart of accounts" ON public.business_chart_of_accounts
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- USER PROFILES TABLE POLICIES (REVIEW AND ENHANCE)
-- ============================================================================

-- Drop existing policies to recreate them with better logic
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

-- Enhanced user profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can delete own profile" ON public.user_profiles
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    user_id = (SELECT auth.uid())
  );

-- ============================================================================
-- ADD COMMENTS FOR ALL POLICIES
-- ============================================================================

COMMENT ON POLICY "Anyone can view tax rates" ON public.tax_rates IS 'Public read access to tax rates for all users';
COMMENT ON POLICY "Authenticated users can view tax rates" ON public.tax_rates IS 'Authenticated users can view tax rates';
COMMENT ON POLICY "No modifications to tax rates" ON public.tax_rates IS 'Tax rates are read-only, no modifications allowed';

COMMENT ON POLICY "Anyone can view government agencies" ON public.government_agencies IS 'Public read access to government agencies for all users';
COMMENT ON POLICY "Authenticated users can view government agencies" ON public.government_agencies IS 'Authenticated users can view government agencies';
COMMENT ON POLICY "No modifications to government agencies" ON public.government_agencies IS 'Government agencies are read-only, no modifications allowed';

COMMENT ON POLICY "Anyone can view fiscal year periods" ON public.fiscal_year_periods IS 'Public read access to fiscal year periods for all users';
COMMENT ON POLICY "Authenticated users can view fiscal year periods" ON public.fiscal_year_periods IS 'Authenticated users can view fiscal year periods';
COMMENT ON POLICY "No modifications to fiscal year periods" ON public.fiscal_year_periods IS 'Fiscal year periods are read-only, no modifications allowed';

COMMENT ON POLICY "Anyone can view COA templates" ON public.chart_of_accounts_templates IS 'Public read access to COA templates for all users';
COMMENT ON POLICY "Authenticated users can view COA templates" ON public.chart_of_accounts_templates IS 'Authenticated users can view COA templates';
COMMENT ON POLICY "No modifications to COA templates" ON public.chart_of_accounts_templates IS 'COA templates are read-only, no modifications allowed';

COMMENT ON POLICY "Anyone can view COA template items" ON public.chart_of_accounts_template_items IS 'Public read access to COA template items for all users';
COMMENT ON POLICY "Authenticated users can view COA template items" ON public.chart_of_accounts_template_items IS 'Authenticated users can view COA template items';
COMMENT ON POLICY "No modifications to COA template items" ON public.chart_of_accounts_template_items IS 'COA template items are read-only, no modifications allowed';

COMMENT ON POLICY "Users can view own business registrations" ON public.business_registrations IS 'Users can only view their own business registrations';
COMMENT ON POLICY "Users can insert own business registrations" ON public.business_registrations IS 'Users can only insert business registrations for themselves';
COMMENT ON POLICY "Users can update own business registrations" ON public.business_registrations IS 'Users can only update their own business registrations';
COMMENT ON POLICY "Users can delete own business registrations" ON public.business_registrations IS 'Users can only delete their own business registrations';

COMMENT ON POLICY "Users can view own business addresses" ON public.business_addresses IS 'Users can only view addresses for their own businesses';
COMMENT ON POLICY "Users can insert own business addresses" ON public.business_addresses IS 'Users can only insert addresses for their own businesses';
COMMENT ON POLICY "Users can update own business addresses" ON public.business_addresses IS 'Users can only update addresses for their own businesses';
COMMENT ON POLICY "Users can delete own business addresses" ON public.business_addresses IS 'Users can only delete addresses for their own businesses';

COMMENT ON POLICY "Users can view own government registrations" ON public.business_government_registrations IS 'Users can only view government registrations for their own businesses';
COMMENT ON POLICY "Users can insert own government registrations" ON public.business_government_registrations IS 'Users can only insert government registrations for their own businesses';
COMMENT ON POLICY "Users can update own government registrations" ON public.business_government_registrations IS 'Users can only update government registrations for their own businesses';
COMMENT ON POLICY "Users can delete own government registrations" ON public.business_government_registrations IS 'Users can only delete government registrations for their own businesses';

COMMENT ON POLICY "Users can view own chart of accounts" ON public.business_chart_of_accounts IS 'Users can only view chart of accounts for their own businesses';
COMMENT ON POLICY "Users can insert own chart of accounts" ON public.business_chart_of_accounts IS 'Users can only insert chart of accounts for their own businesses';
COMMENT ON POLICY "Users can update own chart of accounts" ON public.business_chart_of_accounts IS 'Users can only update chart of accounts for their own businesses';
COMMENT ON POLICY "Users can delete own chart of accounts" ON public.business_chart_of_accounts IS 'Users can only delete chart of accounts for their own businesses';

COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 'Users can only view their own profile';
COMMENT ON POLICY "Users can insert own profile" ON public.user_profiles IS 'Users can only insert their own profile';
COMMENT ON POLICY "Users can update own profile" ON public.user_profiles IS 'Users can only update their own profile';
COMMENT ON POLICY "Users can delete own profile" ON public.user_profiles IS 'Users can only delete their own profile';
