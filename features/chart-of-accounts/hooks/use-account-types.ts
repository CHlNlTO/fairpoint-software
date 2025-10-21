// features/chart-of-accounts/hooks/use-account-types.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createAccountType,
  deleteAccountType,
  fetchAccountType,
  fetchAccountTypes,
  updateAccountType,
} from '../lib/api-client';
import type { AccountTypeFilters } from '../lib/types';

/**
 * Hook to fetch all account types with optional filters
 */
export function useAccountTypes(filters?: AccountTypeFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['account-types', filters?.search], // Only include search in query key
    queryFn: () => fetchAccountTypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single account type by ID
 */
export function useAccountType(id: string) {
  return useQuery({
    queryKey: ['account-type', id],
    queryFn: () => fetchAccountType(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new account type
 */
export function useCreateAccountType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-types'] });
      toast.success('Account type created successfully');
    },
    onError: error => {
      toast.error(`Failed to create account type: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing account type
 */
export function useUpdateAccountType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountType,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['account-types'] });
      queryClient.setQueryData(['account-type', data.id], data);
      toast.success('Account type updated successfully');
    },
    onError: error => {
      toast.error(`Failed to update account type: ${error.message}`);
    },
  });
}

/**
 * Hook to delete an account type
 */
export function useDeleteAccountType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-types'] });
      toast.success('Account type deleted successfully');
    },
    onError: error => {
      toast.error(`Failed to delete account type: ${error.message}`);
    },
  });
}
