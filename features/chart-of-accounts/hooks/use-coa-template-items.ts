// features/chart-of-accounts/hooks/use-coa-template-items.ts

'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchCoaTemplateItems } from '../lib/api-client';
import type { CoaTemplateItemFilters } from '../lib/types';

/**
 * Hook to fetch all COA template items with optional filters
 */
export function useCoaTemplateItems(filters?: CoaTemplateItemFilters) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['coa-template-items', filters?.search, filters?.template_id], // Only include search and template_id in query key
    queryFn: () => fetchCoaTemplateItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
