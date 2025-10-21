-- Migration: 041_create_specialized_coa_template_items.sql
-- Description: Create COA template items for specialized templates based on tax types, business structures, and industry types
-- Date: 2024-01-01

-- Insert all COA template items using a single statement with CTEs
WITH account_type_ids AS (
  SELECT id, name
  FROM public.account_types
  WHERE is_system_defined = true
),
account_subtype_ids AS (
  SELECT s.id, s.name, t.name AS type_name
  FROM public.account_subtypes s
  JOIN account_type_ids t ON s.account_type_id = t.id
  WHERE s.is_system_defined = true
)

INSERT INTO public.coa_template_items (
  template_id,
  account_code,
  account_name,
  account_subtype_id,
  sort_order
)

-- VAT Tax Template Items
SELECT
  'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid,
  '110401',
  'Input VAT',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Input VAT' AND s.type_name = 'Prepaid Expenses'

UNION ALL

SELECT
  'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid,
  '210505',
  'Output VAT',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Output VAT' AND s.type_name = 'Taxes Payable'

UNION ALL

-- Withholding Tax Template Items
SELECT
  'b2c3d4e5-f6a7-8901-2345-678901bcdefa'::uuid,
  '210506',
  'WHTax on Compensation',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'WHTax on Compensation' AND s.type_name = 'Taxes Payable'

UNION ALL

-- TAMP Template Items
SELECT
  'c3d4e5f6-a7b8-9012-3456-789012cdefab'::uuid,
  '210507',
  'Expanded WHTax',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Expanded WHTax' AND s.type_name = 'Taxes Payable'

UNION ALL

-- Freelancing Template Items
SELECT
  'd4e5f6a7-b8c9-0123-4567-890123defabc'::uuid,
  '310101',
  'Owner''s Capital',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Owner''s Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'd4e5f6a7-b8c9-0123-4567-890123defabc'::uuid,
  '310201',
  'Additional Contributions',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Additional Contributions' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'd4e5f6a7-b8c9-0123-4567-890123defabc'::uuid,
  '310301',
  'Owner''s Drawings',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Owner''s Drawings' AND s.type_name = 'Owner''s Drawings'

UNION ALL

SELECT
  'd4e5f6a7-b8c9-0123-4567-890123defabc'::uuid,
  '320101',
  'Income Summary',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Income Summary' AND s.type_name = 'Owner''s Capital'

UNION ALL

-- Sole Proprietorship Template Items
SELECT
  'e5f6a7b8-c9d0-1234-5678-901234efabcd'::uuid,
  '311101',
  'Owner''s Capital',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Owner''s Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'e5f6a7b8-c9d0-1234-5678-901234efabcd'::uuid,
  '311201',
  'Additional Contributions',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Additional Contributions' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'e5f6a7b8-c9d0-1234-5678-901234efabcd'::uuid,
  '311301',
  'Owner''s Drawings',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Owner''s Drawings' AND s.type_name = 'Owner''s Drawings'

UNION ALL

SELECT
  'e5f6a7b8-c9d0-1234-5678-901234efabcd'::uuid,
  '321101',
  'Income Summary',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Income Summary' AND s.type_name = 'Owner''s Capital'

UNION ALL

-- Partnership Template Items
SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '310101',
  'Income Summary',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Income Summary' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320101',
  'Partner A Initial Capital',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Partner A Initial Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320102',
  'Partner A Additional Contributions',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Partner A Additional Contributions' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320103',
  'Partner A Withdrawals',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Partner A Withdrawals' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320104',
  'Partner A Share of Profits',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Partner A Share of Profits' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320201',
  'Partner B Initial Capital',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Partner B Initial Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320202',
  'Partner B Additional Contributions',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Partner B Additional Contributions' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320203',
  'Partner B Withdrawals',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Partner B Withdrawals' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320204',
  'Partner B Share of Profits',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Partner B Share of Profits' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320301',
  'Partner C Initial Capital',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'Partner C Initial Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320302',
  'Partner C Additional Contributions',
  s.id,
  11
FROM account_subtype_ids s
WHERE s.name = 'Partner C Additional Contributions' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320303',
  'Partner C Withdrawals',
  s.id,
  12
FROM account_subtype_ids s
WHERE s.name = 'Partner C Withdrawals' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'f6a7b8c9-d0e1-2345-6789-012345fabcde'::uuid,
  '320304',
  'Partner C Share of Profits',
  s.id,
  13
FROM account_subtype_ids s
WHERE s.name = 'Partner C Share of Profits' AND s.type_name = 'Owner''s Capital'

UNION ALL

-- Corporation Template Items
SELECT
  'a7b8c9d0-e1f2-3456-7890-123456abcdef'::uuid,
  '310101',
  'Common Shares',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Common Shares' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'a7b8c9d0-e1f2-3456-7890-123456abcdef'::uuid,
  '310202',
  'Preferred Shares',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Preferred Shares' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'a7b8c9d0-e1f2-3456-7890-123456abcdef'::uuid,
  '310303',
  'Additional Paid-in Capital',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Additional Paid-in Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'a7b8c9d0-e1f2-3456-7890-123456abcdef'::uuid,
  '320101',
  'Retained Earnings',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Retained Earnings' AND s.type_name = 'Retained Earnings'

UNION ALL

SELECT
  'a7b8c9d0-e1f2-3456-7890-123456abcdef'::uuid,
  '330101',
  'Treasury Shares',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Treasury Shares' AND s.type_name = 'Treasury Shares'

UNION ALL

-- Cooperative Template Items
SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310101',
  'Subscribed Common Capital',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Subscribed Common Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310102',
  'Subscription Receivable - Common',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Subscription Receivable - Common' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310103',
  'Paid Up Common Capital',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Paid Up Common Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310104',
  'Treasury Shares - Common',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Treasury Shares - Common' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310201',
  'Preferred Shares',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Preferred Shares' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310202',
  'Subscription Receivable - Preferred',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Subscription Receivable - Preferred' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310203',
  'Paid Up Preferred Capital',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Paid Up Preferred Capital' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '310204',
  'Treasury Shares - Preferred',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Treasury Shares - Preferred' AND s.type_name = 'Owner''s Capital'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '320101',
  'Education and Training Fund',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Education and Training Fund' AND s.type_name = 'Statutory Funds'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '320102',
  'General Reserve Fund',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'General Reserve Fund' AND s.type_name = 'Statutory Funds'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '320103',
  'Optional Fund',
  s.id,
  11
FROM account_subtype_ids s
WHERE s.name = 'Optional Fund' AND s.type_name = 'Statutory Funds'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '320104',
  'Community and Development Fund',
  s.id,
  12
FROM account_subtype_ids s
WHERE s.name = 'Community and Development Fund' AND s.type_name = 'Statutory Funds'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '330101',
  'Undivided Net Surplus',
  s.id,
  13
FROM account_subtype_ids s
WHERE s.name = 'Undivided Net Surplus' AND s.type_name = 'Undivided Net Surplus'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '340101',
  'Restricted Capital for Surety',
  s.id,
  14
FROM account_subtype_ids s
WHERE s.name = 'Restricted Capital for Surety' AND s.type_name = 'Restricted Capital for Surety'

UNION ALL

SELECT
  'b8c9d0e1-f2a3-4567-8901-234567abcdef'::uuid,
  '350101',
  'Donation and Grants',
  s.id,
  15
FROM account_subtype_ids s
WHERE s.name = 'Donation and Grants' AND s.type_name = 'Donation and Grants'

UNION ALL

-- Services Industry Template Items
SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '410101',
  'Professional Fees',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Professional Fees' AND s.type_name = 'Service Revenue'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '410102',
  'Consulting Income',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Consulting Income' AND s.type_name = 'Service Revenue'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '410103',
  'Project Fees',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Project Fees' AND s.type_name = 'Service Revenue'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '410104',
  'Retainer Income',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Retainer Income' AND s.type_name = 'Service Revenue'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '400000',
  'Other Revenue',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Other Revenue' AND s.type_name = 'Other Operating Revenue'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '511101',
  'Salaries and Wages',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Salaries and Wages' AND s.type_name = 'Direct Labor'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '511201',
  'Supplies Expense',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Direct Materials'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '521101',
  'Subcontracting Costs',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Subcontracting Costs' AND s.type_name = 'Indirect Labor'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '521201',
  'Supplies Expense',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Indirect Materials'

UNION ALL

SELECT
  'c9d0e1f2-a3b4-5678-9012-345678abcdef'::uuid,
  '521301',
  'Other Overhead Cost',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'Other Overhead Cost' AND s.type_name = 'Other Overhead Cost'

UNION ALL

-- Retail Industry Template Items
SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '410101',
  'In-store Sales',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'In-store Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '410102',
  'Online Sales',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Online Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '410201',
  'Sales Discount',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Sales Discount' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '410202',
  'Sales Allowance',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Sales Allowance' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '410203',
  'Sales Returns',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Sales Returns' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '400000',
  'Other Revenue',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Other Revenue' AND s.type_name = 'Other Operating Revenue'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '512101',
  'Salaries and Wages',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Salaries and Wages' AND s.type_name = 'Direct Labor'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '512201',
  'Supplies Expense',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Direct Materials'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '522101',
  'Subcontracting Costs',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Subcontracting Costs' AND s.type_name = 'Indirect Labor'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '522201',
  'Supplies Expense',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Indirect Materials'

UNION ALL

SELECT
  'd0e1f2a3-b4c5-6789-0123-456789abcdef'::uuid,
  '522301',
  'Other Overhead Cost',
  s.id,
  11
FROM account_subtype_ids s
WHERE s.name = 'Other Overhead Cost' AND s.type_name = 'Other Overhead Cost'

UNION ALL

-- Manufacturing Industry Template Items
SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '110301',
  'Raw Materials Purchases',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'Raw Materials Purchases' AND s.type_name = 'Inventories'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '110302',
  'Work-in-progress',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Work-in-progress' AND s.type_name = 'Inventories'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '110303',
  'Finished Goods',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Finished Goods' AND s.type_name = 'Inventories'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '410101',
  'Finished Goods Sales',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'In-store Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '410102',
  'By-product Sales',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Online Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '410201',
  'Sales Discount',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Sales Discount' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '410202',
  'Sales Allowance',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Sales Allowance' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '410203',
  'Sales Returns',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Sales Returns' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '513101',
  'Salaries and Wages',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Salaries and Wages' AND s.type_name = 'Direct Labor'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '513201',
  'Finished Goods Sold',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'Finished Goods Sold' AND s.type_name = 'Direct Materials'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '513301',
  'Production Workers',
  s.id,
  11
FROM account_subtype_ids s
WHERE s.name = 'Production Workers' AND s.type_name = 'Direct Labor'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523101',
  'Subcontracting Costs',
  s.id,
  12
FROM account_subtype_ids s
WHERE s.name = 'Subcontracting Costs' AND s.type_name = 'Manufacturing Overhead Cost'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523201',
  'Packaging Materials',
  s.id,
  13
FROM account_subtype_ids s
WHERE s.name = 'Packaging Materials' AND s.type_name = 'Manufacturing Overhead Cost'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523301',
  'Factory Supplies',
  s.id,
  14
FROM account_subtype_ids s
WHERE s.name = 'Factory Supplies' AND s.type_name = 'Manufacturing Overhead Cost'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523401',
  'Small Tools',
  s.id,
  15
FROM account_subtype_ids s
WHERE s.name = 'Small Tools' AND s.type_name = 'Manufacturing Overhead Cost'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523501',
  'Repairs & Maintenance – Factory',
  s.id,
  16
FROM account_subtype_ids s
WHERE s.name = 'Repairs & Maintenance – Factory' AND s.type_name = 'Repairs & Maintenance'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523601',
  'Depreciation expense',
  s.id,
  17
FROM account_subtype_ids s
WHERE s.name = 'Depreciation expense' AND s.type_name = 'Depreciation & Amortization'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523701',
  'Other Factory Costs',
  s.id,
  18
FROM account_subtype_ids s
WHERE s.name = 'Other Factory Costs' AND s.type_name = 'Manufacturing Overhead Cost'

UNION ALL

SELECT
  'e1f2a3b4-c5d6-7890-1234-567890abcdef'::uuid,
  '523801',
  'Inventories Adjustments',
  s.id,
  19
FROM account_subtype_ids s
WHERE s.name = 'Inventories Adjustments' AND s.type_name = 'Inventories Adjustments'

UNION ALL

-- Merchandising Industry Template Items
SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '410101',
  'In-store Sales',
  s.id,
  1
FROM account_subtype_ids s
WHERE s.name = 'In-store Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '410102',
  'Online Sales',
  s.id,
  2
FROM account_subtype_ids s
WHERE s.name = 'Online Sales' AND s.type_name = 'Sales Revenue'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '410201',
  'Sales Discount',
  s.id,
  3
FROM account_subtype_ids s
WHERE s.name = 'Sales Discount' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '410202',
  'Sales Allowance',
  s.id,
  4
FROM account_subtype_ids s
WHERE s.name = 'Sales Allowance' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '410203',
  'Sales Returns',
  s.id,
  5
FROM account_subtype_ids s
WHERE s.name = 'Sales Returns' AND s.type_name = 'Sales Discount and Allowances'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '400000',
  'Other Revenue',
  s.id,
  6
FROM account_subtype_ids s
WHERE s.name = 'Other Revenue' AND s.type_name = 'Other Operating Revenue'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '514101',
  'Salaries and Wages',
  s.id,
  7
FROM account_subtype_ids s
WHERE s.name = 'Salaries and Wages' AND s.type_name = 'Direct Labor'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '514201',
  'Supplies Expense',
  s.id,
  8
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Direct Materials'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '524101',
  'Subcontracting Costs',
  s.id,
  9
FROM account_subtype_ids s
WHERE s.name = 'Subcontracting Costs' AND s.type_name = 'Indirect Labor'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '524201',
  'Supplies Expense',
  s.id,
  10
FROM account_subtype_ids s
WHERE s.name = 'Supplies Expense' AND s.type_name = 'Indirect Materials'

UNION ALL

SELECT
  'f2a3b4c5-d6e7-8901-2345-678901abcdef'::uuid,
  '524301',
  'Other Overhead Cost',
  s.id,
  11
FROM account_subtype_ids s
WHERE s.name = 'Other Overhead Cost' AND s.type_name = 'Other Overhead Cost'

ON CONFLICT (template_id, account_code)
DO NOTHING;

-- Add comments
COMMENT ON TABLE public.coa_template_items IS 'Specialized COA template items for tax types, business structures, and industry types';