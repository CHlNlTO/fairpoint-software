-- Migration: 036_insert_generic_coa_template_items.sql
-- Description: Insert generic Chart of Accounts template items using template ID 6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0
-- Date: 2024-01-01

-- Insert Chart of Accounts Template Items for Generic Template
-- Template ID: 6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0

INSERT INTO public.coa_template_items (
  template_id,
  account_code,
  account_name,
  account_subtype_id,
  is_active,
  sort_order
) VALUES
-- Assets - Current Assets - Cash and Cash Equivalents
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110101', 'Petty Cash Fund', (SELECT id FROM account_subtypes WHERE name = 'Petty Cash Fund' LIMIT 1), true, 1),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110102', 'Cash on Hand', (SELECT id FROM account_subtypes WHERE name = 'Cash on Hand' LIMIT 1), true, 2),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110103', 'Cash in bank', (SELECT id FROM account_subtypes WHERE name = 'Cash in Bank' LIMIT 1), true, 3),

-- Assets - Current Assets - Accounts Receivable
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110201', 'Receivable to customers', (SELECT id FROM account_subtypes WHERE name = 'Receivable to Customers' LIMIT 1), true, 4),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110202', 'Advances to suppliers', (SELECT id FROM account_subtypes WHERE name = 'Advances to Suppliers' LIMIT 1), true, 5),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110203', 'Advances to employees', (SELECT id FROM account_subtypes WHERE name = 'Advances to Employees' LIMIT 1), true, 6),

-- Assets - Current Assets - Inventory
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110300', 'Inventory', (SELECT id FROM account_subtypes WHERE name = 'Inventory' LIMIT 1), true, 7),

-- Assets - Current Assets - Prepaid Expenses
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110400', 'Prepaid Expenses', (SELECT id FROM account_subtypes WHERE name = 'Prepaid Expenses' LIMIT 1), true, 8),

-- Assets - Current Assets - Marketable Securities
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110500', 'Marketable Securities', (SELECT id FROM account_subtypes WHERE name = 'Marketable Securities' LIMIT 1), true, 9),

-- Assets - Current Assets - Other Current Assets
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '110600', 'Other current assets', (SELECT id FROM account_subtypes WHERE name = 'Other Current Assets' LIMIT 1), true, 10),

-- Assets - Noncurrent Assets - Property, Plant & Equipment
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120101', 'Furniture and Fixtures', (SELECT id FROM account_subtypes WHERE name = 'Furniture and Fixtures' LIMIT 1), true, 11),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120102', 'Office Equipment', (SELECT id FROM account_subtypes WHERE name = 'Office Equipment' LIMIT 1), true, 12),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120103', 'Motor Vehicles', (SELECT id FROM account_subtypes WHERE name = 'Motor Vehicles' LIMIT 1), true, 13),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120104', 'Land', (SELECT id FROM account_subtypes WHERE name = 'Land' LIMIT 1), true, 14),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120105', 'Buildings', (SELECT id FROM account_subtypes WHERE name = 'Buildings' LIMIT 1), true, 15),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120106', 'Improvements', (SELECT id FROM account_subtypes WHERE name = 'Improvements' LIMIT 1), true, 16),

-- Assets - Noncurrent Assets - Accumulated Depreciation
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120201', 'Accum. Dep - Furniture and Fixtures', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Furniture and Fixtures' LIMIT 1), true, 17),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120202', 'Accum. Dep - Office Equipment', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Office Equipment' LIMIT 1), true, 18),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120203', 'Accum. Dep - Motor Vehicles', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Motor Vehicles' LIMIT 1), true, 19),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120204', 'Accum. Dep - Land', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Land' LIMIT 1), true, 20),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120205', 'Accum. Dep - Buildings', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Buildings' LIMIT 1), true, 21),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120206', 'Accum. Dep - Improvements', (SELECT id FROM account_subtypes WHERE name = 'Accum. Dep - Improvements' LIMIT 1), true, 22),

-- Assets - Noncurrent Assets - Intangible Assets
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120300', 'Intangible Assets', (SELECT id FROM account_subtypes WHERE name = 'Intangible Assets' LIMIT 1), true, 23),

-- Assets - Noncurrent Assets - Long-Term Investments
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120400', 'Long-Term Investments', (SELECT id FROM account_subtypes WHERE name = 'Long-Term Investments' LIMIT 1), true, 24),

-- Assets - Noncurrent Assets - Other Non-Current Assets
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '120500', 'Other Non-Current Assets', (SELECT id FROM account_subtypes WHERE name = 'Other Non-Current Assets' LIMIT 1), true, 25),

-- Liabilities - Current Liabilities - Accounts Payable
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210101', 'Payable to suppliers', (SELECT id FROM account_subtypes WHERE name = 'Payable to Suppliers' LIMIT 1), true, 26),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210102', 'Advances from customers', (SELECT id FROM account_subtypes WHERE name = 'Advances from Customers' LIMIT 1), true, 27),

-- Liabilities - Current Liabilities - Accrued Expenses
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210200', 'Accrued Expenses', (SELECT id FROM account_subtypes WHERE name = 'Accrued Expenses' LIMIT 1), true, 28),

-- Liabilities - Current Liabilities - Notes Payable
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210300', 'Notes Payable', (SELECT id FROM account_subtypes WHERE name = 'Notes Payable' LIMIT 1), true, 29),

-- Liabilities - Current Liabilities - Unearned Revenue
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210400', 'Unearned Revenue', (SELECT id FROM account_subtypes WHERE name = 'Unearned Revenue' LIMIT 1), true, 30),

-- Liabilities - Current Liabilities - Taxes Payable
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210501', 'SSS Payable', (SELECT id FROM account_subtypes WHERE name = 'SSS Payable' LIMIT 1), true, 31),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210502', 'HDMF Payable', (SELECT id FROM account_subtypes WHERE name = 'HDMF Payable' LIMIT 1), true, 32),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210503', 'PHIC Payable', (SELECT id FROM account_subtypes WHERE name = 'PHIC Payable' LIMIT 1), true, 33),
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210504', 'Income tax payable', (SELECT id FROM account_subtypes WHERE name = 'Income Tax Payable' LIMIT 1), true, 34),

-- Liabilities - Current Liabilities - Other Current Liabilities
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '210600', 'Other current liabilities', (SELECT id FROM account_subtypes WHERE name = 'Other Current Liabilities' LIMIT 1), true, 35),

-- Liabilities - Noncurrent Liabilities - Long-Term Loans
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '220100', 'Long-Term Loans', (SELECT id FROM account_subtypes WHERE name = 'Long-Term Loans' LIMIT 1), true, 36),

-- Liabilities - Noncurrent Liabilities - Lease Liabilities
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '220200', 'Lease Liabilities', (SELECT id FROM account_subtypes WHERE name = 'Lease Liabilities' LIMIT 1), true, 37),

-- Liabilities - Noncurrent Liabilities - Retirement Obligations
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '220300', 'Retirement Obligations', (SELECT id FROM account_subtypes WHERE name = 'Retirement Obligations' LIMIT 1), true, 38),

-- Liabilities - Noncurrent Liabilities - Other Long-Term Liabilities
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '220400', 'Other Long-Term Liabilities', (SELECT id FROM account_subtypes WHERE name = 'Other Long-Term Liabilities' LIMIT 1), true, 39),

-- Nonoperating Expenses - Selling Expenses - Personnel Costs
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '610100', 'Personnel Costs', (SELECT id FROM account_subtypes WHERE name = 'Personnel Costs' AND account_type_id = (SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'Selling Expenses' LIMIT 1) LIMIT 1) LIMIT 1), true, 40),

-- Nonoperating Expenses - Selling Expenses - Marketing & Promotion
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '610200', 'Marketing & Promotion', (SELECT id FROM account_subtypes WHERE name = 'Marketing & Promotion' LIMIT 1), true, 41),

-- Nonoperating Expenses - Selling Expenses - Selling Operations
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '610300', 'Selling Operations', (SELECT id FROM account_subtypes WHERE name = 'Selling Operations' LIMIT 1), true, 42),

-- Nonoperating Expenses - General and Administrative Expenses - Personnel Costs
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620100', 'Personnel Costs', (SELECT id FROM account_subtypes WHERE name = 'Personnel Costs' AND account_type_id = (SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'General and Administrative Expenses' LIMIT 1) LIMIT 1) LIMIT 1), true, 43),

-- Nonoperating Expenses - General and Administrative Expenses - Rent Expense
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620200', 'Rent Expense', (SELECT id FROM account_subtypes WHERE name = 'Rent Expense' LIMIT 1), true, 44),

-- Nonoperating Expenses - General and Administrative Expenses - Utilities
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620300', 'Utilities (electricity, water, internet, phone)', (SELECT id FROM account_subtypes WHERE name = 'Utilities (electricity, water, internet, phone)' LIMIT 1), true, 45),

-- Nonoperating Expenses - General and Administrative Expenses - Repairs & Maintenance
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620400', 'Repairs & Maintenance (office-related)', (SELECT id FROM account_subtypes WHERE name = 'Repairs & Maintenance (office-related)' LIMIT 1), true, 46),

-- Nonoperating Expenses - General and Administrative Expenses - Office Supplies
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620500', 'Office Supplies', (SELECT id FROM account_subtypes WHERE name = 'Office Supplies' LIMIT 1), true, 47),

-- Nonoperating Expenses - General and Administrative Expenses - Insurance
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620600', 'Insurance', (SELECT id FROM account_subtypes WHERE name = 'Insurance' LIMIT 1), true, 48),

-- Nonoperating Expenses - General and Administrative Expenses - Professional Fee
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620700', 'Professional Fee', (SELECT id FROM account_subtypes WHERE name = 'Professional Fee' LIMIT 1), true, 49),

-- Nonoperating Expenses - General and Administrative Expenses - Depreciation & Amortization
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620800', 'Depreciation & Amortization', (SELECT id FROM account_subtypes WHERE name = 'Depreciation & Amortization' LIMIT 1), true, 50),

-- Nonoperating Expenses - General and Administrative Expenses - Permits, Licenses and Taxes
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '620900', 'Permits, Licenses and Taxes', (SELECT id FROM account_subtypes WHERE name = 'Permits, Licenses and Taxes' LIMIT 1), true, 51),

-- Nonoperating Expenses - General and Administrative Expenses - Miscellaneous Expenses
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '621000', 'Miscellaneous expenses', (SELECT id FROM account_subtypes WHERE name = 'Miscellaneous Expenses' LIMIT 1), true, 52),

-- Other Income (Charges) - Other Income - Interest Income
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '710100', 'Interest Income', (SELECT id FROM account_subtypes WHERE name = 'Interest Income' LIMIT 1), true, 53),

-- Other Income (Charges) - Other Income - Dividend Income
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '710200', 'Dividend Income', (SELECT id FROM account_subtypes WHERE name = 'Dividend Income' LIMIT 1), true, 54),

-- Other Income (Charges) - Other Income - Rental Income
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '710300', 'Rental Income', (SELECT id FROM account_subtypes WHERE name = 'Rental Income' LIMIT 1), true, 55),

-- Other Income (Charges) - Other Income - Other Income
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '710400', 'Other Income', (SELECT id FROM account_subtypes WHERE name = 'Other Income' LIMIT 1), true, 56),

-- Other Income (Charges) - Other Expenses - Interest Expense
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '720100', 'Interest Expense', (SELECT id FROM account_subtypes WHERE name = 'Interest Expense' LIMIT 1), true, 57),

-- Other Income (Charges) - Other Expenses - Losses
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '720200', 'Losses', (SELECT id FROM account_subtypes WHERE name = 'Losses' LIMIT 1), true, 58),

-- Other Income (Charges) - Other Expenses - Other Expenses
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '720300', 'Other Expenses', (SELECT id FROM account_subtypes WHERE name = 'Other Expenses' LIMIT 1), true, 59),

-- Provision for Income Tax - Current Income Tax
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '810100', 'Current Income tax', (SELECT id FROM account_subtypes WHERE name = 'Current Income Tax' LIMIT 1), true, 60),

-- Provision for Income Tax - Deferred Income Tax
('6d4bb108-5acd-4ac8-b3b7-f6b9814da7c0', '820200', 'Deferred Income tax', (SELECT id FROM account_subtypes WHERE name = 'Deferred Income Tax' LIMIT 1), true, 61);

-- Add comments
COMMENT ON TABLE public.coa_template_items IS 'Individual accounts within COA templates - defines the actual chart of accounts structure';
COMMENT ON COLUMN public.coa_template_items.account_code IS '6-digit hierarchical account code (Class-Subclass-Type-Subtype)';
COMMENT ON COLUMN public.coa_template_items.account_name IS 'Display name of the account as shown in reports and statements';
COMMENT ON COLUMN public.coa_template_items.account_subtype_id IS 'Foreign key to account_subtypes - determines the account hierarchy';
COMMENT ON COLUMN public.coa_template_items.sort_order IS 'Display order within the template for financial statement presentation';
