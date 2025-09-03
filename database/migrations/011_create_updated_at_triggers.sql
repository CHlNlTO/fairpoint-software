-- Migration: 011_create_updated_at_triggers.sql
-- Description: Create updated_at triggers for all business registration tables
-- Date: 2024-01-01

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_tax_rates_updated_at
  BEFORE UPDATE ON public.tax_rates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_government_agencies_updated_at
  BEFORE UPDATE ON public.government_agencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fiscal_year_periods_updated_at
  BEFORE UPDATE ON public.fiscal_year_periods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_registrations_updated_at
  BEFORE UPDATE ON public.business_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_addresses_updated_at
  BEFORE UPDATE ON public.business_addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_government_registrations_updated_at
  BEFORE UPDATE ON public.business_government_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_templates_updated_at
  BEFORE UPDATE ON public.chart_of_accounts_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_template_items_updated_at
  BEFORE UPDATE ON public.chart_of_accounts_template_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_chart_of_accounts_updated_at
  BEFORE UPDATE ON public.business_chart_of_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Automatically updates the updated_at column when a row is modified';
