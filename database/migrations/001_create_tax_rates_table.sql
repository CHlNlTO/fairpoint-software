-- Migration: 001_create_tax_rates_table.sql
-- Description: Create tax_rates table for configurable tax rates
-- Date: 2024-01-01

-- Create enum for tax types
CREATE TYPE tax_type AS ENUM (
  'income_tax',
  'business_tax',
  'withholding_tax',
  'expanded_withholding_tax',
  'tamp'
);

-- Create enum for business structures
CREATE TYPE business_structure AS ENUM (
  'freelancing',
  'sole_proprietorship',
  'partnership',
  'corporation',
  'cooperative'
);

-- Create enum for business types
CREATE TYPE business_type AS ENUM (
  'services',
  'retail',
  'manufacturing',
  'import_export'
);

-- Create tax_rates table
CREATE TABLE public.tax_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tax_type tax_type NOT NULL,
  business_structure business_structure NOT NULL,
  business_type business_type,
  rate_percentage numeric(5,2) NOT NULL,
  rate_name text NOT NULL,
  description text,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT tax_rates_pkey PRIMARY KEY (id),
  CONSTRAINT tax_rates_rate_percentage_check CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
  CONSTRAINT tax_rates_effective_date_check CHECK (effective_date <= expiry_date OR expiry_date IS NULL),
  CONSTRAINT tax_rates_unique_active_rate UNIQUE (tax_type, business_structure, business_type, effective_date)
);

-- Create index for efficient lookups
CREATE INDEX idx_tax_rates_lookup ON public.tax_rates (tax_type, business_structure, business_type, effective_date, is_active);

-- Create index for expiry date queries
CREATE INDEX idx_tax_rates_expiry ON public.tax_rates (expiry_date, is_active);

-- Add comment
COMMENT ON TABLE public.tax_rates IS 'Configurable tax rates for different business structures and types';
COMMENT ON COLUMN public.tax_rates.rate_percentage IS 'Tax rate as percentage (0.00 to 100.00)';
COMMENT ON COLUMN public.tax_rates.effective_date IS 'Date when this tax rate becomes effective';
COMMENT ON COLUMN public.tax_rates.expiry_date IS 'Date when this tax rate expires (NULL means no expiry)';
COMMENT ON COLUMN public.tax_rates.is_active IS 'Whether this tax rate is currently active';
