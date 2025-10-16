-- Migration: 020_drop_old_chart_of_accounts_tables.sql
-- Description: Drop existing chart of accounts tables and types to replace with new structure
-- Date: 2024-01-01

-- Drop policies (do this before dropping the tables they belong to)
DROP POLICY IF EXISTS "Users can view own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can insert own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can update own chart of accounts" ON public.business_chart_of_accounts;
DROP POLICY IF EXISTS "Users can delete own chart of accounts" ON public.business_chart_of_accounts;

DROP POLICY IF EXISTS "Anyone can view COA templates" ON public.chart_of_accounts_templates;
DROP POLICY IF EXISTS "Authenticated users can view COA templates" ON public.chart_of_accounts_templates;
DROP POLICY IF EXISTS "No modifications to COA templates" ON public.chart_of_accounts_templates;

DROP POLICY IF EXISTS "Anyone can view COA template items" ON public.chart_of_accounts_template_items;
DROP POLICY IF EXISTS "Authenticated users can view COA template items" ON public.chart_of_accounts_template_items;
DROP POLICY IF EXISTS "No modifications to COA template items" ON public.chart_of_accounts_template_items;

-- Drop existing chart of accounts tables and related objects
DROP TABLE IF EXISTS public.business_chart_of_accounts CASCADE;
DROP TABLE IF EXISTS public.chart_of_accounts_template_items CASCADE;
DROP TABLE IF EXISTS public.chart_of_accounts_templates CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS public.account_type CASCADE;
DROP TYPE IF EXISTS public.account_category CASCADE;