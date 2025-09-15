-- Insert Chart of Accounts Templates
-- This migration creates default chart of accounts templates for different business structures and types

-- Insert template for Retail Industry - Sole Proprietorship/Partnership/Corporation/Cooperative
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Retail Industry - Basic Template',
  'sole_proprietorship',
  ARRAY['retail']::business_type[],
  'Basic chart of accounts template for retail businesses including sole proprietorship, partnership, corporation, and cooperative structures',
  true,
  true
);

-- Get the template ID for the retail template
-- Note: You'll need to replace this with the actual UUID after running the insert
-- For now, we'll use a placeholder that you can replace

-- Insert Chart of Accounts Template Items for Retail Template
-- Assets
INSERT INTO public.chart_of_accounts_template_items (
  template_id,
  account_code,
  account_name,
  account_type,
  account_category,
  parent_account_id,
  is_active,
  is_contra_account,
  normal_balance,
  sort_order,
  level
) VALUES
-- Assets - Current Assets
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1000', 'Cash', 'asset', 'current_assets', NULL, true, false, 'debit', 1000, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1010', 'Petty Cash', 'asset', 'current_assets', NULL, true, false, 'debit', 1010, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1020', 'Accounts Receivable', 'asset', 'current_assets', NULL, true, false, 'debit', 1020, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1030', 'Inventory (Imported Goods)', 'asset', 'current_assets', NULL, true, false, 'debit', 1030, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1040', 'Prepaid Customs Duties', 'asset', 'current_assets', NULL, true, false, 'debit', 1040, 1),

-- Assets - Fixed Assets
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1050', 'Store Equipment', 'asset', 'fixed_assets', NULL, true, false, 'debit', 1050, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '1060', 'Accumulated Depreciation', 'asset', 'fixed_assets', NULL, true, true, 'credit', 1060, 1),

-- Liabilities - Current Liabilities
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '2000', 'Accounts Payable', 'liability', 'current_liabilities', NULL, true, false, 'credit', 2000, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '2010', 'Taxes Payable', 'liability', 'current_liabilities', NULL, true, false, 'credit', 2010, 1),

-- Equity
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '3000', 'Owner''s Capital', 'equity', 'owner_equity', NULL, true, false, 'credit', 3000, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '3010', 'Owner''s Drawings', 'equity', 'owner_equity', NULL, true, false, 'debit', 3010, 1),

-- Revenue
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '4000', 'Revenue', 'revenue', 'operating_revenue', NULL, true, false, 'credit', 4000, 1),

-- Cost of Goods Sold (COGS) - These are actually expenses
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '5000', 'Purchases', 'expense', 'operating_expenses', NULL, true, false, 'debit', 5000, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '5010', 'Freight & Shipping Costs', 'expense', 'operating_expenses', NULL, true, false, 'debit', 5010, 1),

-- Expenses - Operating Expenses
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '6000', 'Rent Expense', 'expense', 'operating_expenses', NULL, true, false, 'debit', 6000, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '6010', 'Utilities Expense', 'expense', 'operating_expenses', NULL, true, false, 'debit', 6010, 1),
((SELECT id FROM chart_of_accounts_templates WHERE template_name = 'Retail Industry - Basic Template' LIMIT 1), '6020', 'Marketing & Advertising', 'expense', 'operating_expenses', NULL, true, false, 'debit', 6020, 1);

-- Create additional templates for other business structures
-- Partnership Template
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Retail Industry - Partnership Template',
  'partnership',
  ARRAY['retail']::business_type[],
  'Chart of accounts template for retail partnerships',
  true,
  true
);

-- Corporation Template
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Retail Industry - Corporation Template',
  'corporation',
  ARRAY['retail']::business_type[],
  'Chart of accounts template for retail corporations',
  true,
  true
);

-- Cooperative Template
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Retail Industry - Cooperative Template',
  'cooperative',
  ARRAY['retail']::business_type[],
  'Chart of accounts template for retail cooperatives',
  true,
  true
);

-- Freelancing Template
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Services Industry - Freelancing Template',
  'freelancing',
  ARRAY['services']::business_type[],
  'Chart of accounts template for freelancing services',
  true,
  true
);

-- Create templates for other business types (Services, Manufacturing, Import/Export)
-- Services Industry Templates
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES
(gen_random_uuid(), 'Services Industry - Sole Proprietorship Template', 'sole_proprietorship', ARRAY['services']::business_type[], 'Chart of accounts template for services sole proprietorship', true, true),
(gen_random_uuid(), 'Services Industry - Partnership Template', 'partnership', ARRAY['services']::business_type[], 'Chart of accounts template for services partnership', true, true),
(gen_random_uuid(), 'Services Industry - Corporation Template', 'corporation', ARRAY['services']::business_type[], 'Chart of accounts template for services corporation', true, true),
(gen_random_uuid(), 'Services Industry - Cooperative Template', 'cooperative', ARRAY['services']::business_type[], 'Chart of accounts template for services cooperative', true, true);

-- Manufacturing Industry Templates
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES
(gen_random_uuid(), 'Manufacturing Industry - Sole Proprietorship Template', 'sole_proprietorship', ARRAY['manufacturing']::business_type[], 'Chart of accounts template for manufacturing sole proprietorship', true, true),
(gen_random_uuid(), 'Manufacturing Industry - Partnership Template', 'partnership', ARRAY['manufacturing']::business_type[], 'Chart of accounts template for manufacturing partnership', true, true),
(gen_random_uuid(), 'Manufacturing Industry - Corporation Template', 'corporation', ARRAY['manufacturing']::business_type[], 'Chart of accounts template for manufacturing corporation', true, true),
(gen_random_uuid(), 'Manufacturing Industry - Cooperative Template', 'cooperative', ARRAY['manufacturing']::business_type[], 'Chart of accounts template for manufacturing cooperative', true, true);

-- Import/Export Industry Templates
INSERT INTO public.chart_of_accounts_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES
(gen_random_uuid(), 'Import/Export Industry - Sole Proprietorship Template', 'sole_proprietorship', ARRAY['import_export']::business_type[], 'Chart of accounts template for import/export sole proprietorship', true, true),
(gen_random_uuid(), 'Import/Export Industry - Partnership Template', 'partnership', ARRAY['import_export']::business_type[], 'Chart of accounts template for import/export partnership', true, true),
(gen_random_uuid(), 'Import/Export Industry - Corporation Template', 'corporation', ARRAY['import_export']::business_type[], 'Chart of accounts template for import/export corporation', true, true),
(gen_random_uuid(), 'Import/Export Industry - Cooperative Template', 'cooperative', ARRAY['import_export']::business_type[], 'Chart of accounts template for import/export cooperative', true, true);
