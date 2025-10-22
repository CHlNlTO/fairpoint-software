-- Migration: 047_update_coa_template_rules_to_use_type_tables.sql
-- Description: Update coa_template_rules table to use foreign key references to tax_types, business_types, and industry_types tables
-- Date: 2024-01-01

-- Step 1: Populate the type tables with existing data from coa_template_rules
-- Insert tax types
INSERT INTO public.tax_types (name, description, hint, is_active) VALUES
  ('VAT', 'Value Added Tax - businesses registered for VAT', 'Businesses that collect and remit VAT', true),
  ('Non-VAT', 'Non-VAT businesses - percentage tax or exempt', 'Businesses not registered for VAT', true),
  ('Any', 'Applies to any tax type', 'Universal tax type rule', true)
ON CONFLICT (name) DO NOTHING;

-- Insert business types (mapping from business_structure enum values)
INSERT INTO public.business_types (name, description, hint, is_active) VALUES
  ('freelancing', 'Freelancing business structure', 'Independent contractor or freelancer', true),
  ('sole_proprietorship', 'Sole proprietorship business structure', 'Single owner business', true),
  ('partnership', 'Partnership business structure', 'Two or more partners', true),
  ('corporation', 'Corporation business structure', 'Corporate entity', true),
  ('cooperative', 'Cooperative business structure', 'Cooperative organization', true)
ON CONFLICT (name) DO NOTHING;

-- Insert industry types (mapping from existing industry_type values)
INSERT INTO public.industry_types (name, description, hint, is_active) VALUES
  ('services', 'Service-based industry', 'Businesses providing services', true),
  ('retail', 'Retail industry', 'Businesses selling goods to consumers', true),
  ('manufacturing', 'Manufacturing industry', 'Businesses producing goods', true),
  ('merchandising', 'Merchandising industry', 'Businesses buying and selling goods', true)
ON CONFLICT (name) DO NOTHING;

-- Step 2: Add new foreign key columns to coa_template_rules table
ALTER TABLE public.coa_template_rules
ADD COLUMN tax_type_id uuid,
ADD COLUMN business_type_id uuid,
ADD COLUMN industry_type_id uuid;

-- Step 3: Add foreign key constraints
ALTER TABLE public.coa_template_rules
ADD CONSTRAINT coa_template_rules_tax_type_id_fkey
  FOREIGN KEY (tax_type_id) REFERENCES public.tax_types(id) ON DELETE SET NULL;

ALTER TABLE public.coa_template_rules
ADD CONSTRAINT coa_template_rules_business_type_id_fkey
  FOREIGN KEY (business_type_id) REFERENCES public.business_types(id) ON DELETE SET NULL;

ALTER TABLE public.coa_template_rules
ADD CONSTRAINT coa_template_rules_industry_type_id_fkey
  FOREIGN KEY (industry_type_id) REFERENCES public.industry_types(id) ON DELETE SET NULL;

-- Step 4: Migrate existing data to use foreign key references
-- Update tax_type_id based on existing tax_type values
UPDATE public.coa_template_rules
SET tax_type_id = tt.id
FROM public.tax_types tt
WHERE coa_template_rules.tax_type = tt.name;

-- Update business_type_id based on existing business_structure values
UPDATE public.coa_template_rules
SET business_type_id = bt.id
FROM public.business_types bt
WHERE coa_template_rules.business_structure::text = bt.name;

-- Update industry_type_id based on existing industry_type values
UPDATE public.coa_template_rules
SET industry_type_id = it.id
FROM public.industry_types it
WHERE coa_template_rules.industry_type = it.name;

-- Step 5: Drop old columns and constraints
-- Drop indexes that reference the old columns
DROP INDEX IF EXISTS idx_coa_template_rules_tax_type;
DROP INDEX IF EXISTS idx_coa_template_rules_business_structure;
DROP INDEX IF EXISTS idx_coa_template_rules_industry_type;
DROP INDEX IF EXISTS idx_coa_template_rules_lookup;

-- Drop check constraints
ALTER TABLE public.coa_template_rules
DROP CONSTRAINT IF EXISTS coa_template_rules_tax_type_check;

ALTER TABLE public.coa_template_rules
DROP CONSTRAINT IF EXISTS coa_template_rules_industry_type_length;

-- Drop old columns
ALTER TABLE public.coa_template_rules
DROP COLUMN IF EXISTS tax_type,
DROP COLUMN IF EXISTS business_structure,
DROP COLUMN IF EXISTS industry_type;

-- Step 6: Create new indexes for foreign key columns
CREATE INDEX idx_coa_template_rules_tax_type_id ON public.coa_template_rules (tax_type_id);
CREATE INDEX idx_coa_template_rules_business_type_id ON public.coa_template_rules (business_type_id);
CREATE INDEX idx_coa_template_rules_industry_type_id ON public.coa_template_rules (industry_type_id);

-- Create composite index for common queries
CREATE INDEX idx_coa_template_rules_lookup ON public.coa_template_rules (tax_type_id, business_type_id, industry_type_id)
WHERE is_active = true;

-- Step 7: Update table comments
COMMENT ON TABLE public.coa_template_rules IS 'Rules defining which COA templates apply to which business configurations using foreign key references to type tables';
COMMENT ON COLUMN public.coa_template_rules.tax_type_id IS 'Reference to tax type this rule applies to (or NULL for all)';
COMMENT ON COLUMN public.coa_template_rules.business_type_id IS 'Reference to business type this rule applies to (or NULL for all)';
COMMENT ON COLUMN public.coa_template_rules.industry_type_id IS 'Reference to industry type this rule applies to (or NULL for all)';

-- Add comments for the new foreign key constraints
COMMENT ON CONSTRAINT coa_template_rules_tax_type_id_fkey ON public.coa_template_rules IS 'Foreign key reference to tax_types table';
COMMENT ON CONSTRAINT coa_template_rules_business_type_id_fkey ON public.coa_template_rules IS 'Foreign key reference to business_types table';
COMMENT ON CONSTRAINT coa_template_rules_industry_type_id_fkey ON public.coa_template_rules IS 'Foreign key reference to industry_types table';
