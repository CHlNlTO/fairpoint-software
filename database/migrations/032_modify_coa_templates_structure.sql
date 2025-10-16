-- Migration: 032_modify_coa_templates_structure.sql
-- Description: Modify coa_templates table to remove business_structure and business_types columns since rules are now in coa_template_rules
-- Date: 2024-01-01

-- Remove business_structure and business_types columns from coa_templates
-- These are now handled by coa_template_rules table
ALTER TABLE public.coa_templates
  DROP COLUMN IF EXISTS business_structure,
  DROP COLUMN IF EXISTS business_types;

-- Drop the indexes that were based on the removed columns
DROP INDEX IF EXISTS public.idx_coa_templates_business_structure;
DROP INDEX IF EXISTS public.idx_coa_templates_business_types;

-- Update comments
COMMENT ON TABLE public.coa_templates IS 'Chart of Accounts templates - rules for applicability are defined in coa_template_rules table';
COMMENT ON COLUMN public.coa_templates.template_name IS 'Unique name of the template';
COMMENT ON COLUMN public.coa_templates.description IS 'Description of the template and its purpose';
