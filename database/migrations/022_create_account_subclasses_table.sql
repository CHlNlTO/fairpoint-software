-- Migration: 022_create_account_subclasses_table.sql
-- Description: Create account_subclasses table for system-defined account subclasses
-- Date: 2024-01-01

-- Create account_subclasses table
CREATE TABLE public.account_subclasses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_class_id uuid NOT NULL,
  code integer NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  description text,
  hint text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT account_subclasses_pkey PRIMARY KEY (id),
  CONSTRAINT account_subclasses_account_class_id_fkey FOREIGN KEY (account_class_id) REFERENCES public.account_classes(id) ON DELETE CASCADE,
  CONSTRAINT account_subclasses_code_check CHECK (code >= 1 AND code <= 9),
  CONSTRAINT account_subclasses_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT account_subclasses_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT account_subclasses_hint_length CHECK (char_length(hint) <= 200),
  CONSTRAINT account_subclasses_unique_code_per_class UNIQUE (account_class_id, code)
);

-- Create indexes
CREATE INDEX idx_account_subclasses_class_id ON public.account_subclasses (account_class_id);
CREATE INDEX idx_account_subclasses_code ON public.account_subclasses (code);
CREATE INDEX idx_account_subclasses_active ON public.account_subclasses (is_active);

-- Add comments
COMMENT ON TABLE public.account_subclasses IS 'System-defined account subclasses (Current Assets, Fixed Assets, etc.)';
COMMENT ON COLUMN public.account_subclasses.account_class_id IS 'Reference to the parent account class';
COMMENT ON COLUMN public.account_subclasses.code IS 'Unique integer code for the subclass within the class';
COMMENT ON COLUMN public.account_subclasses.name IS 'Display name of the account subclass';
COMMENT ON COLUMN public.account_subclasses.is_active IS 'Whether this account subclass is active';
COMMENT ON COLUMN public.account_subclasses.description IS 'Detailed description of the account subclass';
COMMENT ON COLUMN public.account_subclasses.hint IS 'Helpful hint for users about this account subclass';
