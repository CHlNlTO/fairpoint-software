-- Migration: 044_create_type_tables.sql
-- Description: Create tax_types, business_types, and industry_types tables for categorization
-- Date: 2024-01-01

-- Create tax_types table
CREATE TABLE public.tax_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  hint text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT tax_types_pkey PRIMARY KEY (id),
  CONSTRAINT tax_types_name_unique UNIQUE (name),
  CONSTRAINT tax_types_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT tax_types_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT tax_types_hint_length CHECK (char_length(hint) <= 200)
);

-- Create business_types table
CREATE TABLE public.business_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  hint text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT business_types_pkey PRIMARY KEY (id),
  CONSTRAINT business_types_name_unique UNIQUE (name),
  CONSTRAINT business_types_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT business_types_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT business_types_hint_length CHECK (char_length(hint) <= 200)
);

-- Create industry_types table
CREATE TABLE public.industry_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  hint text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT industry_types_pkey PRIMARY KEY (id),
  CONSTRAINT industry_types_name_unique UNIQUE (name),
  CONSTRAINT industry_types_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT industry_types_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT industry_types_hint_length CHECK (char_length(hint) <= 200)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_tax_types_active ON public.tax_types (is_active);
CREATE INDEX idx_tax_types_name ON public.tax_types (name);

CREATE INDEX idx_business_types_active ON public.business_types (is_active);
CREATE INDEX idx_business_types_name ON public.business_types (name);

CREATE INDEX idx_industry_types_active ON public.industry_types (is_active);
CREATE INDEX idx_industry_types_name ON public.industry_types (name);

-- Create updated_at triggers
CREATE TRIGGER update_tax_types_updated_at
  BEFORE UPDATE ON public.tax_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_types_updated_at
  BEFORE UPDATE ON public.business_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_types_updated_at
  BEFORE UPDATE ON public.industry_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add table comments
COMMENT ON TABLE public.tax_types IS 'Tax types for categorizing different tax obligations';
COMMENT ON TABLE public.business_types IS 'Business types for categorizing different business structures';
COMMENT ON TABLE public.industry_types IS 'Industry types for categorizing different business industries';

-- Add column comments for tax_types
COMMENT ON COLUMN public.tax_types.name IS 'Display name of the tax type';
COMMENT ON COLUMN public.tax_types.description IS 'Detailed description of the tax type';
COMMENT ON COLUMN public.tax_types.hint IS 'Helpful hint for users about this tax type';
COMMENT ON COLUMN public.tax_types.is_active IS 'Whether this tax type is active';

-- Add column comments for business_types
COMMENT ON COLUMN public.business_types.name IS 'Display name of the business type';
COMMENT ON COLUMN public.business_types.description IS 'Detailed description of the business type';
COMMENT ON COLUMN public.business_types.hint IS 'Helpful hint for users about this business type';
COMMENT ON COLUMN public.business_types.is_active IS 'Whether this business type is active';

-- Add column comments for industry_types
COMMENT ON COLUMN public.industry_types.name IS 'Display name of the industry type';
COMMENT ON COLUMN public.industry_types.description IS 'Detailed description of the industry type';
COMMENT ON COLUMN public.industry_types.hint IS 'Helpful hint for users about this industry type';
COMMENT ON COLUMN public.industry_types.is_active IS 'Whether this industry type is active';

-- Add trigger comments
COMMENT ON TRIGGER update_tax_types_updated_at ON public.tax_types IS 'Automatically updates the updated_at column when a row is modified';
COMMENT ON TRIGGER update_business_types_updated_at ON public.business_types IS 'Automatically updates the updated_at column when a row is modified';
COMMENT ON TRIGGER update_industry_types_updated_at ON public.industry_types IS 'Automatically updates the updated_at column when a row is modified';
