-- Migration: 004_create_business_registrations_table.sql
-- Description: Create business_registrations table for main business data
-- Date: 2024-01-01

-- Create business_registrations table
CREATE TABLE public.business_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,

  -- Step 1: Basic Business Information
  business_name text NOT NULL,
  tin_number text NOT NULL,
  business_email text NOT NULL,

  -- Step 2: Business Type (Multiple choices stored as array)
  business_types business_type[] NOT NULL DEFAULT '{}',

  -- Step 3: Fiscal Year
  fiscal_year_period_id uuid NOT NULL,

  -- Step 4: Business Structure
  business_structure business_structure NOT NULL,

  -- Step 5: Government Registration (Optional - handled in separate table)

  -- Step 6: Tax Information
  income_tax_rate_id uuid,
  business_tax_type text, -- 'vat', 'percentage_tax', 'exempt'
  business_tax_exempt boolean NOT NULL DEFAULT false,

  -- Additional Tax Information (Multiple choices stored as array)
  additional_taxes text[] NOT NULL DEFAULT '{}',

  -- Address Information (using PSGC codes + custom fields)
  barangay_psgc text NOT NULL,
  street_address text,
  building_name text,
  unit_number text,
  postal_code text,

  -- Metadata
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT business_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT business_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT business_registrations_fiscal_year_period_id_fkey FOREIGN KEY (fiscal_year_period_id) REFERENCES public.fiscal_year_periods(id),
  CONSTRAINT business_registrations_income_tax_rate_id_fkey FOREIGN KEY (income_tax_rate_id) REFERENCES public.tax_rates(id),

  -- Business constraints
  CONSTRAINT business_registrations_tin_number_format CHECK (tin_number ~ '^\d{3}-\d{3}-\d{3}-\d{3}$'),
  CONSTRAINT business_registrations_business_email_format CHECK (business_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT business_registrations_business_types_not_empty CHECK (array_length(business_types, 1) > 0),
  CONSTRAINT business_registrations_street_address_length CHECK (char_length(street_address) <= 500),
  CONSTRAINT business_registrations_building_name_length CHECK (char_length(building_name) <= 200),
  CONSTRAINT business_registrations_unit_number_length CHECK (char_length(unit_number) <= 50),
  CONSTRAINT business_registrations_postal_code_format CHECK (postal_code ~ '^\d{4}$' OR postal_code IS NULL)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_business_registrations_user_id ON public.business_registrations (user_id);
CREATE INDEX idx_business_registrations_tin_number ON public.business_registrations (tin_number);
CREATE INDEX idx_business_registrations_business_email ON public.business_registrations (business_email);
CREATE INDEX idx_business_registrations_barangay_psgc ON public.business_registrations (barangay_psgc);
CREATE INDEX idx_business_registrations_active ON public.business_registrations (is_active);

-- Add comments
COMMENT ON TABLE public.business_registrations IS 'Main business registration information';
COMMENT ON COLUMN public.business_registrations.tin_number IS 'Tax Identification Number in format 000-000-000-000';
COMMENT ON COLUMN public.business_registrations.business_types IS 'Array of business types (services, retail, manufacturing, import_export)';
COMMENT ON COLUMN public.business_registrations.business_tax_type IS 'Type of business tax: vat, percentage_tax, or exempt';
COMMENT ON COLUMN public.business_registrations.additional_taxes IS 'Array of additional tax types (withholding_tax, expanded_withholding, tamp)';
COMMENT ON COLUMN public.business_registrations.barangay_psgc IS 'Full 10-digit PSGC code for barangay. Region (2 digits), Province (5 digits), and City/Municipality (7 digits) can be derived from this code.';
COMMENT ON COLUMN public.business_registrations.street_address IS 'Street address (not included in PSGC data)';
COMMENT ON COLUMN public.business_registrations.building_name IS 'Building or establishment name';
COMMENT ON COLUMN public.business_registrations.unit_number IS 'Unit, room, or office number';
