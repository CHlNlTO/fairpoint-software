-- Migration: 010_insert_default_tax_rates.sql
-- Description: Insert default tax rates based on business structure requirements
-- Date: 2024-01-01

-- Insert default tax rates for different business structures
-- Based on the flowchart requirements

-- Freelancing/Sole Proprietorship Income Tax Rates
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('income_tax', 'freelancing', NULL, 0.00, 'Graduated Tax Rate', 'Graduated tax rate based on income brackets'),
  ('income_tax', 'freelancing', NULL, 8.00, '8% Tax Rate', '8% tax rate option for freelancers'),
  ('income_tax', 'freelancing', NULL, 0.00, 'BMBE', 'Barangay Micro Business Enterprise - tax exempt'),
  
  ('income_tax', 'sole_proprietorship', NULL, 0.00, 'Graduated Tax Rate', 'Graduated tax rate based on income brackets'),
  ('income_tax', 'sole_proprietorship', NULL, 8.00, '8% Tax Rate', '8% tax rate option for sole proprietors'),
  ('income_tax', 'sole_proprietorship', NULL, 0.00, 'BMBE', 'Barangay Micro Business Enterprise - tax exempt');

-- Partnership Income Tax Rates
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('income_tax', 'partnership', NULL, 0.00, 'GPP Tax-Exempt', 'General Professional Partnership - tax exempt'),
  ('income_tax', 'partnership', NULL, 20.00, '20% Corporate Tax', '20% corporate tax rate for partnerships'),
  ('income_tax', 'partnership', NULL, 25.00, '25% Corporate Tax', '25% corporate tax rate for partnerships');

-- Corporation Income Tax Rates
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('income_tax', 'corporation', NULL, 20.00, '20% Corporate Tax', '20% corporate tax rate'),
  ('income_tax', 'corporation', NULL, 5.00, '5% Gross Income Tax', '5% gross income tax option'),
  ('income_tax', 'corporation', NULL, 25.00, '25% Corporate Tax', '25% corporate tax rate'),
  ('income_tax', 'corporation', NULL, 0.00, 'Tax-Exempt', 'Tax-exempt corporations');

-- Cooperative Income Tax Rates
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('income_tax', 'cooperative', NULL, 0.00, 'With Tax Exempt Certificate', 'Tax exempt with proper certificate'),
  ('income_tax', 'cooperative', NULL, 20.00, '20% Corporate Tax with Members', '20% corporate tax with member benefits');

-- Business Tax Rates (VAT and Percentage Tax)
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('business_tax', 'freelancing', NULL, 12.00, 'VAT', 'Value Added Tax (for sales > ₱3M)'),
  ('business_tax', 'freelancing', NULL, 3.00, 'Percentage Tax', '3% percentage tax'),
  
  ('business_tax', 'sole_proprietorship', NULL, 12.00, 'VAT', 'Value Added Tax (for sales > ₱3M)'),
  ('business_tax', 'sole_proprietorship', NULL, 3.00, 'Percentage Tax', '3% percentage tax'),
  
  ('business_tax', 'partnership', NULL, 12.00, 'VAT', 'Value Added Tax (for sales > ₱3M)'),
  ('business_tax', 'partnership', NULL, 3.00, 'Percentage Tax', '3% percentage tax'),
  
  ('business_tax', 'corporation', NULL, 12.00, 'VAT', 'Value Added Tax (for sales > ₱3M)'),
  ('business_tax', 'corporation', NULL, 3.00, 'Percentage Tax', '3% percentage tax'),
  
  ('business_tax', 'cooperative', NULL, 12.00, 'VAT', 'Value Added Tax (for sales > ₱3M)'),
  ('business_tax', 'cooperative', NULL, 3.00, 'Percentage Tax', '3% percentage tax');

-- Additional Tax Rates
INSERT INTO public.tax_rates (tax_type, business_structure, business_type, rate_percentage, rate_name, description) VALUES
  ('withholding_tax', 'freelancing', NULL, 2.00, '1601C Withholding Tax', '2% withholding tax on payments'),
  ('withholding_tax', 'sole_proprietorship', NULL, 2.00, '1601C Withholding Tax', '2% withholding tax on payments'),
  ('withholding_tax', 'partnership', NULL, 2.00, '1601C Withholding Tax', '2% withholding tax on payments'),
  ('withholding_tax', 'corporation', NULL, 2.00, '1601C Withholding Tax', '2% withholding tax on payments'),
  ('withholding_tax', 'cooperative', NULL, 2.00, '1601C Withholding Tax', '2% withholding tax on payments'),
  
  ('expanded_withholding_tax', 'freelancing', NULL, 1.00, 'Expanded Withholding Tax', '1% expanded withholding tax'),
  ('expanded_withholding_tax', 'sole_proprietorship', NULL, 1.00, 'Expanded Withholding Tax', '1% expanded withholding tax'),
  ('expanded_withholding_tax', 'partnership', NULL, 1.00, 'Expanded Withholding Tax', '1% expanded withholding tax'),
  ('expanded_withholding_tax', 'corporation', NULL, 1.00, 'Expanded Withholding Tax', '1% expanded withholding tax'),
  ('expanded_withholding_tax', 'cooperative', NULL, 1.00, 'Expanded Withholding Tax', '1% expanded withholding tax'),
  
  ('tamp', 'freelancing', NULL, 0.00, 'TAMP', 'Tax on Amusement and Performance'),
  ('tamp', 'sole_proprietorship', NULL, 0.00, 'TAMP', 'Tax on Amusement and Performance'),
  ('tamp', 'partnership', NULL, 0.00, 'TAMP', 'Tax on Amusement and Performance'),
  ('tamp', 'corporation', NULL, 0.00, 'TAMP', 'Tax on Amusement and Performance'),
  ('tamp', 'cooperative', NULL, 0.00, 'TAMP', 'Tax on Amusement and Performance');

-- Add comments
COMMENT ON TABLE public.tax_rates IS 'Default tax rates inserted based on business registration flowchart requirements';
