-- Migration: 003_create_fiscal_year_periods_table.sql
-- Description: Create fiscal_year_periods table for business fiscal year options
-- Date: 2024-01-01

-- Create fiscal_year_periods table
CREATE TABLE public.fiscal_year_periods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  start_month integer NOT NULL,
  start_day integer NOT NULL,
  end_month integer NOT NULL,
  end_day integer NOT NULL,
  description text,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT fiscal_year_periods_pkey PRIMARY KEY (id),
  CONSTRAINT fiscal_year_periods_start_month_check CHECK (start_month >= 1 AND start_month <= 12),
  CONSTRAINT fiscal_year_periods_start_day_check CHECK (start_day >= 1 AND start_day <= 31),
  CONSTRAINT fiscal_year_periods_end_month_check CHECK (end_month >= 1 AND end_month <= 12),
  CONSTRAINT fiscal_year_periods_end_day_check CHECK (end_day >= 1 AND end_day <= 31)
);

-- Insert default fiscal year periods
INSERT INTO public.fiscal_year_periods (name, start_month, start_day, end_month, end_day, description, is_default) VALUES
  ('Calendar Year', 1, 1, 12, 31, 'January 1 to December 31', true),
  ('Fiscal Year (June-July)', 6, 1, 7, 31, 'June 1 to July 31', false),
  ('Custom Period', 1, 1, 12, 31, 'Other custom period (configurable)', false);

-- Create index
CREATE INDEX idx_fiscal_year_periods_active ON public.fiscal_year_periods (is_active);

-- Add comment
COMMENT ON TABLE public.fiscal_year_periods IS 'Available fiscal year periods for businesses';
COMMENT ON COLUMN public.fiscal_year_periods.start_month IS 'Starting month (1-12)';
COMMENT ON COLUMN public.fiscal_year_periods.start_day IS 'Starting day (1-31)';
COMMENT ON COLUMN public.fiscal_year_periods.end_month IS 'Ending month (1-12)';
COMMENT ON COLUMN public.fiscal_year_periods.end_day IS 'Ending day (1-31)';
