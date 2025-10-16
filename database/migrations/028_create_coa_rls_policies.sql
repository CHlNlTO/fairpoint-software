-- Migration: 028_create_coa_rls_policies.sql
-- Description: Create RLS policies for all Chart of Accounts tables
-- Date: 2024-01-01

-- Enable RLS on all COA tables
ALTER TABLE public.account_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_subclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coa_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coa_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_chart_of_accounts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ACCOUNT CLASSES TABLE POLICIES (System-defined, read-only for users)
-- ============================================================================

-- Anyone can view account classes
CREATE POLICY "Anyone can view account classes" ON public.account_classes
  FOR SELECT
  USING (true);

-- No modifications allowed (system-defined)
CREATE POLICY "No modifications to account classes" ON public.account_classes
  FOR ALL
  USING (false);

-- ============================================================================
-- ACCOUNT SUBCLASSES TABLE POLICIES (System-defined, read-only for users)
-- ============================================================================

-- Anyone can view account subclasses
CREATE POLICY "Anyone can view account subclasses" ON public.account_subclasses
  FOR SELECT
  USING (true);

-- No modifications allowed (system-defined)
CREATE POLICY "No modifications to account subclasses" ON public.account_subclasses
  FOR ALL
  USING (false);

-- ============================================================================
-- ACCOUNT TYPES TABLE POLICIES (System-defined + user-defined)
-- ============================================================================

-- Anyone can view account types
CREATE POLICY "Anyone can view account types" ON public.account_types
  FOR SELECT
  USING (true);

-- Users can insert their own account types
CREATE POLICY "Users can insert own account types" ON public.account_types
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update their own account types
CREATE POLICY "Users can update own account types" ON public.account_types
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete their own account types
CREATE POLICY "Users can delete own account types" ON public.account_types
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- ACCOUNT SUBTYPES TABLE POLICIES (System-defined + user-defined)
-- ============================================================================

-- Anyone can view account subtypes
CREATE POLICY "Anyone can view account subtypes" ON public.account_subtypes
  FOR SELECT
  USING (true);

-- Users can insert their own account subtypes
CREATE POLICY "Users can insert own account subtypes" ON public.account_subtypes
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update their own account subtypes
CREATE POLICY "Users can update own account subtypes" ON public.account_subtypes
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete their own account subtypes
CREATE POLICY "Users can delete own account subtypes" ON public.account_subtypes
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    is_system_defined = false AND
    (
      user_id = auth.uid() OR
      business_registration_id IN (
        SELECT id FROM public.business_registrations
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- COA TEMPLATES TABLE POLICIES (Read-only for users)
-- ============================================================================

-- Anyone can view COA templates
CREATE POLICY "Anyone can view COA templates" ON public.coa_templates
  FOR SELECT
  USING (true);

-- No modifications allowed (system-defined)
CREATE POLICY "No modifications to COA templates" ON public.coa_templates
  FOR ALL
  USING (false);

-- ============================================================================
-- COA TEMPLATE ITEMS TABLE POLICIES (Read-only for users)
-- ============================================================================

-- Anyone can view COA template items
CREATE POLICY "Anyone can view COA template items" ON public.coa_template_items
  FOR SELECT
  USING (true);

-- No modifications allowed (system-defined)
CREATE POLICY "No modifications to COA template items" ON public.coa_template_items
  FOR ALL
  USING (false);

-- ============================================================================
-- BUSINESS CHART OF ACCOUNTS TABLE POLICIES (User-specific access)
-- ============================================================================

-- Users can view their own business chart of accounts
CREATE POLICY "Users can view own business chart of accounts" ON public.business_chart_of_accounts
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own business chart of accounts
CREATE POLICY "Users can insert own business chart of accounts" ON public.business_chart_of_accounts
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = auth.uid()
    )
  );

-- Users can update their own business chart of accounts
CREATE POLICY "Users can update own business chart of accounts" ON public.business_chart_of_accounts
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete their own business chart of accounts
CREATE POLICY "Users can delete own business chart of accounts" ON public.business_chart_of_accounts
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    business_registration_id IN (
      SELECT id FROM public.business_registrations
      WHERE user_id = auth.uid()
    )
  );

-- Add policy comments
COMMENT ON POLICY "Anyone can view account classes" ON public.account_classes IS 'Public read access to account classes for all users';
COMMENT ON POLICY "No modifications to account classes" ON public.account_classes IS 'Account classes are system-defined, no modifications allowed';

COMMENT ON POLICY "Anyone can view account subclasses" ON public.account_subclasses IS 'Public read access to account subclasses for all users';
COMMENT ON POLICY "No modifications to account subclasses" ON public.account_subclasses IS 'Account subclasses are system-defined, no modifications allowed';

COMMENT ON POLICY "Anyone can view account types" ON public.account_types IS 'Public read access to account types for all users';
COMMENT ON POLICY "Users can insert own account types" ON public.account_types IS 'Users can create their own account types';
COMMENT ON POLICY "Users can update own account types" ON public.account_types IS 'Users can update their own account types';
COMMENT ON POLICY "Users can delete own account types" ON public.account_types IS 'Users can delete their own account types';

COMMENT ON POLICY "Anyone can view account subtypes" ON public.account_subtypes IS 'Public read access to account subtypes for all users';
COMMENT ON POLICY "Users can insert own account subtypes" ON public.account_subtypes IS 'Users can create their own account subtypes';
COMMENT ON POLICY "Users can update own account subtypes" ON public.account_subtypes IS 'Users can update their own account subtypes';
COMMENT ON POLICY "Users can delete own account subtypes" ON public.account_subtypes IS 'Users can delete their own account subtypes';

COMMENT ON POLICY "Anyone can view COA templates" ON public.coa_templates IS 'Public read access to COA templates for all users';
COMMENT ON POLICY "No modifications to COA templates" ON public.coa_templates IS 'COA templates are system-defined, no modifications allowed';

COMMENT ON POLICY "Anyone can view COA template items" ON public.coa_template_items IS 'Public read access to COA template items for all users';
COMMENT ON POLICY "No modifications to COA template items" ON public.coa_template_items IS 'COA template items are system-defined, no modifications allowed';

COMMENT ON POLICY "Users can view own business chart of accounts" ON public.business_chart_of_accounts IS 'Users can only view chart of accounts for their own businesses';
COMMENT ON POLICY "Users can insert own business chart of accounts" ON public.business_chart_of_accounts IS 'Users can only insert chart of accounts for their own businesses';
COMMENT ON POLICY "Users can update own business chart of accounts" ON public.business_chart_of_accounts IS 'Users can only update chart of accounts for their own businesses';
COMMENT ON POLICY "Users can delete own business chart of accounts" ON public.business_chart_of_accounts IS 'Users can only delete chart of accounts for their own businesses';
