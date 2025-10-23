// features/chart-of-accounts/hooks/use-coa-template-combined.ts

import { useQuery } from '@tanstack/react-query';
import type { CoaTemplateCombinedFormData } from '../lib/types';

interface CoaTemplateCombinedResponse {
  data: CoaTemplateCombinedFormData;
}

export function useCoaTemplateCombined(id: string) {
  return useQuery({
    queryKey: ['coa-template-combined', id],
    queryFn: async (): Promise<CoaTemplateCombinedFormData> => {
      const response = await fetch(`/api/chart-of-accounts/template?id=${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch COA template');
      }

      const result: CoaTemplateCombinedResponse = await response.json();
      return result.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
  });
}
