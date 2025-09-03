-- Migration: 005_create_business_addresses_table.sql
-- Description: Create business_addresses table for multiple address types per business
-- Date: 2024-01-01

-- Create enum for address types
CREATE TYPE address_type AS ENUM (
  'primary',
  'billing',
  'shipping',
  'branch',
  'warehouse'
);

-- Create business_addresses table
CREATE TABLE public.business_addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_registration_id uuid NOT NULL,
  address_type address_type NOT NULL,

  -- Address fields (using PSGC codes from @jobuntux/psgc package + custom fields)
  region_psgc text NOT NULL,
  province_psgc text NOT NULL,
  city_municipality_psgc text NOT NULL,
  barangay_psgc text NOT NULL,
  street_address text,
  building_name text,
  unit_number text,
  postal_code text,

  -- Address metadata
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT business_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT business_addresses_business_registration_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,

  -- Business constraints
  CONSTRAINT business_addresses_unique_default_per_type UNIQUE (business_registration_id, address_type, is_default),
  CONSTRAINT business_addresses_street_address_length CHECK (char_length(street_address) <= 500),
  CONSTRAINT business_addresses_building_name_length CHECK (char_length(building_name) <= 200),
  CONSTRAINT business_addresses_unit_number_length CHECK (char_length(unit_number) <= 50),
  CONSTRAINT business_addresses_postal_code_format CHECK (postal_code ~ '^\d{4}$' OR postal_code IS NULL),

  -- PSGC format validation constraints
  CONSTRAINT business_addresses_region_psgc_format CHECK (region_psgc ~ '^\d{2}0{8}$'),
  CONSTRAINT business_addresses_province_psgc_format CHECK (province_psgc ~ '^\d{5}0{5}$'),
  CONSTRAINT business_addresses_city_municipality_psgc_format CHECK (city_municipality_psgc ~ '^\d{7}0{3}$'),
  CONSTRAINT business_addresses_barangay_psgc_format CHECK (barangay_psgc ~ '^\d{10}$'),

  -- Hierarchical validation constraints
  CONSTRAINT business_addresses_region_province_consistency CHECK (LEFT(province_psgc, 2) = LEFT(region_psgc, 2)),
  CONSTRAINT business_addresses_province_city_consistency CHECK (LEFT(city_municipality_psgc, 5) = LEFT(province_psgc, 5)),
  CONSTRAINT business_addresses_city_barangay_consistency CHECK (LEFT(barangay_psgc, 7) = LEFT(city_municipality_psgc, 7))
);

-- Create indexes for efficient lookups
CREATE INDEX idx_business_addresses_business_id ON public.business_addresses (business_registration_id);
CREATE INDEX idx_business_addresses_type ON public.business_addresses (address_type);
CREATE INDEX idx_business_addresses_location ON public.business_addresses (region_psgc, province_psgc, city_municipality_psgc, barangay_psgc);
CREATE INDEX idx_business_addresses_active ON public.business_addresses (is_active);

-- Add comments
COMMENT ON TABLE public.business_addresses IS 'Multiple addresses per business (billing, shipping, etc.) using PSGC codes from @jobuntux/psgc package';
COMMENT ON COLUMN public.business_addresses.address_type IS 'Type of address: primary, billing, shipping, branch, warehouse';
COMMENT ON COLUMN public.business_addresses.is_default IS 'Whether this is the default address for this type';
COMMENT ON COLUMN public.business_addresses.region_psgc IS 'PSGC code for region (format: RR00000000)';
COMMENT ON COLUMN public.business_addresses.province_psgc IS 'PSGC code for province (format: RRRRR00000)';
COMMENT ON COLUMN public.business_addresses.city_municipality_psgc IS 'PSGC code for city/municipality (format: RRRRRRR000)';
COMMENT ON COLUMN public.business_addresses.barangay_psgc IS 'PSGC code for barangay (format: RRRRRRRRRR)';
COMMENT ON COLUMN public.business_addresses.street_address IS 'Street address (not included in PSGC data)';
COMMENT ON COLUMN public.business_addresses.building_name IS 'Building or establishment name';
COMMENT ON COLUMN public.business_addresses.unit_number IS 'Unit, room, or office number';