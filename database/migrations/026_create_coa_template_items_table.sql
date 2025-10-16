-- Migration: 026_create_coa_template_items_table.sql
-- Description: Create coa_template_items table for individual accounts within COA templates
-- Date: 2024-01-01

-- Create coa_template_items table
CREATE TABLE public.coa_template_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  account_code char(6) NOT NULL,
  account_name text NOT NULL,
  account_subtype_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT coa_template_items_pkey PRIMARY KEY (id),
  CONSTRAINT coa_template_items_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.coa_templates(id) ON DELETE CASCADE,
  CONSTRAINT coa_template_items_account_subtype_id_fkey FOREIGN KEY (account_subtype_id) REFERENCES public.account_subtypes(id),
  CONSTRAINT coa_template_items_account_code_format CHECK (account_code ~ '^[0-9]{6}$'),
  CONSTRAINT coa_template_items_account_name_length CHECK (char_length(account_name) <= 200),
  CONSTRAINT coa_template_items_sort_order_check CHECK (sort_order >= 0),
  CONSTRAINT coa_template_items_unique_code_per_template UNIQUE (template_id, account_code)
);

-- Create indexes
CREATE INDEX idx_coa_template_items_template_id ON public.coa_template_items (template_id);
CREATE INDEX idx_coa_template_items_account_subtype_id ON public.coa_template_items (account_subtype_id);
CREATE INDEX idx_coa_template_items_account_code ON public.coa_template_items (account_code);
CREATE INDEX idx_coa_template_items_sort_order ON public.coa_template_items (template_id, sort_order);
CREATE INDEX idx_coa_template_items_active ON public.coa_template_items (is_active);

-- Add comments
COMMENT ON TABLE public.coa_template_items IS 'Individual accounts within COA templates';
COMMENT ON COLUMN public.coa_template_items.template_id IS 'Reference to the COA template';
COMMENT ON COLUMN public.coa_template_items.account_code IS '6-digit account code';
COMMENT ON COLUMN public.coa_template_items.account_name IS 'Display name of the account';
COMMENT ON COLUMN public.coa_template_items.account_subtype_id IS 'Reference to the account subtype';
COMMENT ON COLUMN public.coa_template_items.is_active IS 'Whether this account is active';
COMMENT ON COLUMN public.coa_template_items.sort_order IS 'Order of display within the template';
