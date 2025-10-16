-- Migration: 030_insert_generic_coa_template.sql
-- Description: Insert generic Chart of Accounts template based on Database Structure.xlsx - C.0.d.csv
-- Date: 2024-01-01

-- Insert Generic COA Template
INSERT INTO public.coa_templates (
  id,
  template_name,
  business_structure,
  business_types,
  description,
  is_default,
  is_active
) VALUES (
  gen_random_uuid(),
  'Generic Chart of Accounts Template',
  'sole_proprietorship',
  ARRAY['retail', 'services', 'manufacturing', 'import_export']::business_type[],
  'Comprehensive generic chart of accounts template suitable for all business types and structures',
  true,
  true
);

-- Get the template ID for the generic template
-- We'll use a variable to store the template ID for the template items

-- Insert Chart of Accounts Template Items for Generic Template
INSERT INTO public.coa_template_items (
  template_id,
  account_code,
  account_name,
  account_subtype_id,
  is_active,
  sort_order
) VALUES
-- Assets - Current Assets
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110101', 'Petty Cash Fund', (SELECT id FROM account_subtypes WHERE name = 'Petty Cash Fund' LIMIT 1), true, 1),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110102', 'Cash on Hand', (SELECT id FROM account_subtypes WHERE name = 'Cash on Hand' LIMIT 1), true, 2),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110103', 'Cash in bank', (SELECT id FROM account_subtypes WHERE name = 'Cash in Bank' LIMIT 1), true, 3),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110201', 'Receivable to customers', (SELECT id FROM account_subtypes WHERE name = 'Receivable to Customers' LIMIT 1), true, 4),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110202', 'Advances to suppliers', (SELECT id FROM account_subtypes WHERE name = 'Advances to Suppliers' LIMIT 1), true, 5),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110203', 'Advances to employees', (SELECT id FROM account_subtypes WHERE name = 'Advances to Employees' LIMIT 1), true, 6),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110300', 'Inventory', (SELECT id FROM account_subtypes WHERE name = 'Inventory' LIMIT 1), true, 7),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110400', 'Prepaid Expenses', (SELECT id FROM account_subtypes WHERE name = 'Prepaid Expenses' LIMIT 1), true, 8),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110500', 'Marketable Securities', (SELECT id FROM account_subtypes WHERE name = 'Marketable Securities' LIMIT 1), true, 9),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '110600', 'Other current assets', (SELECT id FROM account_subtypes WHERE name = 'Other Current Assets' LIMIT 1), true, 10),

-- Assets - Noncurrent Assets
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120101', 'Furniture and Fixtures', (SELECT id FROM account_subtypes WHERE name = 'Furniture and Fixtures' LIMIT 1), true, 11),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120102', 'Office Equipment', (SELECT id FROM account_subtypes WHERE name = 'Office Equipment' LIMIT 1), true, 12),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120103', 'Motor Vehicles', (SELECT id FROM account_subtypes WHERE name = 'Motor Vehicles' LIMIT 1), true, 13),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120104', 'Land', (SELECT id FROM account_subtypes WHERE name = 'Land' LIMIT 1), true, 14),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120105', 'Buildings', (SELECT id FROM account_subtypes WHERE name = 'Buildings' LIMIT 1), true, 15),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120106', 'Improvements', (SELECT id FROM account_subtypes WHERE name = 'Improvements' LIMIT 1), true, 16),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120201', 'Accum. Dep - Furniture and Fixtures', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Furniture and Fixtures' LIMIT 1), true, 17),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120202', 'Accum. Dep - Office Equipment', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Office Equipment' LIMIT 1), true, 18),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120203', 'Accum. Dep - Motor Vehicles', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Motor Vehicles' LIMIT 1), true, 19),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120204', 'Accum. Dep - Land', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Land' LIMIT 1), true, 20),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120205', 'Accum. Dep - Buildings', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Buildings' LIMIT 1), true, 21),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120206', 'Accum. Dep - Improvements', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Improvements' LIMIT 1), true, 22),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120300', 'Intangible Assets', (SELECT id FROM account_subtypes WHERE name = 'Intangible Assets' LIMIT 1), true, 23),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120400', 'Long-Term Investments', (SELECT id FROM account_subtypes WHERE name = 'Long-Term Investments' LIMIT 1), true, 24),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '120500', 'Other Non-Current Assets', (SELECT id FROM account_subtypes WHERE name = 'Other Non-Current Assets' LIMIT 1), true, 25),

-- Liabilities - Current Liabilities
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210101', 'Payable to suppliers', (SELECT id FROM account_subtypes WHERE name = 'Payable to Suppliers' LIMIT 1), true, 26),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210102', 'Advances from customers', (SELECT id FROM account_subtypes WHERE name = 'Advances from Customers' LIMIT 1), true, 27),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210200', 'Accrued Expenses', (SELECT id FROM account_subtypes WHERE name = 'Accrued Expenses' LIMIT 1), true, 28),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210300', 'Notes Payable', (SELECT id FROM account_subtypes WHERE name = 'Notes Payable' LIMIT 1), true, 29),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210400', 'Unearned Revenue', (SELECT id FROM account_subtypes WHERE name = 'Unearned Revenue' LIMIT 1), true, 30),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210501', 'SSS Payable', (SELECT id FROM account_subtypes WHERE name = 'SSS Payable' LIMIT 1), true, 31),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210502', 'HDMF Payable', (SELECT id FROM account_subtypes WHERE name = 'HDMF Payable' LIMIT 1), true, 32),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210503', 'PHIC Payable', (SELECT id FROM account_subtypes WHERE name = 'PHIC Payable' LIMIT 1), true, 33),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210504', 'Income tax payable', (SELECT id FROM account_subtypes WHERE name = 'Income Tax Payable' LIMIT 1), true, 34),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '210600', 'Other current liabilities', (SELECT id FROM account_subtypes WHERE name = 'Other Current Liabilities' LIMIT 1), true, 35),

-- Liabilities - Noncurrent Liabilities
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '220100', 'Long-Term Loans', (SELECT id FROM account_subtypes WHERE name = 'Long-Term Loans' LIMIT 1), true, 36),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '220200', 'Lease Liabilities', (SELECT id FROM account_subtypes WHERE name = 'Lease Liabilities' LIMIT 1), true, 37),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '220300', 'Retirement Obligations', (SELECT id FROM account_subtypes WHERE name = 'Retirement Obligations' LIMIT 1), true, 38),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '220400', 'Other Long-Term Liabilities', (SELECT id FROM account_subtypes WHERE name = 'Other Long-Term Liabilities' LIMIT 1), true, 39),

-- Nonoperating Expenses - Selling Expenses
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '610100', 'Personnel Costs', (SELECT id FROM account_subtypes WHERE name = 'Personnel Costs' AND account_type_id = (SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'Selling Expenses' LIMIT 1) LIMIT 1) LIMIT 1), true, 40),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '610200', 'Marketing & Promotion', (SELECT id FROM account_subtypes WHERE name = 'Marketing & Promotion' LIMIT 1), true, 41),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '610300', 'Selling Operations', (SELECT id FROM account_subtypes WHERE name = 'Selling Operations' LIMIT 1), true, 42),

-- Nonoperating Expenses - General and Administrative Expenses
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620100', 'Personnel Costs', (SELECT id FROM account_subtypes WHERE name = 'Personnel Costs' AND account_type_id = (SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'General and Administrative Expenses' LIMIT 1) LIMIT 1) LIMIT 1), true, 43),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620200', 'Rent Expense', (SELECT id FROM account_subtypes WHERE name = 'Rent Expense' LIMIT 1), true, 44),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620300', 'Utilities (electricity, water, internet, phone)', (SELECT id FROM account_subtypes WHERE name = 'Utilities (electricity, water, internet, phone)' LIMIT 1), true, 45),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620400', 'Repairs & Maintenance (office-related)', (SELECT id FROM account_subtypes WHERE name = 'Repairs & Maintenance (office-related)' LIMIT 1), true, 46),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620500', 'Office Supplies', (SELECT id FROM account_subtypes WHERE name = 'Office Supplies' LIMIT 1), true, 47),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620600', 'Insurance', (SELECT id FROM account_subtypes WHERE name = 'Insurance' LIMIT 1), true, 48),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620700', 'Professional Fee', (SELECT id FROM account_subtypes WHERE name = 'Professional Fee' LIMIT 1), true, 49),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620800', 'Depreciation & Amortization', (SELECT id FROM account_subtypes WHERE name = 'Depreciation & Amortization' LIMIT 1), true, 50),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '620900', 'Permits, Licenses and Taxes', (SELECT id FROM account_subtypes WHERE name = 'Permits, Licenses and Taxes' LIMIT 1), true, 51),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '621000', 'Miscellaneous expenses', (SELECT id FROM account_subtypes WHERE name = 'Miscellaneous Expenses' LIMIT 1), true, 52),

-- Other Income (Charges) - Other Income
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '710100', 'Interest Income', (SELECT id FROM account_subtypes WHERE name = 'Interest Income' LIMIT 1), true, 53),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '710200', 'Dividend Income', (SELECT id FROM account_subtypes WHERE name = 'Dividend Income' LIMIT 1), true, 54),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '710300', 'Rental Income', (SELECT id FROM account_subtypes WHERE name = 'Rental Income' LIMIT 1), true, 55),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '710400', 'Other Income', (SELECT id FROM account_subtypes WHERE name = 'Other Income' LIMIT 1), true, 56),

-- Other Income (Charges) - Other Expenses
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '720100', 'Interest Expense', (SELECT id FROM account_subtypes WHERE name = 'Interest Expense' LIMIT 1), true, 57),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '720200', 'Losses', (SELECT id FROM account_subtypes WHERE name = 'Losses' LIMIT 1), true, 58),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '720300', 'Other Expenses', (SELECT id FROM account_subtypes WHERE name = 'Other Expenses' LIMIT 1), true, 59),

-- Provision for Income Tax
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '810100', 'Current Income tax', (SELECT id FROM account_subtypes WHERE name = 'Current Income Tax' LIMIT 1), true, 60),
((SELECT id FROM coa_templates WHERE template_name = 'Generic Chart of Accounts Template' LIMIT 1), '820200', 'Deferred Income tax', (SELECT id FROM account_subtypes WHERE name = 'Deferred Income Tax' LIMIT 1), true, 61);

-- Add comments
COMMENT ON TABLE public.coa_templates IS 'Chart of Accounts templates for different business structures and types';
COMMENT ON TABLE public.coa_template_items IS 'Individual accounts within COA templates';
COMMENT ON COLUMN public.coa_template_items.account_code IS '6-digit account code following the hierarchical structure';
COMMENT ON COLUMN public.coa_template_items.account_name IS 'Display name of the account';
COMMENT ON COLUMN public.coa_template_items.account_subtype_id IS 'Reference to the account subtype';
COMMENT ON COLUMN public.coa_template_items.sort_order IS 'Order of display within the template';
