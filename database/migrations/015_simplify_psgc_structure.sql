-- Migration: 015_simplify_psgc_structure.sql
-- Description: Simplify PSGC structure by keeping only barangay_psgc and removing redundant columns
-- Date: 2024-01-01

-- Remove redundant PSGC columns from business_registrations table
ALTER TABLE public.business_registrations
DROP COLUMN IF EXISTS region_psgc,
DROP COLUMN IF EXISTS province_psgc,
DROP COLUMN IF EXISTS city_municipality_psgc;

-- Remove the PSGC format constraints for the removed columns
ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_region_psgc_format,
DROP CONSTRAINT IF EXISTS business_registrations_province_psgc_format,
DROP CONSTRAINT IF EXISTS business_registrations_city_municipality_psgc_format;

-- Add computed columns for derived PSGC values (if needed for queries)
-- These can be used in SELECT statements: SELECT LEFT(barangay_psgc, 2) as region_psgc
-- Or create views if you prefer

-- Update the index to only include barangay_psgc
DROP INDEX IF EXISTS idx_business_registrations_location;
CREATE INDEX idx_business_registrations_barangay_psgc ON public.business_registrations (barangay_psgc);

-- Add comment explaining the new structure
COMMENT ON COLUMN public.business_registrations.barangay_psgc IS 'Full 10-digit PSGC code for barangay. Region (2 digits), Province (5 digits), and City/Municipality (7 digits) can be derived from this code.';
