-- Migration: 024_create_account_subtypes_table.sql
-- Description: Create account_subtypes table for system-defined and user-defined account subtypes
-- Date: 2024-01-01

-- Create account_subtypes table
CREATE TABLE public.account_subtypes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_type_id uuid NOT NULL,
  user_id uuid,
  business_registration_id uuid,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_system_defined boolean NOT NULL DEFAULT true,
  description text,
  hint text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT account_subtypes_pkey PRIMARY KEY (id),
  CONSTRAINT account_subtypes_account_type_id_fkey FOREIGN KEY (account_type_id) REFERENCES public.account_types(id) ON DELETE CASCADE,
  CONSTRAINT account_subtypes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT account_subtypes_business_registration_id_fkey FOREIGN KEY (business_registration_id) REFERENCES public.business_registrations(id) ON DELETE CASCADE,
  CONSTRAINT account_subtypes_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT account_subtypes_description_length CHECK (char_length(description) <= 500),
  CONSTRAINT account_subtypes_hint_length CHECK (char_length(hint) <= 200),
  CONSTRAINT account_subtypes_user_or_business_check CHECK (
    (is_system_defined = true AND user_id IS NULL AND business_registration_id IS NULL) OR
    (is_system_defined = false AND (user_id IS NOT NULL OR business_registration_id IS NOT NULL))
  )
);

-- Create indexes
CREATE INDEX idx_account_subtypes_type_id ON public.account_subtypes (account_type_id);
CREATE INDEX idx_account_subtypes_user_id ON public.account_subtypes (user_id);
CREATE INDEX idx_account_subtypes_business_id ON public.account_subtypes (business_registration_id);
CREATE INDEX idx_account_subtypes_active ON public.account_subtypes (is_active);
CREATE INDEX idx_account_subtypes_system_defined ON public.account_subtypes (is_system_defined);

-- Add comments
COMMENT ON TABLE public.account_subtypes IS 'Account subtypes - system-defined and user-defined';
COMMENT ON COLUMN public.account_subtypes.account_type_id IS 'Reference to the parent account type';
COMMENT ON COLUMN public.account_subtypes.user_id IS 'User who created this account subtype (for user-defined subtypes)';
COMMENT ON COLUMN public.account_subtypes.business_registration_id IS 'Business that created this account subtype (for business-specific subtypes)';
COMMENT ON COLUMN public.account_subtypes.name IS 'Display name of the account subtype';
COMMENT ON COLUMN public.account_subtypes.is_active IS 'Whether this account subtype is active';
COMMENT ON COLUMN public.account_subtypes.is_system_defined IS 'Whether this is a system-defined account subtype';
COMMENT ON COLUMN public.account_subtypes.description IS 'Detailed description of the account subtype';
COMMENT ON COLUMN public.account_subtypes.hint IS 'Helpful hint for users about this account subtype';
