-- Migration: 033_insert_coa_template_rules.sql
-- Description: Insert template rules for the Generic COA template
-- Date: 2024-01-01

-- Insert rule for Generic COA Template - applies to all configurations
INSERT INTO public.coa_template_rules (
  coa_template_id,
  tax_type,
  business_structure,
  industry_type,
  is_active
) VALUES (
  (SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1),
  'Any',
  NULL, -- NULL means applies to all business structures
  'Any',
  true
);

-- You can add more specific rules here as needed
-- Example rules (commented out):

-- Rule for VAT - Sole Proprietorship - Retail
-- INSERT INTO public.coa_template_rules (
--   coa_template_id,
--   tax_type,
--   business_structure,
--   industry_type,
--   is_active
-- ) VALUES (
--   (SELECT id FROM coa_templates WHERE template_name = 'Retail Industry - VAT Template' LIMIT 1),
--   'VAT',
--   'sole_proprietorship',
--   'Retail',
--   true
-- );

-- Rule for VAT - Sole Proprietorship - Services
-- INSERT INTO public.coa_template_rules (
--   coa_template_id,
--   tax_type,
--   business_structure,
--   industry_type,
--   is_active
-- ) VALUES (
--   (SELECT id FROM coa_templates WHERE template_name = 'Services Industry - VAT Template' LIMIT 1),
--   'VAT',
--   'sole_proprietorship',
--   'Services',
--   true
-- );

-- Rule for Non-VAT - Any - Any
-- INSERT INTO public.coa_template_rules (
--   coa_template_id,
--   tax_type,
--   business_structure,
--   industry_type,
--   is_active
-- ) VALUES (
--   (SELECT id FROM coa_templates WHERE template_name = 'Generic Non-VAT Template' LIMIT 1),
--   'Non-VAT',
--   NULL, -- NULL means any business structure
--   'Any',
--   true
-- );

-- Add comments
COMMENT ON TABLE public.coa_template_rules IS 'Defines which COA templates are applicable based on tax type, business structure, and industry';
COMMENT ON COLUMN public.coa_template_rules.tax_type IS 'Tax type: VAT, Non-VAT, or Any for all tax types';
COMMENT ON COLUMN public.coa_template_rules.business_structure IS 'Business structure or NULL for all structures';
COMMENT ON COLUMN public.coa_template_rules.industry_type IS 'Industry type or "Any" for all industries';
