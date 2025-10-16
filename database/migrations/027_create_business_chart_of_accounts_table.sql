-- Migration: 027_create_business_chart_of_accounts_table.sql
-- Description: Create business_chart_of_accounts table for actual COA per business
-- Date: 2024-01-01

-- Create business_chart_of_accounts table
CREATE TABLE public.business_chart_of_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_registration_id uuid NOT NULL,
  account_code char(6) NOT NULL,
  account_name text NOT NULL,
  account_subtype_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_custom boolean NOT NULL DEFAULT false,
  source_template_id uuid,
  source_template_item_id uuid,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT business_chart_of_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT business_chart_of_accounts_business_registration_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,
  CONSTRAINT business_chart_of_accounts_account_subtype_id_fkey FOREIGN KEY (account_subtype_id) REFERENCES public.account_subtypes(id),
  CONSTRAINT business_chart_of_accounts_source_template_id_fkey FOREIGN KEY (source_template_id) REFERENCES public.coa_templates(id),
  CONSTRAINT business_chart_of_accounts_source_template_item_id_fkey FOREIGN KEY (source_template_item_id) REFERENCES public.coa_template_items(id),
  CONSTRAINT business_chart_of_accounts_account_code_format CHECK (account_code ~ '^[0-9]{6}$'),
  CONSTRAINT business_chart_of_accounts_account_name_length CHECK (char_length(account_name) <= 200),
  CONSTRAINT business_chart_of_accounts_notes_length CHECK (char_length(notes) <= 1000),
  CONSTRAINT business_chart_of_accounts_unique_code_per_business UNIQUE (business_registration_id, account_code)
);

-- Create indexes
CREATE INDEX idx_business_chart_of_accounts_business_id ON public.business_chart_of_accounts (business_registration_id);
CREATE INDEX idx_business_chart_of_accounts_account_subtype_id ON public.business_chart_of_accounts (account_subtype_id);
CREATE INDEX idx_business_chart_of_accounts_account_code ON public.business_chart_of_accounts (account_code);
CREATE INDEX idx_business_chart_of_accounts_source_template ON public.business_chart_of_accounts (source_template_id, source_template_item_id);
CREATE INDEX idx_business_chart_of_accounts_active ON public.business_chart_of_accounts (is_active);

-- Add comments
COMMENT ON TABLE public.business_chart_of_accounts IS 'Actual Chart of Accounts for each business';
COMMENT ON COLUMN public.business_chart_of_accounts.business_registration_id IS 'Reference to the business registration';
COMMENT ON COLUMN public.business_chart_of_accounts.account_code IS '6-digit account code';
COMMENT ON COLUMN public.business_chart_of_accounts.account_name IS 'Display name of the account';
COMMENT ON COLUMN public.business_chart_of_accounts.account_subtype_id IS 'Reference to the account subtype';
COMMENT ON COLUMN public.business_chart_of_accounts.is_active IS 'Whether this account is active';
COMMENT ON COLUMN public.business_chart_of_accounts.is_custom IS 'Whether this account was custom-created or came from a template';
COMMENT ON COLUMN public.business_chart_of_accounts.source_template_id IS 'Reference to the template this account was based on (if any)';
COMMENT ON COLUMN public.business_chart_of_accounts.source_template_item_id IS 'Reference to the specific template item (if any)';
COMMENT ON COLUMN public.business_chart_of_accounts.notes IS 'Business-specific notes about this account';
