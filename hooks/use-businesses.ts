// hooks/use-businesses.ts

import type { Business, BusinessesResponse } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseBusinessesOptions {
  enabled?: boolean;
}

/**
 * Custom hook for fetching user's businesses
 * Uses TanStack Query for server state management with proper caching
 */
export function useBusinesses(options: UseBusinessesOptions = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['businesses'],
    queryFn: async (): Promise<Business[]> => {
      const response = await fetch('/api/business-registrations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: BusinessesResponse = await response.json();
      return data.businesses;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      if (error instanceof Error && error.message.includes('403')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });
}

/**
 * Hook for invalidating businesses cache
 * Useful after creating, updating, or deleting businesses
 */
export function useInvalidateBusinesses() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['businesses'] });
  };

  return { invalidate };
}
