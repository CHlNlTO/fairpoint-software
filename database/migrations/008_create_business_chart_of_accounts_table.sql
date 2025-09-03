-- Migration: 008_create_business_chart_of_accounts_table.sql
-- Description: Create business_chart_of_accounts table for actual COA per business
-- Date: 2024-01-01

-- Create business_chart_of_accounts table
CREATE TABLE public.business_chart_of_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_registration_id uuid NOT NULL,
  
  -- Account structure
  account_code text NOT NULL,
  account_name text NOT NULL,
  account_type account_type NOT NULL,
  account_category account_category NOT NULL,
  parent_account_id uuid,
  
  -- Account properties
  is_active boolean NOT NULL DEFAULT true,
  is_contra_account boolean NOT NULL DEFAULT false,
  normal_balance text NOT NULL DEFAULT 'debit',
  
  -- Source information
  source_template_id uuid,
  source_template_item_id uuid,
  is_custom boolean NOT NULL DEFAULT false,
  
  -- Ordering and hierarchy
  sort_order integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  
  -- Business-specific metadata
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT business_chart_of_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT business_chart_of_accounts_business_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,
  CONSTRAINT business_chart_of_accounts_parent_id_fkey FOREIGN KEY (parent_account_id) REFERENCES public.business_chart_of_accounts(id) ON DELETE CASCADE,
  CONSTRAINT business_chart_of_accounts_template_id_fkey FOREIGN KEY (source_template_id) REFERENCES public.chart_of_accounts_templates(id),
  CONSTRAINT business_chart_of_accounts_template_item_id_fkey FOREIGN KEY (source_template_item_id) REFERENCES public.chart_of_accounts_template_items(id),
  
  -- Business constraints
  CONSTRAINT business_chart_of_accounts_account_code_format CHECK (account_code ~ '^[0-9]{1,4}(\.[0-9]{1,4})*$'),
  CONSTRAINT business_chart_of_accounts_account_name_length CHECK (char_length(account_name) <= 200),
  CONSTRAINT business_chart_of_accounts_normal_balance_check CHECK (normal_balance IN ('debit', 'credit')),
  CONSTRAINT business_chart_of_accounts_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT business_chart_of_accounts_level_check CHECK (level >= 1),
  CONSTRAINT business_chart_of_accounts_notes_length CHECK (char_length(notes) <= 1000),
  
  -- Ensure unique account codes within a business
  CONSTRAINT business_chart_of_accounts_unique_code_per_business UNIQUE (business_registration_id, account_code)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_business_coa_business_id ON public.business_chart_of_accounts (business_registration_id);
CREATE INDEX idx_business_coa_parent_id ON public.business_chart_of_accounts (parent_account_id);
CREATE INDEX idx_business_coa_account_code ON public.business_chart_of_accounts (account_code);
CREATE INDEX idx_business_coa_sort_order ON public.business_chart_of_accounts (business_registration_id, sort_order);
CREATE INDEX idx_business_coa_template_source ON public.business_chart_of_accounts (source_template_id, source_template_item_id);
CREATE INDEX idx_business_coa_active ON public.business_chart_of_accounts (is_active);

-- Add comments
COMMENT ON TABLE public.business_chart_of_accounts IS 'Actual Chart of Accounts for each business';
COMMENT ON COLUMN public.business_chart_of_accounts.source_template_id IS 'Reference to the template this account was based on (if any)';
COMMENT ON COLUMN public.business_chart_of_accounts.source_template_item_id IS 'Reference to the specific template item (if any)';
COMMENT ON COLUMN public.business_chart_of_accounts.is_custom IS 'Whether this account was custom-created or came from a template';
COMMENT ON COLUMN public.business_chart_of_accounts.notes IS 'Business-specific notes about this account';
