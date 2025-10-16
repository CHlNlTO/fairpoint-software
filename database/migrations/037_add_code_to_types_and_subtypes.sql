-- Migration: 037_add_code_to_types_and_subtypes.sql
-- Description: Add code column to account_types and account_subtypes tables and populate with sequential numbers
-- Date: 2024-01-01

-- ============================================================================
-- ACCOUNT TYPES TABLE - Add code column
-- ============================================================================

-- Step 1: Add code column as nullable first (since we have existing data)
ALTER TABLE public.account_types
ADD COLUMN code integer;

-- Step 2: Populate code column with sequential numbers per account_subclass_id
WITH ranked_types AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY account_subclass_id ORDER BY created_at, id) as row_num
  FROM public.account_types
)
UPDATE public.account_types
SET code = ranked_types.row_num
FROM ranked_types
WHERE public.account_types.id = ranked_types.id;

-- Step 3: Make code column NOT NULL and add constraints
ALTER TABLE public.account_types
ALTER COLUMN code SET NOT NULL;

-- Step 4: Add check constraint to ensure code is 2 digits (1-99)
ALTER TABLE public.account_types
ADD CONSTRAINT account_types_code_range CHECK (code >= 1 AND code <= 99);

-- Step 5: Add unique constraint for code within each subclass
ALTER TABLE public.account_types
ADD CONSTRAINT account_types_code_unique_per_subclass UNIQUE (account_subclass_id, code);

-- Step 6: Create index for efficient lookups
CREATE INDEX idx_account_types_code ON public.account_types (code);

-- Add comment
COMMENT ON COLUMN public.account_types.code IS 'Sequential code (1-99) unique within each account subclass';

-- ============================================================================
-- ACCOUNT SUBTYPES TABLE - Add code column
-- ============================================================================

-- Step 1: Add code column as nullable first (since we have existing data)
ALTER TABLE public.account_subtypes
ADD COLUMN code integer;

-- Step 2: Populate code column with sequential numbers per account_type_id
WITH ranked_subtypes AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY account_type_id ORDER BY created_at, id) as row_num
  FROM public.account_subtypes
)
UPDATE public.account_subtypes
SET code = ranked_subtypes.row_num
FROM ranked_subtypes
WHERE public.account_subtypes.id = ranked_subtypes.id;

-- Step 3: Make code column NOT NULL and add constraints
ALTER TABLE public.account_subtypes
ALTER COLUMN code SET NOT NULL;

-- Step 4: Add check constraint to ensure code is 2 digits (1-99)
ALTER TABLE public.account_subtypes
ADD CONSTRAINT account_subtypes_code_range CHECK (code >= 1 AND code <= 99);

-- Step 5: Add unique constraint for code within each type
ALTER TABLE public.account_subtypes
ADD CONSTRAINT account_subtypes_code_unique_per_type UNIQUE (account_type_id, code);

-- Step 6: Create index for efficient lookups
CREATE INDEX idx_account_subtypes_code ON public.account_subtypes (code);

-- Add comment
COMMENT ON COLUMN public.account_subtypes.code IS 'Sequential code (1-99) unique within each account type';
