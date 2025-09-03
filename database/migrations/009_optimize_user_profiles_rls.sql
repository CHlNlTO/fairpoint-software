-- Migration: 009_optimize_user_profiles_rls.sql
-- Description: Optimize RLS performance by restructuring user_profiles relationship
-- Date: 2024-01-01

-- Drop existing RLS policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- Create optimized RLS policy using subquery instead of function call
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

-- Create policy for insert
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Create policy for update
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

-- Create policy for delete
CREATE POLICY "Users can delete own profile" ON public.user_profiles
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- Enable RLS on business_registrations table
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_registrations
CREATE POLICY "Users can view own business registrations" ON public.business_registrations
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own business registrations" ON public.business_registrations
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own business registrations" ON public.business_registrations
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own business registrations" ON public.business_registrations
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- Enable RLS on business_addresses table
ALTER TABLE public.business_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_addresses (inherited from business_registrations)
CREATE POLICY "Users can view own business addresses" ON public.business_addresses
  FOR SELECT
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own business addresses" ON public.business_addresses
  FOR INSERT
  WITH CHECK (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own business addresses" ON public.business_addresses
  FOR UPDATE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own business addresses" ON public.business_addresses
  FOR DELETE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Enable RLS on business_government_registrations table
ALTER TABLE public.business_government_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_government_registrations (inherited from business_registrations)
CREATE POLICY "Users can view own government registrations" ON public.business_government_registrations
  FOR SELECT
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own government registrations" ON public.business_government_registrations
  FOR INSERT
  WITH CHECK (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own government registrations" ON public.business_government_registrations
  FOR UPDATE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own government registrations" ON public.business_government_registrations
  FOR DELETE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Enable RLS on business_chart_of_accounts table
ALTER TABLE public.business_chart_of_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_chart_of_accounts (inherited from business_registrations)
CREATE POLICY "Users can view own chart of accounts" ON public.business_chart_of_accounts
  FOR SELECT
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own chart of accounts" ON public.business_chart_of_accounts
  FOR INSERT
  WITH CHECK (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own chart of accounts" ON public.business_chart_of_accounts
  FOR UPDATE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own chart of accounts" ON public.business_chart_of_accounts
  FOR DELETE
  USING (
    business_registration_id IN (
      SELECT id FROM public.business_registrations 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Add comments
COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 'Optimized RLS policy using subquery instead of function call for better performance';
COMMENT ON POLICY "Users can view own business registrations" ON public.business_registrations IS 'Users can only view their own business registrations';
COMMENT ON POLICY "Users can view own business addresses" ON public.business_addresses IS 'Users can only view addresses for their own businesses';
COMMENT ON POLICY "Users can view own government registrations" ON public.business_government_registrations IS 'Users can only view government registrations for their own businesses';
COMMENT ON POLICY "Users can view own chart of accounts" ON public.business_chart_of_accounts IS 'Users can only view chart of accounts for their own businesses';
