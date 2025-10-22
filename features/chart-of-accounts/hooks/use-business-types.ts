// features/chart-of-accounts/hooks/use-business-types.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createBusinessType,
  deleteBusinessType,
  fetchBusinessType,
  fetchBusinessTypes,
  updateBusinessType,
} from '../lib/api-client';
import type { BusinessType, BusinessTypeFilters } from '../lib/types';

/**
 * Hook to fetch all business types with optional filters
 */
export function useBusinessTypes(filters?: BusinessTypeFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['business-types', filters?.search], // Only include search in query key
    queryFn: () => fetchBusinessTypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single business type by ID
 */
export function useBusinessType(id: string) {
  return useQuery({
    queryKey: ['business-type', id],
    queryFn: () => fetchBusinessType(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new business type
 */
export function useCreateBusinessType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessType,
    onSuccess: (data: BusinessType) => {
      // Invalidate and refetch business types
      queryClient.invalidateQueries({ queryKey: ['business-types'] });

      // Add the new item to the cache
      queryClient.setQueryData(['business-type', data.id], data);

      toast.success('Business type created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create business type: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing business type
 */
export function useUpdateBusinessType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusinessType,
    onSuccess: (data: BusinessType) => {
      // Update the specific item in cache
      queryClient.setQueryData(['business-type', data.id], data);

      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['business-types'] });

      toast.success('Business type updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update business type: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a business type
 */
export function useDeleteBusinessType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBusinessType,
    onSuccess: (_, variables) => {
      // Remove the item from cache
      queryClient.removeQueries({ queryKey: ['business-type', variables.id] });

      // Invalidate the list to refetch
      queryClient.invalidateQueries({ queryKey: ['business-types'] });

      toast.success('Business type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete business type: ${error.message}`);
    },
  });
}
