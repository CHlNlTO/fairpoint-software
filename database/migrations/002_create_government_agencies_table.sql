-- Migration: 002_create_government_agencies_table.sql
-- Description: Create government_agencies table for BIR, DTI, SEC, LGU, CDA
-- Date: 2024-01-01

-- Create government_agencies table
CREATE TABLE public.government_agencies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  website_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT government_agencies_pkey PRIMARY KEY (id),
  CONSTRAINT government_agencies_code_check CHECK (code ~ '^[A-Z0-9]{2,10}$')
);

-- Insert default government agencies
INSERT INTO public.government_agencies (code, name, full_name, description) VALUES
  ('BIR', 'BIR', 'Bureau of Internal Revenue', 'Philippine tax collection agency'),
  ('DTI', 'DTI', 'Department of Trade and Industry', 'Business registration and regulation'),
  ('SEC', 'SEC', 'Securities and Exchange Commission', 'Corporate registration and regulation'),
  ('LGU', 'LGU', 'Local Government Unit', 'Local business permits and licensing'),
  ('CDA', 'CDA', 'Cooperative Development Authority', 'Cooperative registration and regulation');

-- Create index
CREATE INDEX idx_government_agencies_active ON public.government_agencies (is_active);

-- Add comment
COMMENT ON TABLE public.government_agencies IS 'Government agencies for business registration';
COMMENT ON COLUMN public.government_agencies.code IS 'Short code for the agency (2-10 characters, alphanumeric)';
