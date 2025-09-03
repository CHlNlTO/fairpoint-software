-- Migration: 007_create_chart_of_accounts_templates_table.sql
-- Description: Create chart_of_accounts_templates table for default COA structures
-- Date: 2024-01-01

-- Create enum for account types
CREATE TYPE account_type AS ENUM (
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense'
);

-- Create enum for account categories
CREATE TYPE account_category AS ENUM (
  'current_assets',
  'fixed_assets',
  'current_liabilities',
  'long_term_liabilities',
  'owner_equity',
  'operating_revenue',
  'operating_expenses',
  'non_operating_items'
);

-- Create chart_of_accounts_templates table
CREATE TABLE public.chart_of_accounts_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  business_structure business_structure NOT NULL,
  business_types business_type[] NOT NULL DEFAULT '{}',
  
  -- Template metadata
  description text,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT chart_of_accounts_templates_pkey PRIMARY KEY (id),
  CONSTRAINT chart_of_accounts_templates_name_unique UNIQUE (template_name),
  CONSTRAINT chart_of_accounts_templates_business_types_not_empty CHECK (array_length(business_types, 1) > 0)
);

-- Create chart_of_accounts_template_items table
CREATE TABLE public.chart_of_accounts_template_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  
  -- Account structure
  account_code text NOT NULL,
  account_name text NOT NULL,
  account_type account_type NOT NULL,
  account_category account_category NOT NULL,
  parent_account_id uuid,
  
  -- Account properties
  is_active boolean NOT NULL DEFAULT true,
  is_contra_account boolean NOT NULL DEFAULT false,
  normal_balance text NOT NULL DEFAULT 'debit', -- 'debit' or 'credit'
  
  -- Ordering and hierarchy
  sort_order integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT chart_of_accounts_template_items_pkey PRIMARY KEY (id),
  CONSTRAINT chart_of_accounts_template_items_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.chart_of_accounts_templates(id) ON DELETE CASCADE,
  CONSTRAINT chart_of_accounts_template_items_parent_id_fkey FOREIGN KEY (parent_account_id) REFERENCES public.chart_of_accounts_template_items(id) ON DELETE CASCADE,
  
  -- Business constraints
  CONSTRAINT chart_of_accounts_template_items_account_code_format CHECK (account_code ~ '^[0-9]{1,4}(\.[0-9]{1,4})*$'),
  CONSTRAINT chart_of_accounts_template_items_account_name_length CHECK (char_length(account_name) <= 200),
  CONSTRAINT chart_of_accounts_template_items_normal_balance_check CHECK (normal_balance IN ('debit', 'credit')),
  CONSTRAINT chart_of_accounts_template_items_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT chart_of_accounts_template_items_level_check CHECK (level >= 1)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_coa_templates_business_structure ON public.chart_of_accounts_templates (business_structure);
CREATE INDEX idx_coa_templates_business_types ON public.chart_of_accounts_templates USING GIN (business_types);
CREATE INDEX idx_coa_templates_active ON public.chart_of_accounts_templates (is_active);

CREATE INDEX idx_coa_template_items_template_id ON public.chart_of_accounts_template_items (template_id);
CREATE INDEX idx_coa_template_items_parent_id ON public.chart_of_accounts_template_items (parent_account_id);
CREATE INDEX idx_coa_template_items_account_code ON public.chart_of_accounts_template_items (account_code);
CREATE INDEX idx_coa_template_items_sort_order ON public.chart_of_accounts_template_items (template_id, sort_order);

-- Add comments
COMMENT ON TABLE public.chart_of_accounts_templates IS 'Default Chart of Accounts templates for different business types and structures';
COMMENT ON TABLE public.chart_of_accounts_template_items IS 'Individual accounts within COA templates';
COMMENT ON COLUMN public.chart_of_accounts_template_items.account_code IS 'Hierarchical account code (e.g., 1000, 1100.01)';
COMMENT ON COLUMN public.chart_of_accounts_template_items.normal_balance IS 'Normal balance side for this account type';
COMMENT ON COLUMN public.chart_of_accounts_template_items.sort_order IS 'Order of display within the template';
COMMENT ON COLUMN public.chart_of_accounts_template_items.level IS 'Hierarchy level (1 = top level, 2 = sub-account, etc.)';
