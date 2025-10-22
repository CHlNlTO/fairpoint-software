-- Migration: 046_update_coa_templates_rls_policies.sql
-- Description: Update RLS policies for coa_templates table to allow CRUD operations
-- Date: 2024-01-01

-- Drop the restrictive policy that prevents all modifications
DROP POLICY IF EXISTS "No modifications to COA templates" ON public.coa_templates;

-- Create new policies that allow authenticated users to perform CRUD operations
-- on COA templates (similar to other reference data tables)

-- Allow authenticated users to insert COA templates
CREATE POLICY "Authenticated users can insert COA templates" ON public.coa_templates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update COA templates
CREATE POLICY "Authenticated users can update COA templates" ON public.coa_templates
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete COA templates
CREATE POLICY "Authenticated users can delete COA templates" ON public.coa_templates
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add comments for the new policies
COMMENT ON POLICY "Authenticated users can insert COA templates" ON public.coa_templates IS 'Authenticated users can create new COA templates';
COMMENT ON POLICY "Authenticated users can update COA templates" ON public.coa_templates IS 'Authenticated users can update existing COA templates';
COMMENT ON POLICY "Authenticated users can delete COA templates" ON public.coa_templates IS 'Authenticated users can delete COA templates';
