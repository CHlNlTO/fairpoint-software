// features/chart-of-accounts/hooks/use-account-subtypes.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createAccountSubtype,
  deleteAccountSubtype,
  fetchAccountSubtype,
  fetchAccountSubtypes,
  updateAccountSubtype,
} from '../lib/api-client';
import type { AccountSubtypeFilters } from '../lib/types';

/**
 * Hook to fetch all account subtypes with optional filters
 */
export function useAccountSubtypes(filters?: AccountSubtypeFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['account-subtypes', filters?.search], // Only include search in query key
    queryFn: () => fetchAccountSubtypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single account subtype by ID
 */
export function useAccountSubtype(id: string) {
  return useQuery({
    queryKey: ['account-subtype', id],
    queryFn: () => fetchAccountSubtype(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new account subtype
 */
export function useCreateAccountSubtype() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-subtypes'] });
      toast.success('Account subtype created successfully');
    },
    onError: error => {
      toast.error(`Failed to create account subtype: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing account subtype
 */
export function useUpdateAccountSubtype() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSubtype,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['account-subtypes'] });
      queryClient.setQueryData(['account-subtype', data.id], data);
      toast.success('Account subtype updated successfully');
    },
    onError: error => {
      toast.error(`Failed to update account subtype: ${error.message}`);
    },
  });
}

/**
 * Hook to delete an account subtype
 */
export function useDeleteAccountSubtype() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-subtypes'] });
      toast.success('Account subtype deleted successfully');
    },
    onError: error => {
      toast.error(`Failed to delete account subtype: ${error.message}`);
    },
  });
}
