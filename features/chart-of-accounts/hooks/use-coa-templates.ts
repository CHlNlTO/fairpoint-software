// features/chart-of-accounts/hooks/use-coa-templates.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createCoaTemplate,
  deleteCoaTemplate,
  fetchCoaTemplate,
  fetchCoaTemplates,
  updateCoaTemplate,
} from '../lib/api-client';
import type { CoaTemplate, CoaTemplateFilters } from '../lib/types';

/**
 * Hook to fetch all COA templates with optional filters
 */
export function useCoaTemplates(filters?: CoaTemplateFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      'coa-templates',
      filters?.search,
      filters?.is_default,
      filters?.is_active,
    ],
    queryFn: () => fetchCoaTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single COA template by ID
 */
export function useCoaTemplate(id: string) {
  return useQuery({
    queryKey: ['coa-template', id],
    queryFn: () => fetchCoaTemplate(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to create a new COA template
 */
export function useCreateCoaTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoaTemplate,
    onSuccess: (data: CoaTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['coa-templates'] });
      queryClient.setQueryData(['coa-template', data.id], data);
      toast.success('COA template created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create COA template: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing COA template
 */
export function useUpdateCoaTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoaTemplate,
    onSuccess: (data: CoaTemplate) => {
      queryClient.setQueryData(['coa-template', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['coa-templates'] });
      toast.success('COA template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update COA template: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a COA template
 */
export function useDeleteCoaTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoaTemplate,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['coa-template', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['coa-templates'] });
      toast.success('COA template deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete COA template: ${error.message}`);
    },
  });
}
