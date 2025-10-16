-- Migration: 031_create_coa_template_rules_table.sql
-- Description: Create coa_template_rules table to define which templates apply to which business configurations
-- Date: 2024-01-01

-- Create coa_template_rules table
CREATE TABLE public.coa_template_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  coa_template_id uuid NOT NULL,
  tax_type text,
  business_structure business_structure,
  industry_type text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT coa_template_rules_pkey PRIMARY KEY (id),
  CONSTRAINT coa_template_rules_coa_template_id_fkey FOREIGN KEY (coa_template_id) REFERENCES public.coa_templates(id) ON DELETE CASCADE,
  CONSTRAINT coa_template_rules_tax_type_check CHECK (tax_type IN ('VAT', 'Non-VAT', 'Any') OR tax_type IS NULL),
  CONSTRAINT coa_template_rules_industry_type_length CHECK (char_length(industry_type) <= 100)
);

-- Create indexes
CREATE INDEX idx_coa_template_rules_template_id ON public.coa_template_rules (coa_template_id);
CREATE INDEX idx_coa_template_rules_tax_type ON public.coa_template_rules (tax_type);
CREATE INDEX idx_coa_template_rules_business_structure ON public.coa_template_rules (business_structure);
CREATE INDEX idx_coa_template_rules_industry_type ON public.coa_template_rules (industry_type);
CREATE INDEX idx_coa_template_rules_active ON public.coa_template_rules (is_active);

-- Create composite index for common queries
CREATE INDEX idx_coa_template_rules_lookup ON public.coa_template_rules (tax_type, business_structure, industry_type) WHERE is_active = true;

-- Add comments
COMMENT ON TABLE public.coa_template_rules IS 'Rules defining which COA templates apply to which business configurations';
COMMENT ON COLUMN public.coa_template_rules.coa_template_id IS 'Reference to the COA template';
COMMENT ON COLUMN public.coa_template_rules.tax_type IS 'Tax type this rule applies to (VAT, Non-VAT, Any, or NULL for all)';
COMMENT ON COLUMN public.coa_template_rules.business_structure IS 'Business structure this rule applies to (or NULL for all)';
COMMENT ON COLUMN public.coa_template_rules.industry_type IS 'Industry type this rule applies to (or NULL for all)';
COMMENT ON COLUMN public.coa_template_rules.is_active IS 'Whether this rule is active';

-- Enable RLS
ALTER TABLE public.coa_template_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for coa_template_rules (read-only for users)
CREATE POLICY "Anyone can view COA template rules" ON public.coa_template_rules
  FOR SELECT
  USING (true);

-- No modifications allowed (system-defined)
CREATE POLICY "No modifications to COA template rules" ON public.coa_template_rules
  FOR ALL
  USING (false);

COMMENT ON POLICY "Anyone can view COA template rules" ON public.coa_template_rules IS 'Public read access to COA template rules for all users';
COMMENT ON POLICY "No modifications to COA template rules" ON public.coa_template_rules IS 'COA template rules are system-defined, no modifications allowed';
