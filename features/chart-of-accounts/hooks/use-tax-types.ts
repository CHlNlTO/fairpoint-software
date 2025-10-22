// features/chart-of-accounts/hooks/use-tax-types.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createTaxType,
  deleteTaxType,
  fetchTaxType,
  fetchTaxTypes,
  updateTaxType,
} from '../lib/api-client';
import type { TaxType, TaxTypeFilters } from '../lib/types';

/**
 * Hook to fetch all tax types with optional filters
 */
export function useTaxTypes(filters?: TaxTypeFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['tax-types', filters?.search],
    queryFn: () => fetchTaxTypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single tax type by ID
 */
export function useTaxType(id: string) {
  return useQuery({
    queryKey: ['tax-type', id],
    queryFn: () => fetchTaxType(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new tax type
 */
export function useCreateTaxType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaxType,
    onSuccess: (data: TaxType) => {
      queryClient.invalidateQueries({ queryKey: ['tax-types'] });
      queryClient.setQueryData(['tax-type', data.id], data);
      toast.success('Tax type created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create tax type: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing tax type
 */
export function useUpdateTaxType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaxType,
    onSuccess: (data: TaxType) => {
      queryClient.setQueryData(['tax-type', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['tax-types'] });
      toast.success('Tax type updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update tax type: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a tax type
 */
export function useDeleteTaxType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaxType,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['tax-type', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tax-types'] });
      toast.success('Tax type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete tax type: ${error.message}`);
    },
  });
}
