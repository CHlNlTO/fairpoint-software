-- Migration: 038_create_specialized_coa_templates.sql
-- Description: Create specialized COA templates for different tax types, business structures, and industry types
-- Date: 2024-01-01

-- Create specialized COA templates
INSERT INTO public.coa_templates (
  id,
  template_name,
  description,
  is_default,
  is_active
) VALUES
-- Tax Type Templates
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'VAT Tax Template', 'Template for businesses with VAT tax requirements', false, true),
('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'Withholding Tax Template', 'Template for businesses with withholding tax requirements', false, true),
('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'TAMP Template', 'Template for businesses with TAMP (Top Withholding Agent) requirements', false, true),

-- Business Structure Templates
('d4e5f6a7-b8c9-0123-4567-890123defabc', 'Freelancing Template', 'Template for freelancing business structure', false, true),
('e5f6a7b8-c9d0-1234-5678-901234efabcd', 'Sole Proprietorship Template', 'Template for sole proprietorship business structure', false, true),
('f6a7b8c9-d0e1-2345-6789-012345fabcde', 'Partnership Template', 'Template for partnership business structure', false, true),
('a7b8c9d0-e1f2-3456-7890-123456abcdef', 'Corporation Template', 'Template for corporation business structure', false, true),
('b8c9d0e1-f2a3-4567-8901-234567abcdef', 'Cooperative Template', 'Template for cooperative business structure', false, true),

-- Industry Type Templates
('c9d0e1f2-a3b4-5678-9012-345678abcdef', 'Services Industry Template', 'Template for services industry businesses', false, true),
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'Retail Industry Template', 'Template for retail industry businesses', false, true),
('e1f2a3b4-c5d6-7890-1234-567890abcdef', 'Manufacturing Industry Template', 'Template for manufacturing industry businesses', false, true),
('f2a3b4c5-d6e7-8901-2345-678901abcdef', 'Merchandising Industry Template', 'Template for merchandising industry businesses', false, true);

-- Add comments
COMMENT ON TABLE public.coa_templates IS 'Chart of Accounts templates - specialized templates for different tax types, business structures, and industry types';
