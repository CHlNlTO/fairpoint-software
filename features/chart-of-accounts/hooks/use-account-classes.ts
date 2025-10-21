// features/chart-of-accounts/hooks/use-account-classes.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createAccountClass,
  deleteAccountClass,
  fetchAccountClass,
  fetchAccountClasses,
  updateAccountClass,
} from '../lib/api-client';
import type { AccountClass, AccountClassFilters } from '../lib/types';

/**
 * Hook to fetch all account classes with optional filters
 */
export function useAccountClasses(filters?: AccountClassFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['account-classes', filters?.search], // Only include search in query key
    queryFn: () => fetchAccountClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single account class by ID
 */
export function useAccountClass(id: string) {
  return useQuery({
    queryKey: ['account-class', id],
    queryFn: () => fetchAccountClass(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new account class
 */
export function useCreateAccountClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountClass,
    onSuccess: (data: AccountClass) => {
      // Invalidate and refetch account classes
      queryClient.invalidateQueries({ queryKey: ['account-classes'] });

      // Add the new item to the cache
      queryClient.setQueryData(['account-class', data.id], data);

      toast.success('Account class created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create account class: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing account class
 */
export function useUpdateAccountClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountClass,
    onSuccess: (data: AccountClass) => {
      // Update the specific item in cache
      queryClient.setQueryData(['account-class', data.id], data);

      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['account-classes'] });

      toast.success('Account class updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update account class: ${error.message}`);
    },
  });
}

/**
 * Hook to delete an account class
 */
export function useDeleteAccountClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountClass,
    onSuccess: (_, variables) => {
      // Remove the item from cache
      queryClient.removeQueries({ queryKey: ['account-class', variables.id] });

      // Invalidate the list to refetch
      queryClient.invalidateQueries({ queryKey: ['account-classes'] });

      toast.success('Account class deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete account class: ${error.message}`);
    },
  });
}
