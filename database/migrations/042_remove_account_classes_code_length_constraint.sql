-- Migration: Remove account_classes code length constraint
-- Description: Remove the constraint that limits account class codes to 8 characters
-- Date: 2025-01-27

-- Remove the existing code length constraint
ALTER TABLE public.account_classes
DROP CONSTRAINT IF EXISTS account_classes_code_check;

-- Add a new constraint that allows any positive integer for code
ALTER TABLE public.account_classes
ADD CONSTRAINT account_classes_code_check
CHECK (code >= 1);

-- Add comment to document the change
COMMENT ON CONSTRAINT account_classes_code_check ON public.account_classes
IS 'Code must be a positive integer (removed 8-character limit)';
