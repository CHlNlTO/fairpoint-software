-- Migration: 023_create_account_types_table.sql
-- Description: Create account_types table for system-defined and user-defined account types
-- Date: 2024-01-01

-- Create account_types table
CREATE TABLE public.account_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_subclass_id uuid NOT NULL,
  user_id uuid,
  business_registration_id uuid,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_system_defined boolean NOT NULL DEFAULT true,
  description text,
  hint text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT account_types_pkey PRIMARY KEY (id),
  CONSTRAINT account_types_account_subclass_id_fkey FOREIGN KEY (account_subclass_id) REFERENCES public.account_subclasses(id) ON DELETE CASCADE,
  CONSTRAINT account_types_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT account_types_business_registration_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,
  CONSTRAINT account_types_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT account_types_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT account_types_hint_length CHECK (char_length(hint) <= 200),
  CONSTRAINT account_types_user_or_business_check CHECK (
    (is_system_defined = true AND user_id IS NULL AND business_registration_id IS NULL) OR
    (is_system_defined = false AND (user_id IS NOT NULL OR business_registration_id IS NOT NULL))
  )
);

-- Create indexes
CREATE INDEX idx_account_types_subclass_id ON public.account_types (account_subclass_id);
CREATE INDEX idx_account_types_user_id ON public.account_types (user_id);
CREATE INDEX idx_account_types_business_id ON public.account_types (business_registration_id);
CREATE INDEX idx_account_types_active ON public.account_types (is_active);
CREATE INDEX idx_account_types_system_defined ON public.account_types (is_system_defined);

-- Add comments
COMMENT ON TABLE public.account_types IS 'Account types - system-defined and user-defined';
COMMENT ON COLUMN public.account_types.account_subclass_id IS 'Reference to the parent account subclass';
COMMENT ON COLUMN public.account_types.user_id IS 'User who created this account type (for user-defined types)';
COMMENT ON COLUMN public.account_types.business_registration_id IS 'Business that created this account type (for business-specific types)';
COMMENT ON COLUMN public.account_types.name IS 'Display name of the account type';
COMMENT ON COLUMN public.account_types.is_active IS 'Whether this account type is active';
COMMENT ON COLUMN public.account_types.is_system_defined IS 'Whether this is a system-defined account type';
COMMENT ON COLUMN public.account_types.description IS 'Detailed description of the account type';
COMMENT ON COLUMN public.account_types.hint IS 'Helpful hint for users about this account type';
