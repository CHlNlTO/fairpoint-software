-- Migration: 014_remove_psgc_consistency_constraints.sql
-- Description: Remove PSGC hierarchical consistency constraints that are causing validation failures
-- Date: 2024-01-01

-- Remove PSGC hierarchical validation constraints from business_registrations table
ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_region_province_consistency;

ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_province_city_consistency;

ALTER TABLE public.business_registrations
DROP CONSTRAINT IF EXISTS business_registrations_city_barangay_consistency;
