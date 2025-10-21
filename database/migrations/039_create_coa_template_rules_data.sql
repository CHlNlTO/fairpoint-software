-- Migration: 039_create_coa_template_rules_data.sql
-- Description: Create COA template rules to define which templates apply to which business configurations
-- Date: 2024-01-01

-- Create template rules for tax types
INSERT INTO public.coa_template_rules (
  coa_template_id,
  tax_type,
  business_structure,
  industry_type,
  is_active
) VALUES
-- VAT Tax Rules
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'VAT', NULL, NULL, true),

-- Withholding Tax Rules
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'Non-VAT', NULL, NULL, true),

-- TAMP Rules
('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'Non-VAT', NULL, NULL, true),

-- Business Structure Rules
('d4e5f6a7-b8c9-0123-4567-890123defabc', NULL, 'freelancing', NULL, true),
('e5f6a7b8-c9d0-1234-5678-901234efabcd', NULL, 'sole_proprietorship', NULL, true),
('f6a7b8c9-d0e1-2345-6789-012345fabcde', NULL, 'partnership', NULL, true),
('a7b8c9d0-e1f2-3456-7890-123456abcdef', NULL, 'corporation', NULL, true),
('b8c9d0e1-f2a3-4567-8901-234567abcdef', NULL, 'cooperative', NULL, true),

-- Industry Type Rules
('c9d0e1f2-a3b4-5678-9012-345678abcdef', NULL, NULL, 'services', true),
('d0e1f2a3-b4c5-6789-0123-456789abcdef', NULL, NULL, 'retail', true),
('e1f2a3b4-c5d6-7890-1234-567890abcdef', NULL, NULL, 'manufacturing', true),
('f2a3b4c5-d6e7-8901-2345-678901abcdef', NULL, NULL, 'merchandising', true);

-- Add comments
COMMENT ON TABLE public.coa_template_rules IS 'Rules defining which COA templates apply to which business configurations based on tax type, business structure, and industry type';
