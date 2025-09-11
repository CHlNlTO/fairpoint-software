-- Migration: 016_remove_business_addresses_table.sql
-- Description: Remove business_addresses table and all related objects
-- Date: 2024-01-01

-- Drop RLS policies first (if they exist)
DROP POLICY IF EXISTS "Users can view own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can insert own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can update own business addresses" ON public.business_addresses;
DROP POLICY IF EXISTS "Users can delete own business addresses" ON public.business_addresses;

-- Drop the update trigger (if it exists)
DROP TRIGGER IF EXISTS update_business_addresses_updated_at ON public.business_addresses;

-- Drop indexes (if they exist)
DROP INDEX IF EXISTS idx_business_addresses_business_id;
DROP INDEX IF EXISTS idx_business_addresses_type;
DROP INDEX IF EXISTS idx_business_addresses_location;
DROP INDEX IF EXISTS idx_business_addresses_active;

-- Drop the table (this will also drop all constraints)
DROP TABLE IF EXISTS public.business_addresses;

-- Drop the address_type enum (if it exists and is not used elsewhere)
DROP TYPE IF EXISTS address_type;
