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

export interface ChartOfAccountsTemplate {
  id: string;
  template_name: string;
  business_structure: string;
  business_types: string[];
  description?: string | null;
  is_default: boolean;
  is_active: boolean;
}

export interface ChartOfAccountsTemplateItem {
  id: string;
  template_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  account_category: string;
  parent_account_id?: string | null;
  is_active: boolean;
  is_contra_account: boolean;
  normal_balance: string;
  sort_order: number;
  level: number;
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

async function fetchChartOfAccountsTemplates(params?: {
  businessStructure?: string;
  businessTypes?: string[];
}) {
  const supabase = createClient();
  let query = supabase
    .from('chart_of_accounts_templates')
    .select('*')
    .eq('is_active', true);

  if (params?.businessStructure) {
    query = query.eq('business_structure', params.businessStructure);
  }

  if (params?.businessTypes && params.businessTypes.length > 0) {
    query = query.overlaps('business_types', params.businessTypes);
  }

  const { data, error } = await query.order('template_name', {
    ascending: true,
  });
  if (error) throw error;
  return (data || []) as ChartOfAccountsTemplate[];
}

async function fetchChartOfAccountsTemplateItems(templateId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chart_of_accounts_template_items')
    .select('*')
    .eq('template_id', templateId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as ChartOfAccountsTemplateItem[];
}

export function useChartOfAccountsTemplates(
  businessStructure?: string,
  businessTypes?: string[]
) {
  return useQuery({
    queryKey: [
      'chartOfAccountsTemplates',
      businessStructure || 'all',
      businessTypes || [],
    ],
    queryFn: () =>
      fetchChartOfAccountsTemplates({ businessStructure, businessTypes }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useChartOfAccountsTemplateItems(templateId?: string) {
  return useQuery({
    queryKey: ['chartOfAccountsTemplateItems', templateId || 'none'],
    queryFn: () =>
      templateId
        ? fetchChartOfAccountsTemplateItems(templateId)
        : Promise.resolve([]),
    staleTime: 5 * 60 * 1000,
    enabled: !!templateId,
  });
}
