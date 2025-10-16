-- Migration: 025_create_coa_templates_table.sql
-- Description: Create coa_templates table for Chart of Accounts templates
-- Date: 2024-01-01

-- Create coa_templates table
CREATE TABLE public.coa_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template_name text NOT NULL UNIQUE,
  business_structure business_structure NOT NULL,
  business_types business_type[] NOT NULL DEFAULT '{}',
  description text,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT coa_templates_pkey PRIMARY KEY (id),
  CONSTRAINT coa_templates_name_length CHECK (char_length(template_name) <= 200),
  CONSTRAINT coa_templates_description_length CHECK (char_length(description) <= 1000),
  CONSTRAINT coa_templates_business_types_not_empty CHECK (array_length(business_types, 1) > 0)
);

-- Create indexes
CREATE INDEX idx_coa_templates_business_structure ON public.coa_templates (business_structure);
CREATE INDEX idx_coa_templates_business_types ON public.coa_templates USING GIN (business_types);
CREATE INDEX idx_coa_templates_active ON public.coa_templates (is_active);
CREATE INDEX idx_coa_templates_default ON public.coa_templates (is_default);

-- Add comments
COMMENT ON TABLE public.coa_templates IS 'Chart of Accounts templates for different business structures and types';
COMMENT ON COLUMN public.coa_templates.template_name IS 'Unique name of the template';
COMMENT ON COLUMN public.coa_templates.business_structure IS 'Business structure this template is designed for';
COMMENT ON COLUMN public.coa_templates.business_types IS 'Array of business types this template applies to';
COMMENT ON COLUMN public.coa_templates.description IS 'Description of the template';
COMMENT ON COLUMN public.coa_templates.is_default IS 'Whether this is a default template';
COMMENT ON COLUMN public.coa_templates.is_active IS 'Whether this template is active';
