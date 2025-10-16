-- Migration: 035_create_updated_at_triggers_for_coa.sql
-- Description: Create updated_at triggers for COA tables
-- Date: 2024-01-01

-- Create trigger for coa_templates
DROP TRIGGER IF EXISTS set_updated_at_coa_templates ON public.coa_templates;
CREATE TRIGGER set_updated_at_coa_templates
  BEFORE UPDATE ON public.coa_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create trigger for coa_template_items
DROP TRIGGER IF EXISTS set_updated_at_coa_template_items ON public.coa_template_items;
CREATE TRIGGER set_updated_at_coa_template_items
  BEFORE UPDATE ON public.coa_template_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create trigger for coa_template_rules
DROP TRIGGER IF EXISTS set_updated_at_coa_template_rules ON public.coa_template_rules;
CREATE TRIGGER set_updated_at_coa_template_rules
  BEFORE UPDATE ON public.coa_template_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create trigger for business_chart_of_accounts
DROP TRIGGER IF EXISTS set_updated_at_business_chart_of_accounts ON public.business_chart_of_accounts;
CREATE TRIGGER set_updated_at_business_chart_of_accounts
  BEFORE UPDATE ON public.business_chart_of_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Add comments
COMMENT ON TRIGGER set_updated_at_coa_templates ON public.coa_templates IS 'Automatically update updated_at column on row update';
COMMENT ON TRIGGER set_updated_at_coa_template_items ON public.coa_template_items IS 'Automatically update updated_at column on row update';
COMMENT ON TRIGGER set_updated_at_coa_template_rules ON public.coa_template_rules IS 'Automatically update updated_at column on row update';
COMMENT ON TRIGGER set_updated_at_business_chart_of_accounts ON public.business_chart_of_accounts IS 'Automatically update updated_at column on row update';
