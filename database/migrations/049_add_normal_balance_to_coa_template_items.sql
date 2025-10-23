-- Migration: Add normal_balance column to coa_template_items table
-- Date: 2024-01-XX
-- Description: Adds normal_balance column to coa_template_items table with proper constraints

-- Add normal_balance column to coa_template_items table
ALTER TABLE public.coa_template_items
ADD COLUMN normal_balance text NOT NULL DEFAULT 'debit';

-- Add check constraint for normal_balance values
ALTER TABLE public.coa_template_items
ADD CONSTRAINT coa_template_items_normal_balance_check
CHECK (normal_balance = ANY (ARRAY['debit'::text, 'credit'::text]));

-- Create index for normal_balance column for better query performance
CREATE INDEX IF NOT EXISTS idx_coa_template_items_normal_balance
ON public.coa_template_items USING btree (normal_balance)
TABLESPACE pg_default;

-- Add comment to the column for documentation
COMMENT ON COLUMN public.coa_template_items.normal_balance IS 'Indicates whether the account has a normal debit or credit balance';
