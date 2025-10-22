// features/chart-of-accounts/hooks/use-industry-types.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createIndustryType,
  deleteIndustryType,
  fetchIndustryType,
  fetchIndustryTypes,
  updateIndustryType,
} from '../lib/api-client';
import type { IndustryType, IndustryTypeFilters } from '../lib/types';

/**
 * Hook to fetch all industry types with optional filters
 */
export function useIndustryTypes(filters?: IndustryTypeFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['industry-types', filters?.search],
    queryFn: () => fetchIndustryTypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single industry type by ID
 */
export function useIndustryType(id: string) {
  return useQuery({
    queryKey: ['industry-type', id],
    queryFn: () => fetchIndustryType(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new industry type
 */
export function useCreateIndustryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIndustryType,
    onSuccess: (data: IndustryType) => {
      queryClient.invalidateQueries({ queryKey: ['industry-types'] });
      queryClient.setQueryData(['industry-type', data.id], data);
      toast.success('Industry type created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create industry type: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing industry type
 */
export function useUpdateIndustryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateIndustryType,
    onSuccess: (data: IndustryType) => {
      queryClient.setQueryData(['industry-type', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['industry-types'] });
      toast.success('Industry type updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update industry type: ${error.message}`);
    },
  });
}

/**
 * Hook to delete an industry type
 */
export function useDeleteIndustryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIndustryType,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['industry-type', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['industry-types'] });
      toast.success('Industry type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete industry type: ${error.message}`);
    },
  });
}
