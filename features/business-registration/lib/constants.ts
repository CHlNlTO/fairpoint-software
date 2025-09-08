// features/business-registration/lib/constants.ts

import {
  listBarangays,
  listMuncities,
  listProvinces,
  listRegions,
} from '@jobuntux/psgc';
import type {
  BusinessRegistrationStep,
  BusinessType,
  OwnershipType,
  TaxClassification,
  WizardStepInfo,
} from './types';

export const WIZARD_STEPS: WizardStepInfo[] = [
  {
    id: 'business-info',
    title: 'Business Information',
    description: '',
    isRequired: true,
  },
  {
    id: 'business-type',
    title: 'Business Structure',
    description: '',
    isRequired: true,
  },
  {
    id: 'government-credentials',
    title: 'Government Credentials',
    description: '',
    isRequired: false,
  },
  {
    id: 'tax-information',
    title: 'Tax Information',
    description: '',
    isRequired: false,
  },
  {
    id: 'contact-details',
    title: 'Contact Details',
    description: '',
    isRequired: true,
  },
  {
    id: 'review',
    title: 'Review',
    description: '',
    isRequired: true,
  },
];

export const STEP_ORDER: BusinessRegistrationStep[] = [
  'business-info',
  'business-type',
  'government-credentials',
  'tax-information',
  'contact-details',
  'review',
];

export const BUSINESS_TYPE_OPTIONS: Array<{
  value: BusinessType;
  label: string;
  description: string;
}> = [
  {
    value: 'sole-proprietorship',
    label: 'Sole Proprietorship',
    description: 'A business owned and run by one individual',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'A business owned by two or more people',
  },
  {
    value: 'llc',
    label: 'LLC',
    description: 'Limited Liability Company',
  },
  {
    value: 'corporation',
    label: 'Corporation',
    description: 'A separate legal entity owned by shareholders',
  },
  {
    value: 's-corporation',
    label: 'S-Corporation',
    description: 'Corporation with special tax status',
  },
  {
    value: 'non-profit',
    label: 'Non-Profit',
    description: 'Tax-exempt organization',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other business structure',
  },
];

export const OWNERSHIP_TYPE_OPTIONS: Array<{
  value: OwnershipType;
  label: string;
}> = [
  {
    value: 'single-owner',
    label: 'Single Owner',
  },
  {
    value: 'multi-owner',
    label: 'Multiple Owners',
  },
  {
    value: 'shareholders',
    label: 'Shareholders',
  },
];

export const TAX_CLASSIFICATION_OPTIONS: Array<{
  value: TaxClassification;
  label: string;
}> = [
  {
    value: 'sole-proprietorship',
    label: 'Sole Proprietorship',
  },
  {
    value: 'partnership',
    label: 'Partnership',
  },
  {
    value: 's-election',
    label: 'S-Election',
  },
  {
    value: 'c-corporation',
    label: 'C-Corporation',
  },
  {
    value: 'non-profit',
    label: 'Non-Profit',
  },
];

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
