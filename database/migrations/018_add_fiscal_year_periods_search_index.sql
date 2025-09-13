-- Migration: 018_add_fiscal_year_periods_search_index.sql
-- Description: Add index for efficient searching of custom fiscal year periods
-- Date: 2024-01-01

-- Create index for searching custom fiscal year periods by date components
CREATE INDEX idx_fiscal_year_periods_custom_search ON public.fiscal_year_periods
  (start_month, start_day, end_month, end_day, is_default, is_active);

-- Add comment
COMMENT ON INDEX idx_fiscal_year_periods_custom_search IS 'Index for efficient searching of custom fiscal year periods by date components';
