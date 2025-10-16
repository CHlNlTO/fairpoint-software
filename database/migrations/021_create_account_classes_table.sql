  -- Migration: 021_create_account_classes_table.sql
  -- Description: Create account_classes table for system-defined account classes
  -- Date: 2024-01-01

  -- Create account_classes table
  CREATE TABLE public.account_classes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code integer NOT NULL UNIQUE,
    name text NOT NULL,
    normal_balance text NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    is_active boolean NOT NULL DEFAULT true,
    description text,
    hint text,
    created_at timestamp with time zone DEFAULT now(),

    CONSTRAINT account_classes_pkey PRIMARY KEY (id),
    CONSTRAINT account_classes_code_check CHECK (code >= 1 AND code <= 8),
    CONSTRAINT account_classes_name_length CHECK (char_length(name) <= 100),
    CONSTRAINT account_classes_description_length CHECK (char_length(description) <= 500),
    CONSTRAINT account_classes_hint_length CHECK (char_length(hint) <= 200)
  );

  -- Create indexes
  CREATE INDEX idx_account_classes_code ON public.account_classes (code);
  CREATE INDEX idx_account_classes_active ON public.account_classes (is_active);

  -- Add comments
  COMMENT ON TABLE public.account_classes IS 'System-defined account classes (Assets, Liabilities, etc.)';
  COMMENT ON COLUMN public.account_classes.code IS 'Unique integer code for the account class (1-8)';
  COMMENT ON COLUMN public.account_classes.name IS 'Display name of the account class';
  COMMENT ON COLUMN public.account_classes.normal_balance IS 'Normal balance side for this account class';
  COMMENT ON COLUMN public.account_classes.is_active IS 'Whether this account class is active';
  COMMENT ON COLUMN public.account_classes.description IS 'Detailed description of the account class';
  COMMENT ON COLUMN public.account_classes.hint IS 'Helpful hint for users about this account class';
