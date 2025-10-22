// features/chart-of-accounts/hooks/use-coa-filters.ts

'use client';

import { useCallback, useState } from 'react';
import type {
  AccountClassFilters,
  AccountSubclassFilters,
  CoaTemplateFilters,
} from '../lib/types';

const DEFAULT_ACCOUNT_CLASS_FILTERS: AccountClassFilters = {
  search: '',
  is_active: undefined,
  normal_balance: undefined,
  sort_by: 'code',
  sort_order: 'asc',
};

const DEFAULT_ACCOUNT_SUBCLASS_FILTERS: AccountSubclassFilters = {
  search: '',
  is_active: undefined,
  account_class_id: undefined,
  sort_by: 'code',
  sort_order: 'asc',
};

export function useCoaFilters<
  T extends AccountClassFilters | AccountSubclassFilters | CoaTemplateFilters,
>(initialFilters?: Partial<T>) {
  const defaultFilters =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (initialFilters as any)?.account_class_id !== undefined
      ? DEFAULT_ACCOUNT_SUBCLASS_FILTERS
      : DEFAULT_ACCOUNT_CLASS_FILTERS;

  const [filters, setFilters] = useState<T>({
    ...defaultFilters,
    ...initialFilters,
  } as T);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters as T);
  }, [defaultFilters]);

  const clearSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: '' }));
  }, []);

  const toggleActiveFilter = useCallback(() => {
    setFilters(prev => {
      if (prev.is_active === undefined) {
        return { ...prev, is_active: true };
      } else if (prev.is_active === true) {
        return { ...prev, is_active: false };
      } else {
        return { ...prev, is_active: undefined };
      }
    });
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sort_order: prev.sort_order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearSearch,
    toggleActiveFilter,
    toggleSortOrder,
  };
}
