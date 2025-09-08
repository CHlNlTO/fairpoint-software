// features/business-registration/hooks/use-master-data.ts

'use client';

import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface FiscalYearPeriod {
  id: string;
  name: string;
  start_month: number;
  start_day: number;
  end_month: number;
  end_day: number;
  is_default: boolean;
  is_active: boolean;
}

export interface GovernmentAgency {
  id: string;
  code: 'BIR' | 'DTI' | 'LGU' | 'SEC' | 'CDA' | (string & {});
  name: string;
  full_name?: string;
  is_active: boolean;
}

export interface TaxRate {
  id: string;
  tax_type: string;
  business_structure: string;
  business_type?: string | null;
  rate_percentage: number;
  rate_name: string;
  description?: string | null;
  is_active: boolean;
}

async function fetchFiscalYearPeriods() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('fiscal_year_periods')
    .select('*')
    .eq('is_active', true)
    .order('is_default', { ascending: false })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []) as FiscalYearPeriod[];
}

async function fetchGovernmentAgencies() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('government_agencies')
    .select('id, code, name, full_name, is_active')
    .eq('is_active', true)
    .order('code', { ascending: true });
  if (error) throw error;
  return (data || []) as GovernmentAgency[];
}

async function fetchTaxRates(params?: {
  taxType?: string;
  businessStructure?: string;
}) {
  const supabase = createClient();
  let query = supabase
    .from('tax_rates')
    .select(
      'id, tax_type, business_structure, business_type, rate_percentage, rate_name, description, is_active'
    )
    .eq('is_active', true);

  if (params?.taxType) {
    query = query.eq('tax_type', params.taxType);
  }
  if (params?.businessStructure) {
    query = query.eq('business_structure', params.businessStructure);
  }

  const { data, error } = await query.order('rate_name', { ascending: true });
  if (error) throw error;
  return (data || []) as TaxRate[];
}

export function useFiscalYearPeriods() {
  return useQuery({
    queryKey: ['fiscalYearPeriods'],
    queryFn: fetchFiscalYearPeriods,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGovernmentAgencies() {
  return useQuery({
    queryKey: ['governmentAgencies'],
    queryFn: fetchGovernmentAgencies,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTaxRates(taxType?: string, businessStructure?: string) {
  return useQuery({
    queryKey: ['taxRates', taxType || 'all', businessStructure || 'all'],
    queryFn: () => fetchTaxRates({ taxType, businessStructure }),
    staleTime: 5 * 60 * 1000,
  });
}
