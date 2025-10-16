-- Migration: 029_insert_default_coa_data.sql
-- Description: Insert default data for Chart of Accounts lookup tables
-- Date: 2024-01-01

-- Insert Account Classes
INSERT INTO public.account_classes (code, name, normal_balance, description, hint) VALUES
(1, 'Assets', 'debit', 'Resources owned by the business that provide future economic benefit', 'Assets increase with debits and decrease with credits'),
(2, 'Liabilities', 'credit', 'Obligations the business owes, to be settled in money, goods, or services', 'Liabilities increase with credits and decrease with debits'),
(3, 'Equity', 'credit', 'The owners'' residual interest in the business (Assets – Liabilities)', 'Equity increases with credits and decreases with debits'),
(4, 'Revenue', 'credit', 'Income generated from the company''s primary operations', 'Revenue increases with credits and decreases with debits'),
(5, 'Cost of Sales', 'debit', 'The direct costs of producing or acquiring the goods/services sold', 'Cost of Sales increases with debits and decreases with credits'),
(6, 'Nonoperating Expenses', 'debit', 'Costs incurred that are not related to the company''s core operations', 'Nonoperating Expenses increase with debits and decrease with credits'),
(7, 'Other Income (Charges)', 'credit', 'Income or expenses from activities outside of normal business operations', 'Other Income increases with credits, Other Expenses increase with debits'),
(8, 'Provision for Income Tax', 'debit', 'The estimated income tax expense for the current period', 'Provision for Income Tax increases with debits and decreases with credits');

-- Insert Account Subclasses
INSERT INTO public.account_subclasses (account_class_id, code, name, description, hint) VALUES
-- Assets subclasses
((SELECT id FROM account_classes WHERE code = 1), 1, 'Current Assets', 'Assets that are expected to be converted to cash within one year', 'Include cash, receivables, inventory, and prepaid expenses'),
((SELECT id FROM account_classes WHERE code = 1), 2, 'Noncurrent Assets', 'Assets that are not expected to be converted to cash within one year', 'Include property, plant, equipment, and long-term investments'),

-- Liabilities subclasses
((SELECT id FROM account_classes WHERE code = 2), 1, 'Current Liabilities', 'Obligations due within one year', 'Include accounts payable, accrued expenses, and short-term loans'),
((SELECT id FROM account_classes WHERE code = 2), 2, 'Noncurrent Liabilities', 'Obligations due beyond one year', 'Include long-term loans, bonds payable, and lease liabilities'),

-- Equity subclasses
((SELECT id FROM account_classes WHERE code = 3), 1, 'Owner''s Equity', 'The residual interest of owners in the business', 'Include capital contributions, retained earnings, and drawings'),

-- Revenue subclasses
((SELECT id FROM account_classes WHERE code = 4), 1, 'Operating Revenue', 'Revenue from primary business operations', 'Include sales revenue, service revenue, and other operating income'),

-- Cost of Sales subclasses
((SELECT id FROM account_classes WHERE code = 5), 1, 'Direct Costs', 'Direct costs associated with producing goods or services', 'Include materials, labor, and manufacturing overhead'),

-- Nonoperating Expenses subclasses
((SELECT id FROM account_classes WHERE code = 6), 1, 'Selling Expenses', 'Expenses related to selling activities', 'Include sales salaries, advertising, and sales commissions'),
((SELECT id FROM account_classes WHERE code = 6), 2, 'General and Administrative Expenses', 'Expenses related to general business operations', 'Include office rent, utilities, and administrative salaries'),

-- Other Income (Charges) subclasses
((SELECT id FROM account_classes WHERE code = 7), 1, 'Other Income', 'Income from non-operating activities', 'Include interest income, dividend income, and rental income'),
((SELECT id FROM account_classes WHERE code = 7), 2, 'Other Expenses', 'Expenses from non-operating activities', 'Include interest expense, losses, and other non-operating expenses'),

-- Provision for Income Tax subclasses
((SELECT id FROM account_classes WHERE code = 8), 1, 'Current Income Tax', 'Income tax expense for the current period', 'Include current year income tax provision'),
((SELECT id FROM account_classes WHERE code = 8), 2, 'Deferred Income Tax', 'Income tax expense for future periods', 'Include deferred tax assets and liabilities');

-- Insert Account Types
INSERT INTO public.account_types (account_subclass_id, name, is_system_defined, description, hint) VALUES
-- Current Assets types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Cash and Cash Equivalents', true, 'Cash and assets readily convertible to cash', 'Include petty cash, cash on hand, and cash in bank'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Accounts Receivable', true, 'Amounts owed to the business by customers', 'Include trade receivables and other receivables'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Inventory', true, 'Goods held for sale or materials for production', 'Include finished goods, work in progress, and raw materials'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Prepaid Expenses', true, 'Expenses paid in advance', 'Include prepaid rent, insurance, and supplies'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Marketable Securities', true, 'Short-term investments in securities', 'Include stocks and bonds held for short-term trading'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 1), 'Other Current Assets', true, 'Other assets expected to be converted to cash within one year', 'Include deposits, advances, and other current assets'),

-- Noncurrent Assets types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 2), 'Property, Plant & Equipment', true, 'Long-term assets used in business operations', 'Include land, buildings, equipment, and vehicles'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 2), 'Accumulated Depreciation', true, 'Contra-asset account for accumulated depreciation', 'Reduces the carrying value of fixed assets'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 2), 'Intangible Assets', true, 'Non-physical assets with value', 'Include patents, trademarks, and goodwill'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 2), 'Long-Term Investments', true, 'Investments held for more than one year', 'Include stocks, bonds, and other long-term investments'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 1) AND code = 2), 'Other Non-Current Assets', true, 'Other assets not expected to be converted to cash within one year', 'Include deferred charges and other long-term assets'),

-- Current Liabilities types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Accounts Payable', true, 'Amounts owed to suppliers and vendors', 'Include trade payables and other payables'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Accrued Expenses', true, 'Expenses incurred but not yet paid', 'Include accrued salaries, interest, and taxes'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Notes Payable', true, 'Short-term promissory notes', 'Include bank loans and other short-term debt'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Unearned Revenue', true, 'Revenue received but not yet earned', 'Include advance payments and deposits'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Taxes Payable', true, 'Taxes owed to government agencies', 'Include income tax, VAT, and other taxes'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 1), 'Other Current Liabilities', true, 'Other obligations due within one year', 'Include other short-term liabilities'),

-- Noncurrent Liabilities types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 2), 'Long-Term Loans', true, 'Loans and debt due beyond one year', 'Include bank loans and other long-term debt'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 2), 'Lease Liabilities', true, 'Obligations under lease agreements', 'Include operating and finance lease liabilities'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 2), 'Retirement Obligations', true, 'Obligations for employee retirement benefits', 'Include pension and other retirement obligations'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 2) AND code = 2), 'Other Long-Term Liabilities', true, 'Other obligations due beyond one year', 'Include other long-term liabilities'),

-- Owner's Equity types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 3) AND code = 1), 'Owner''s Capital', true, 'Owner''s investment in the business', 'Include initial capital and additional contributions'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 3) AND code = 1), 'Owner''s Drawings', true, 'Owner''s withdrawals from the business', 'Include personal withdrawals and distributions'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 3) AND code = 1), 'Retained Earnings', true, 'Accumulated profits retained in the business', 'Include undistributed profits'),

-- Operating Revenue types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 4) AND code = 1), 'Sales Revenue', true, 'Revenue from sales of goods or services', 'Include gross sales revenue'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 4) AND code = 1), 'Service Revenue', true, 'Revenue from providing services', 'Include service fees and commissions'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 4) AND code = 1), 'Other Operating Revenue', true, 'Other revenue from operating activities', 'Include other operating income'),

-- Direct Costs types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 5) AND code = 1), 'Cost of Goods Sold', true, 'Direct costs of goods sold', 'Include materials, labor, and manufacturing overhead'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 5) AND code = 1), 'Direct Labor', true, 'Direct labor costs', 'Include wages and benefits for direct labor'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 5) AND code = 1), 'Direct Materials', true, 'Direct materials costs', 'Include raw materials and components'),

-- Selling Expenses types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 1), 'Personnel Costs', true, 'Personnel costs for selling activities', 'Include sales salaries and commissions'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 1), 'Marketing & Promotion', true, 'Marketing and promotional expenses', 'Include advertising, promotions, and marketing materials'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 1), 'Selling Operations', true, 'Other selling-related expenses', 'Include sales office expenses and selling supplies'),

-- General and Administrative Expenses types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Personnel Costs', true, 'Personnel costs for administrative activities', 'Include administrative salaries and benefits'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Rent Expense', true, 'Rent and lease expenses', 'Include office rent and equipment leases'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Utilities', true, 'Utility expenses', 'Include electricity, water, internet, and phone'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Repairs & Maintenance', true, 'Repairs and maintenance expenses', 'Include office repairs and equipment maintenance'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Office Supplies', true, 'Office supplies and materials', 'Include stationery, supplies, and office materials'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Insurance', true, 'Insurance expenses', 'Include business insurance premiums'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Professional Fees', true, 'Professional service fees', 'Include legal, accounting, and consulting fees'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Depreciation & Amortization', true, 'Depreciation and amortization expenses', 'Include depreciation of fixed assets and amortization of intangibles'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Permits, Licenses and Taxes', true, 'Permits, licenses, and tax expenses', 'Include business permits, licenses, and local taxes'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 6) AND code = 2), 'Miscellaneous Expenses', true, 'Other miscellaneous expenses', 'Include other general and administrative expenses'),

-- Other Income types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 1), 'Interest Income', true, 'Interest earned on investments and deposits', 'Include bank interest and investment interest'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 1), 'Dividend Income', true, 'Dividends received from investments', 'Include stock dividends and other dividend income'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 1), 'Rental Income', true, 'Income from rental properties', 'Include property rental income'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 1), 'Other Income', true, 'Other non-operating income', 'Include other miscellaneous income'),

-- Other Expenses types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 2), 'Interest Expense', true, 'Interest paid on loans and debt', 'Include bank interest and loan interest'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 2), 'Losses', true, 'Losses from non-operating activities', 'Include investment losses and other losses'),
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 7) AND code = 2), 'Other Expenses', true, 'Other non-operating expenses', 'Include other miscellaneous expenses'),

-- Current Income Tax types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 8) AND code = 1), 'Current Income Tax', true, 'Income tax expense for the current period', 'Include current year income tax provision'),

-- Deferred Income Tax types
((SELECT id FROM account_subclasses WHERE account_class_id = (SELECT id FROM account_classes WHERE code = 8) AND code = 2), 'Deferred Income Tax', true, 'Income tax expense for future periods', 'Include deferred tax assets and liabilities');

-- Insert Account Subtypes
INSERT INTO public.account_subtypes (account_type_id, name, is_system_defined, description, hint) VALUES
-- Cash and Cash Equivalents subtypes
((SELECT id FROM account_types WHERE name = 'Cash and Cash Equivalents'), 'Petty Cash Fund', true, 'Small amount of cash kept for minor expenses', 'Used for small, immediate expenses'),
((SELECT id FROM account_types WHERE name = 'Cash and Cash Equivalents'), 'Cash on Hand', true, 'Cash physically held by the business', 'Cash kept in the office or store'),
((SELECT id FROM account_types WHERE name = 'Cash and Cash Equivalents'), 'Cash in Bank', true, 'Cash held in bank accounts', 'Checking and savings account balances'),

-- Accounts Receivable subtypes
((SELECT id FROM account_types WHERE name = 'Accounts Receivable'), 'Receivable to Customers', true, 'Amounts owed by customers for goods/services sold', 'Trade receivables from customers'),
((SELECT id FROM account_types WHERE name = 'Accounts Receivable'), 'Advances to Suppliers', true, 'Advance payments made to suppliers', 'Prepayments to suppliers for future goods/services'),
((SELECT id FROM account_types WHERE name = 'Accounts Receivable'), 'Advances to Employees', true, 'Advance payments made to employees', 'Salary advances and other employee advances'),

-- Inventory subtypes
((SELECT id FROM account_types WHERE name = 'Inventory'), 'Inventory', true, 'Goods held for sale or materials for production', 'Include finished goods, work in progress, and raw materials'),

-- Prepaid Expenses subtypes
((SELECT id FROM account_types WHERE name = 'Prepaid Expenses'), 'Prepaid Expenses', true, 'Expenses paid in advance', 'Include prepaid rent, insurance, and supplies'),

-- Marketable Securities subtypes
((SELECT id FROM account_types WHERE name = 'Marketable Securities'), 'Marketable Securities', true, 'Short-term investments in securities', 'Include stocks and bonds held for short-term trading'),

-- Other Current Assets subtypes
((SELECT id FROM account_types WHERE name = 'Other Current Assets'), 'Other Current Assets', true, 'Other assets expected to be converted to cash within one year', 'Include deposits, advances, and other current assets'),

-- Property, Plant & Equipment subtypes
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Furniture and Fixtures', true, 'Office furniture and fixtures', 'Include desks, chairs, and office fixtures'),
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Office Equipment', true, 'Office equipment and machinery', 'Include computers, printers, and office machinery'),
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Motor Vehicles', true, 'Company vehicles', 'Include cars, trucks, and other vehicles'),
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Land', true, 'Real estate land owned by the business', 'Include land and land improvements'),
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Buildings', true, 'Buildings owned by the business', 'Include office buildings and warehouses'),
((SELECT id FROM account_types WHERE name = 'Property, Plant & Equipment'), 'Improvements', true, 'Improvements to buildings and land', 'Include building improvements and land improvements'),

-- Accumulated Depreciation subtypes
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Furniture and Fixtures', true, 'Accumulated depreciation for furniture and fixtures', 'Contra-asset account reducing furniture and fixtures'),
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Office Equipment', true, 'Accumulated depreciation for office equipment', 'Contra-asset account reducing office equipment'),
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Motor Vehicles', true, 'Accumulated depreciation for motor vehicles', 'Contra-asset account reducing motor vehicles'),
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Land', true, 'Accumulated depreciation for land', 'Contra-asset account reducing land'),
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Buildings', true, 'Accumulated depreciation for buildings', 'Contra-asset account reducing buildings'),
((SELECT id FROM account_types WHERE name = 'Accumulated Depreciation'), 'Accum. Dep - Improvements', true, 'Accumulated depreciation for improvements', 'Contra-asset account reducing improvements'),

-- Intangible Assets subtypes
((SELECT id FROM account_types WHERE name = 'Intangible Assets'), 'Intangible Assets', true, 'Non-physical assets with value', 'Include patents, trademarks, and goodwill'),

-- Long-Term Investments subtypes
((SELECT id FROM account_types WHERE name = 'Long-Term Investments'), 'Long-Term Investments', true, 'Investments held for more than one year', 'Include stocks, bonds, and other long-term investments'),

-- Other Non-Current Assets subtypes
((SELECT id FROM account_types WHERE name = 'Other Non-Current Assets'), 'Other Non-Current Assets', true, 'Other assets not expected to be converted to cash within one year', 'Include deferred charges and other long-term assets'),

-- Accounts Payable subtypes
((SELECT id FROM account_types WHERE name = 'Accounts Payable'), 'Payable to Suppliers', true, 'Amounts owed to suppliers and vendors', 'Trade payables to suppliers'),
((SELECT id FROM account_types WHERE name = 'Accounts Payable'), 'Advances from Customers', true, 'Advance payments received from customers', 'Prepayments from customers for future goods/services'),

-- Accrued Expenses subtypes
((SELECT id FROM account_types WHERE name = 'Accrued Expenses'), 'Accrued Expenses', true, 'Expenses incurred but not yet paid', 'Include accrued salaries, interest, and taxes'),

-- Notes Payable subtypes
((SELECT id FROM account_types WHERE name = 'Notes Payable'), 'Notes Payable', true, 'Short-term promissory notes', 'Include bank loans and other short-term debt'),

-- Unearned Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Unearned Revenue'), 'Unearned Revenue', true, 'Revenue received but not yet earned', 'Include advance payments and deposits'),

-- Taxes Payable subtypes
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'SSS Payable', true, 'Social Security System contributions payable', 'SSS contributions for employees'),
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'HDMF Payable', true, 'Home Development Mutual Fund contributions payable', 'Pag-IBIG contributions for employees'),
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'PHIC Payable', true, 'Philippine Health Insurance Corporation contributions payable', 'PhilHealth contributions for employees'),
((SELECT id FROM account_types WHERE name = 'Taxes Payable'), 'Income Tax Payable', true, 'Income tax owed to government', 'Income tax payable to BIR'),

-- Other Current Liabilities subtypes
((SELECT id FROM account_types WHERE name = 'Other Current Liabilities'), 'Other Current Liabilities', true, 'Other obligations due within one year', 'Include other short-term liabilities'),

-- Long-Term Loans subtypes
((SELECT id FROM account_types WHERE name = 'Long-Term Loans'), 'Long-Term Loans', true, 'Loans and debt due beyond one year', 'Include bank loans and other long-term debt'),

-- Lease Liabilities subtypes
((SELECT id FROM account_types WHERE name = 'Lease Liabilities'), 'Lease Liabilities', true, 'Obligations under lease agreements', 'Include operating and finance lease liabilities'),

-- Retirement Obligations subtypes
((SELECT id FROM account_types WHERE name = 'Retirement Obligations'), 'Retirement Obligations', true, 'Obligations for employee retirement benefits', 'Include pension and other retirement obligations'),

-- Other Long-Term Liabilities subtypes
((SELECT id FROM account_types WHERE name = 'Other Long-Term Liabilities'), 'Other Long-Term Liabilities', true, 'Other obligations due beyond one year', 'Include other long-term liabilities'),

-- Owner's Capital subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Capital'), 'Owner''s Capital', true, 'Owner''s investment in the business', 'Include initial capital and additional contributions'),

-- Owner's Drawings subtypes
((SELECT id FROM account_types WHERE name = 'Owner''s Drawings'), 'Owner''s Drawings', true, 'Owner''s withdrawals from the business', 'Include personal withdrawals and distributions'),

-- Retained Earnings subtypes
((SELECT id FROM account_types WHERE name = 'Retained Earnings'), 'Retained Earnings', true, 'Accumulated profits retained in the business', 'Include undistributed profits'),

-- Sales Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Sales Revenue'), 'Sales Revenue', true, 'Revenue from sales of goods or services', 'Include gross sales revenue'),

-- Service Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Service Revenue'), 'Service Revenue', true, 'Revenue from providing services', 'Include service fees and commissions'),

-- Other Operating Revenue subtypes
((SELECT id FROM account_types WHERE name = 'Other Operating Revenue'), 'Other Operating Revenue', true, 'Other revenue from operating activities', 'Include other operating income'),

-- Cost of Goods Sold subtypes
((SELECT id FROM account_types WHERE name = 'Cost of Goods Sold'), 'Cost of Goods Sold', true, 'Direct costs of goods sold', 'Include materials, labor, and manufacturing overhead'),

-- Direct Labor subtypes
((SELECT id FROM account_types WHERE name = 'Direct Labor'), 'Direct Labor', true, 'Direct labor costs', 'Include wages and benefits for direct labor'),

-- Direct Materials subtypes
((SELECT id FROM account_types WHERE name = 'Direct Materials'), 'Direct Materials', true, 'Direct materials costs', 'Include raw materials and components'),

-- Selling Expenses - Personnel Costs subtypes
((SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'Selling Expenses')), 'Personnel Costs', true, 'Personnel costs for selling activities', 'Include sales salaries and commissions'),

-- Selling Expenses - Marketing & Promotion subtypes
((SELECT id FROM account_types WHERE name = 'Marketing & Promotion'), 'Marketing & Promotion', true, 'Marketing and promotional expenses', 'Include advertising, promotions, and marketing materials'),

-- Selling Expenses - Selling Operations subtypes
((SELECT id FROM account_types WHERE name = 'Selling Operations'), 'Selling Operations', true, 'Other selling-related expenses', 'Include sales office expenses and selling supplies'),

-- General and Administrative Expenses - Personnel Costs subtypes
((SELECT id FROM account_types WHERE name = 'Personnel Costs' AND account_subclass_id = (SELECT id FROM account_subclasses WHERE name = 'General and Administrative Expenses')), 'Personnel Costs', true, 'Personnel costs for administrative activities', 'Include administrative salaries and benefits'),

-- General and Administrative Expenses - Rent Expense subtypes
((SELECT id FROM account_types WHERE name = 'Rent Expense'), 'Rent Expense', true, 'Rent and lease expenses', 'Include office rent and equipment leases'),

-- General and Administrative Expenses - Utilities subtypes
((SELECT id FROM account_types WHERE name = 'Utilities'), 'Utilities (electricity, water, internet, phone)', true, 'Utility expenses', 'Include electricity, water, internet, and phone'),

-- General and Administrative Expenses - Repairs & Maintenance subtypes
((SELECT id FROM account_types WHERE name = 'Repairs & Maintenance'), 'Repairs & Maintenance (office-related)', true, 'Repairs and maintenance expenses', 'Include office repairs and equipment maintenance'),

-- General and Administrative Expenses - Office Supplies subtypes
((SELECT id FROM account_types WHERE name = 'Office Supplies'), 'Office Supplies', true, 'Office supplies and materials', 'Include stationery, supplies, and office materials'),

-- General and Administrative Expenses - Insurance subtypes
((SELECT id FROM account_types WHERE name = 'Insurance'), 'Insurance', true, 'Insurance expenses', 'Include business insurance premiums'),

-- General and Administrative Expenses - Professional Fees subtypes
((SELECT id FROM account_types WHERE name = 'Professional Fees'), 'Professional Fee', true, 'Professional service fees', 'Include legal, accounting, and consulting fees'),

-- General and Administrative Expenses - Depreciation & Amortization subtypes
((SELECT id FROM account_types WHERE name = 'Depreciation & Amortization'), 'Depreciation & Amortization', true, 'Depreciation and amortization expenses', 'Include depreciation of fixed assets and amortization of intangibles'),

-- General and Administrative Expenses - Permits, Licenses and Taxes subtypes
((SELECT id FROM account_types WHERE name = 'Permits, Licenses and Taxes'), 'Permits, Licenses and Taxes', true, 'Permits, licenses, and tax expenses', 'Include business permits, licenses, and local taxes'),

-- General and Administrative Expenses - Miscellaneous Expenses subtypes
((SELECT id FROM account_types WHERE name = 'Miscellaneous Expenses'), 'Miscellaneous Expenses', true, 'Other miscellaneous expenses', 'Include other general and administrative expenses'),

-- Other Income - Interest Income subtypes
((SELECT id FROM account_types WHERE name = 'Interest Income'), 'Interest Income', true, 'Interest earned on investments and deposits', 'Include bank interest and investment interest'),

-- Other Income - Dividend Income subtypes
((SELECT id FROM account_types WHERE name = 'Dividend Income'), 'Dividend Income', true, 'Dividends received from investments', 'Include stock dividends and other dividend income'),

-- Other Income - Rental Income subtypes
((SELECT id FROM account_types WHERE name = 'Rental Income'), 'Rental Income', true, 'Income from rental properties', 'Include property rental income'),

-- Other Income - Other Income subtypes
((SELECT id FROM account_types WHERE name = 'Other Income'), 'Other Income', true, 'Other non-operating income', 'Include other miscellaneous income'),

-- Other Expenses - Interest Expense subtypes
((SELECT id FROM account_types WHERE name = 'Interest Expense'), 'Interest Expense', true, 'Interest paid on loans and debt', 'Include bank interest and loan interest'),

-- Other Expenses - Losses subtypes
((SELECT id FROM account_types WHERE name = 'Losses'), 'Losses', true, 'Losses from non-operating activities', 'Include investment losses and other losses'),

-- Other Expenses - Other Expenses subtypes
((SELECT id FROM account_types WHERE name = 'Other Expenses'), 'Other Expenses', true, 'Other non-operating expenses', 'Include other miscellaneous expenses'),

-- Current Income Tax subtypes
((SELECT id FROM account_types WHERE name = 'Current Income Tax'), 'Current Income Tax', true, 'Income tax expense for the current period', 'Include current year income tax provision'),

-- Deferred Income Tax subtypes
((SELECT id FROM account_types WHERE name = 'Deferred Income Tax'), 'Deferred Income Tax', true, 'Income tax expense for future periods', 'Include deferred tax assets and liabilities');
