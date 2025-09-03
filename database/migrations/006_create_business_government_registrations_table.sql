-- Migration: 006_create_business_government_registrations_table.sql
-- Description: Create business_government_registrations table for government agency registrations
-- Date: 2024-01-01

-- Create business_government_registrations table
CREATE TABLE public.business_government_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_registration_id uuid NOT NULL,
  government_agency_id uuid NOT NULL,
  
  -- Registration details
  registration_number text,
  registration_date date,
  expiry_date date,
  status text NOT NULL DEFAULT 'registered', -- 'registered', 'pending', 'expired', 'cancelled'
  
  -- Additional metadata
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT business_government_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT business_government_registrations_business_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,
  CONSTRAINT business_government_registrations_agency_id_fkey FOREIGN KEY (government_agency_id) REFERENCES public.government_agencies(id),
  
  -- Business constraints
  CONSTRAINT business_government_registrations_unique_business_agency UNIQUE (business_registration_id, government_agency_id),
  CONSTRAINT business_government_registrations_registration_date_check CHECK (registration_date <= expiry_date OR expiry_date IS NULL),
  CONSTRAINT business_government_registrations_status_check CHECK (status IN ('registered', 'pending', 'expired', 'cancelled')),
  CONSTRAINT business_government_registrations_registration_number_length CHECK (char_length(registration_number) <= 100),
  CONSTRAINT business_government_registrations_notes_length CHECK (char_length(notes) <= 1000)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_business_gov_reg_business_id ON public.business_government_registrations (business_registration_id);
CREATE INDEX idx_business_gov_reg_agency_id ON public.business_government_registrations (government_agency_id);
CREATE INDEX idx_business_gov_reg_status ON public.business_government_registrations (status);
CREATE INDEX idx_business_gov_reg_active ON public.business_government_registrations (is_active);

-- Add comments
COMMENT ON TABLE public.business_government_registrations IS 'Government agency registrations for businesses';
COMMENT ON COLUMN public.business_government_registrations.registration_number IS 'Registration number from the government agency';
COMMENT ON COLUMN public.business_government_registrations.registration_date IS 'Date when registration was completed';
COMMENT ON COLUMN public.business_government_registrations.expiry_date IS 'Date when registration expires (if applicable)';
COMMENT ON COLUMN public.business_government_registrations.status IS 'Current status of the registration';
