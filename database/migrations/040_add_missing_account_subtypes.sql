-- Migration: 040_add_missing_account_subtypes.sql
-- Description: Add missing account subtypes needed for specialized COA templates
-- Date: 2024-01-01

-- Add missing account subtypes for specialized templates
INSERT INTO public.account_subtypes (account_type_id, name, is_system_defined, description, hint, code) VALUES

-- Prepaid Expenses subtypes for VAT
((SELECT id FROM account_types WHERE name = 'Prepaid Expenses'), 'Input VAT', true, 'VAT paid on purchases that can be credited against output VAT', 'VAT input tax from purchases', 2),

-- Taxes Payable subtypes for VAT and withholding taxes
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'Output VAT', true, 'VAT collected on sales that must be remitted to BIR', 'VAT output tax from sales', 5),
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'WHTax on Compensation', true, 'Withholding tax on compensation deducted from employee salaries', 'WTC deducted from employee pay', 6),
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'Expanded WHTax', true, 'Expanded withholding tax on various income payments', 'EWT on various payments', 7),

-- Owner's Equity subtypes for freelancing and sole proprietorship
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Additional Contributions', true, 'Additional capital contributions by the owner', 'Additional owner investments', 2),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Income Summary', true, 'Temporary account to close revenue and expense accounts', 'Used for closing entries', 3),

-- Owner's Drawings subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Drawings'), 'Owner''s Drawings', true, 'Owner''s withdrawals from the business', 'Personal withdrawals by owner', 2),

-- Partnership Equity subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner A Initial Capital', true, 'Initial capital contribution by Partner A', 'Partner A initial investment', 4),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner A Additional Contributions', true, 'Additional capital contributions by Partner A', 'Partner A additional investments', 5),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner A Withdrawals', true, 'Withdrawals made by Partner A', 'Partner A personal withdrawals', 6),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner A Share of Profits', true, 'Partner A share of partnership profits', 'Partner A profit allocation', 7),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner B Initial Capital', true, 'Initial capital contribution by Partner B', 'Partner B initial investment', 8),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner B Additional Contributions', true, 'Additional capital contributions by Partner B', 'Partner B additional investments', 9),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner B Withdrawals', true, 'Withdrawals made by Partner B', 'Partner B personal withdrawals', 10),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner B Share of Profits', true, 'Partner B share of partnership profits', 'Partner B profit allocation', 11),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner C Initial Capital', true, 'Initial capital contribution by Partner C', 'Partner C initial investment', 12),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner C Additional Contributions', true, 'Additional capital contributions by Partner C', 'Partner C additional investments', 13),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner C Withdrawals', true, 'Withdrawals made by Partner C', 'Partner C personal withdrawals', 14),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Partner C Share of Profits', true, 'Partner C share of partnership profits', 'Partner C profit allocation', 15),

-- Corporation Equity subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Common Shares', true, 'Common stock shares issued by the corporation', 'Common stock capital', 16),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Preferred Shares', true, 'Preferred stock shares issued by the corporation', 'Preferred stock capital', 17),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Additional Paid-in Capital', true, 'Additional capital paid in excess of par value', 'Paid-in capital in excess of par', 18),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Treasury Shares', true, 'Company shares repurchased and held in treasury', 'Treasury stock', 19),

-- Cooperative Equity subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Subscribed Common Capital', true, 'Common capital subscribed by members', 'Common capital subscriptions', 20),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Subscription Receivable - Common', true, 'Common capital subscriptions receivable from members', 'Common capital receivables', 21),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Paid Up Common Capital', true, 'Common capital fully paid by members', 'Paid common capital', 22),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Treasury Shares - Common', true, 'Common shares held in treasury', 'Common treasury shares', 23),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Subscription Receivable - Preferred', true, 'Preferred capital subscriptions receivable from members', 'Preferred capital receivables', 24),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Paid Up Preferred Capital', true, 'Preferred capital fully paid by members', 'Paid preferred capital', 25),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Treasury Shares - Preferred', true, 'Preferred shares held in treasury', 'Preferred treasury shares', 26),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Education and Training Fund', true, 'Statutory fund for education and training', 'Education fund allocation', 27),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'General Reserve Fund', true, 'General reserve fund as required by law', 'General reserve allocation', 28),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Optional Fund', true, 'Optional fund as determined by cooperative', 'Optional fund allocation', 29),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Community and Development Fund', true, 'Community and development fund', 'Community development allocation', 30),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Undivided Net Surplus', true, 'Undivided net surplus of the cooperative', 'Undistributed surplus', 31),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Restricted Capital for Surety', true, 'Capital restricted for surety purposes', 'Surety bond capital', 32),
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Donation and Grants', true, 'Donations and grants received by cooperative', 'Donation and grant income', 33),

-- Service Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Service Revenue'), 'Professional Fees', true, 'Revenue from professional services', 'Professional service income', 2),
((SELECT id FROM account_types WHERE name = 'Service Revenue'), 'Consulting Income', true, 'Revenue from consulting services', 'Consulting service income', 3),
((SELECT id FROM account_types WHERE name = 'Service Revenue'), 'Project Fees', true, 'Revenue from project-based services', 'Project service income', 4),
((SELECT id FROM account_types WHERE name = 'Service Revenue'), 'Retainer Income', true, 'Revenue from retainer agreements', 'Retainer service income', 5),

-- Sales Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'In-store Sales', true, 'Revenue from in-store sales', 'Physical store sales', 2),
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'Online Sales', true, 'Revenue from online sales', 'E-commerce sales', 3),

-- Sales Discount and Allowances subtypes
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'Sales Discount', true, 'Discounts given to customers', 'Customer discounts', 4),
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'Sales Allowance', true, 'Allowances given to customers', 'Customer allowances', 5),
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'Sales Returns', true, 'Returns from customers', 'Customer returns', 6),

-- Other Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Other Operating Revenue'), 'Other Revenue', true, 'Other operating revenue', 'Miscellaneous operating income', 2),

-- Direct Labor subtypes
((SELECT id FROM account_types WHERE name = 'Direct Labor'), 'Salaries and Wages', true, 'Direct labor salaries and wages', 'Direct labor compensation', 2),
((SELECT id FROM account_types WHERE name = 'Direct Labor'), 'Production Workers', true, 'Production worker wages', 'Manufacturing labor', 3),

-- Direct Materials subtypes
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Supplies Expense', true, 'Direct materials and supplies', 'Raw materials and supplies', 2),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Raw Materials Purchases', true, 'Raw materials purchased for production', 'Raw material procurement', 3),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Work-in-progress', true, 'Work in progress inventory', 'Manufacturing WIP', 4),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Finished Goods', true, 'Finished goods inventory', 'Completed products', 5),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Finished Goods Sold', true, 'Cost of finished goods sold', 'COGS for finished products', 6),

-- Indirect Labor subtypes
((SELECT id FROM account_types WHERE name = 'Direct Labor'), 'Subcontracting Costs', true, 'Subcontracting and outsourcing costs', 'External labor costs', 4),

-- Indirect Materials subtypes
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Packaging Materials', true, 'Packaging materials for products', 'Product packaging', 7),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Factory Supplies', true, 'Factory supplies and materials', 'Manufacturing supplies', 8),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Small Tools', true, 'Small tools and equipment', 'Manufacturing tools', 9),

-- Manufacturing Overhead subtypes
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Other Overhead Cost', true, 'Other manufacturing overhead costs', 'Miscellaneous overhead', 10),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Other Factory Costs', true, 'Other factory-related costs', 'Additional factory costs', 11),
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Inventories Adjustments', true, 'Inventory adjustments and variances', 'Inventory corrections', 12),

-- Repairs & Maintenance subtypes for manufacturing
((SELECT id FROM account_types WHERE name = 'Repairs & Maintenance'), 'Repairs & Maintenance – Factory', true, 'Factory repairs and maintenance', 'Manufacturing facility maintenance', 2),

-- Depreciation subtypes
((SELECT id FROM account_types WHERE name = 'Depreciation & Amortization'), 'Depreciation expense', true, 'Depreciation expense for fixed assets', 'Asset depreciation', 2);

-- Add comments
COMMENT ON TABLE public.account_subtypes IS 'Account subtypes including specialized subtypes for VAT, withholding taxes, different business structures, and industry-specific accounts';
