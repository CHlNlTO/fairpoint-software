-- Migration: Update RLS policies for account_classes and account_subclasses
-- Description: Allow authenticated users to perform CRUD operations on account classes and subclasses
-- Date: 2025-01-27

-- ============================================================================
-- ACCOUNT CLASSES TABLE POLICIES UPDATE
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "No modifications to account classes" ON public.account_classes;

-- Create new policies that allow authenticated users to manage account classes
CREATE POLICY "Authenticated users can insert account classes" ON public.account_classes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update account classes" ON public.account_classes
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete account classes" ON public.account_classes
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- ACCOUNT SUBCLASSES TABLE POLICIES UPDATE
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "No modifications to account subclasses" ON public.account_subclasses;

-- Create new policies that allow authenticated users to manage account subclasses
CREATE POLICY "Authenticated users can insert account subclasses" ON public.account_subclasses
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update account subclasses" ON public.account_subclasses
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete account subclasses" ON public.account_subclasses
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add policy comments
COMMENT ON POLICY "Authenticated users can insert account classes" ON public.account_classes IS 'Authenticated users can create new account classes';
COMMENT ON POLICY "Authenticated users can update account classes" ON public.account_classes IS 'Authenticated users can update existing account classes';
COMMENT ON POLICY "Authenticated users can delete account classes" ON public.account_classes IS 'Authenticated users can delete account classes';

COMMENT ON POLICY "Authenticated users can insert account subclasses" ON public.account_subclasses IS 'Authenticated users can create new account subclasses';
COMMENT ON POLICY "Authenticated users can update account subclasses" ON public.account_subclasses IS 'Authenticated users can update existing account subclasses';
COMMENT ON POLICY "Authenticated users can delete account subclasses" ON public.account_subclasses IS 'Authenticated users can delete account subclasses';
