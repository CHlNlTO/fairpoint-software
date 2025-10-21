// features/chart-of-accounts/hooks/use-account-subclasses.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createAccountSubclass,
  deleteAccountSubclass,
  fetchAccountSubclass,
  fetchAccountSubclasses,
  updateAccountSubclass,
} from '../lib/api-client';
import type { AccountSubclassFilters } from '../lib/types';

/**
 * Hook to fetch all account subclasses with optional filters
 */
export function useAccountSubclasses(filters?: AccountSubclassFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['account-subclasses', filters?.search], // Only include search in query key
    queryFn: () => fetchAccountSubclasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single account subclass by ID
 */
export function useAccountSubclass(id: string) {
  return useQuery({
    queryKey: ['account-subclass', id],
    queryFn: () => fetchAccountSubclass(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new account subclass
 */
export function useCreateAccountSubclass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountSubclass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-subclasses'] });
      toast.success('Account subclass created successfully');
    },
    onError: error => {
      toast.error(`Failed to create account subclass: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing account subclass
 */
export function useUpdateAccountSubclass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSubclass,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['account-subclasses'] });
      queryClient.setQueryData(['account-subclass', data.id], data);
      toast.success('Account subclass updated successfully');
    },
    onError: error => {
      toast.error(`Failed to update account subclass: ${error.message}`);
    },
  });
}

/**
 * Hook to delete an account subclass
 */
export function useDeleteAccountSubclass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountSubclass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-subclasses'] });
      toast.success('Account subclass deleted successfully');
    },
    onError: error => {
      toast.error(`Failed to delete account subclass: ${error.message}`);
    },
  });
}
