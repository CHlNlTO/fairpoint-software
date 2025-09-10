// features/business-registration/lib/constants.ts

import {
  listBarangays,
  listMuncities,
  listProvinces,
  listRegions,
} from '@jobuntux/psgc';
import type { BusinessRegistrationStep, WizardStepInfo } from './types';

export const WIZARD_STEPS: WizardStepInfo[] = [
  { id: 'basic-info', title: 'Basic Info', description: '', isRequired: true },
  {
    id: 'business-categories',
    title: 'Business Type',
    description: '',
    isRequired: true,
  },
  {
    id: 'fiscal-year',
    title: 'Fiscal Year',
    description: '',
    isRequired: true,
  },
  {
    id: 'business-structure',
    title: 'Structure',
    description: '',
    isRequired: true,
  },
  {
    id: 'government-credentials',
    title: 'Govt. Credentials',
    description: '(Optional)',
    isRequired: false,
  },
  {
    id: 'tax-type-information',
    title: 'Tax Type',
    description: '',
    isRequired: true,
  },
  {
    id: 'chart-of-accounts',
    title: 'Chart of Accounts',
    description: '',
    isRequired: true,
  },
];

export const STEP_ORDER: BusinessRegistrationStep[] = [
  'basic-info',
  'business-categories',
  'fiscal-year',
  'business-structure',
  'government-credentials',
  'tax-type-information',
  'chart-of-accounts',
];

// Deprecated option lists removed. Step-based UIs provide their own choices.

// PSGC Utilities for Philippine Addresses
export const PSGC_UTILS = {
  // Get all regions
  getRegions: () => listRegions(),

  // Get provinces by region code
  getProvinces: (regionCode: string) => {
    const rawRegionCode = regionCode.replace(/0{8}$/, '');
    return listProvinces(rawRegionCode);
  },

  // Get municipalities/cities by province code
  getMunicipalities: (provinceCode: string) => {
    const rawProvinceCode = provinceCode.replace(/0{5}$/, '');
    return listMuncities(rawProvinceCode);
  },

  // Get barangays by municipality/city code
  getBarangays: (municipalityCode: string) => {
    const rawMunicipalityCode = municipalityCode.replace(/0{3}$/, '');
    return listBarangays(rawMunicipalityCode);
  },

  // Format PSGC codes according to database constraints
  formatRegionCode: (code: string) => `${code}00000000`,
  formatProvinceCode: (code: string) => `${code}00000`,
  formatMunicipalityCode: (code: string) => `${code}000`,
  formatBarangayCode: (code: string) => code,

  // Extract raw codes from formatted codes
  extractRegionCode: (code: string) => code.replace(/0{8}$/, ''),
  extractProvinceCode: (code: string) => code.replace(/0{5}$/, ''),
  extractMunicipalityCode: (code: string) => code.replace(/0{3}$/, ''),
  extractBarangayCode: (code: string) => code,
};

// Industry options for business classification
export const INDUSTRY_OPTIONS = [
  { value: 'retail', label: 'Retail Trade' },
  { value: 'wholesale', label: 'Wholesale Trade' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'services', label: 'Services' },
  { value: 'construction', label: 'Construction' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Insurance' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'entertainment', label: 'Entertainment & Media' },
  { value: 'other', label: 'Other' },
] as const;
