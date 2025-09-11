-- Migration: 013_remove_locations_foreign_keys.sql
-- Description: Remove foreign key constraints that reference the non-existent locations table
-- Date: 2024-01-01

-- Remove foreign key constraints from business_registrations table
ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_province_psgc_fkey;

ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_city_municipality_psgc_fkey;

ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_barangay_psgc_fkey;

-- Update the comment to reflect that locations table is no longer used
COMMENT ON COLUMN public.business_registrations.street_address IS 'Street address (not included in PSGC data)';
