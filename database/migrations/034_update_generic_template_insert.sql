-- Migration: 034_update_generic_template_insert.sql
-- Description: Update the generic COA template insert to match new structure without business_structure and business_types
-- Date: 2024-01-01

-- Delete the old generic template if it exists (from migration 030)
DELETE FROM public.coa_templates WHERE template_name = 'Generic Chart of Accounts Template';

-- Re-insert Generic COA Template with new structure
INSERT INTO public.coa_templates (
  id,
  template_name,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Generic Chart of Accounts Template',
  'Comprehensive generic chart of accounts template suitable for all business types, structures, and tax types',
  true,
  true
);

-- Note: The template items will remain as they were inserted in migration 030
-- The association with business configurations is now handled through coa_template_rules table
