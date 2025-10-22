-- Migration: 045_add_rls_policies_for_type_tables.sql
-- Description: Add RLS policies for tax_types, business_types, and industry_types tables
-- Date: 2024-01-01

-- Enable RLS on all type tables
ALTER TABLE public.tax_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_types ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TAX TYPES TABLE POLICIES
-- ============================================================================

-- Public can view tax types
CREATE POLICY "Anyone can view tax types" ON public.tax_types
  FOR SELECT
  USING (true);

-- Authenticated users can view tax types (explicit)
CREATE POLICY "Authenticated users can view tax types" ON public.tax_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to INSERT tax types
CREATE POLICY "Authenticated users can insert tax types" ON public.tax_types
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE tax types
CREATE POLICY "Authenticated users can update tax types" ON public.tax_types
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE tax types
CREATE POLICY "Authenticated users can delete tax types" ON public.tax_types
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- BUSINESS TYPES TABLE POLICIES
-- ============================================================================

-- Public can view business types
CREATE POLICY "Anyone can view business types" ON public.business_types
  FOR SELECT
  USING (true);

-- Authenticated users can view business types (explicit)
CREATE POLICY "Authenticated users can view business types" ON public.business_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to INSERT business types
CREATE POLICY "Authenticated users can insert business types" ON public.business_types
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE business types
CREATE POLICY "Authenticated users can update business types" ON public.business_types
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE business types
CREATE POLICY "Authenticated users can delete business types" ON public.business_types
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- INDUSTRY TYPES TABLE POLICIES
-- ============================================================================

-- Public can view industry types
CREATE POLICY "Anyone can view industry types" ON public.industry_types
  FOR SELECT
  USING (true);

-- Authenticated users can view industry types (explicit)
CREATE POLICY "Authenticated users can view industry types" ON public.industry_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to INSERT industry types
CREATE POLICY "Authenticated users can insert industry types" ON public.industry_types
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE industry types
CREATE POLICY "Authenticated users can update industry types" ON public.industry_types
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE industry types
CREATE POLICY "Authenticated users can delete industry types" ON public.industry_types
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Add comments for policies
COMMENT ON POLICY "Anyone can view tax types" ON public.tax_types IS 'Allow public read access to tax types';
COMMENT ON POLICY "Authenticated users can view tax types" ON public.tax_types IS 'Allow authenticated users to view tax types';
COMMENT ON POLICY "Authenticated users can insert tax types" ON public.tax_types IS 'Allow authenticated users to insert tax types';
COMMENT ON POLICY "Authenticated users can update tax types" ON public.tax_types IS 'Allow authenticated users to update tax types';
COMMENT ON POLICY "Authenticated users can delete tax types" ON public.tax_types IS 'Allow authenticated users to delete tax types';

COMMENT ON POLICY "Anyone can view business types" ON public.business_types IS 'Allow public read access to business types';
COMMENT ON POLICY "Authenticated users can view business types" ON public.business_types IS 'Allow authenticated users to view business types';
COMMENT ON POLICY "Authenticated users can insert business types" ON public.business_types IS 'Allow authenticated users to insert business types';
COMMENT ON POLICY "Authenticated users can update business types" ON public.business_types IS 'Allow authenticated users to update business types';
COMMENT ON POLICY "Authenticated users can delete business types" ON public.business_types IS 'Allow authenticated users to delete business types';

COMMENT ON POLICY "Anyone can view industry types" ON public.industry_types IS 'Allow public read access to industry types';
COMMENT ON POLICY "Authenticated users can view industry types" ON public.industry_types IS 'Allow authenticated users to view industry types';
COMMENT ON POLICY "Authenticated users can insert industry types" ON public.industry_types IS 'Allow authenticated users to insert industry types';
COMMENT ON POLICY "Authenticated users can update industry types" ON public.industry_types IS 'Allow authenticated users to update industry types';
COMMENT ON POLICY "Authenticated users can delete industry types" ON public.industry_types IS 'Allow authenticated users to delete industry types';