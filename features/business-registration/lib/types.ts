// features/business-registration/lib/types.ts

export type BusinessRegistrationStep =
  | 'business-info'
  | 'business-type'
  | 'tax-information'
  | 'contact-details'
  | 'review';

export interface BusinessRegistrationData {
  // Business Info Step
  businessName: string;
  businessDescription?: string;
  industry?: string;

  // Business Type Step
  businessType: BusinessType;
  ownership: OwnershipType;
  employees?: number;

  // Tax Information Step
  taxId?: string;
  taxClassification?: TaxClassification;
  fiscalYearEnd?: string;

  // Contact Details Step
  address: BusinessAddress;
  phone?: string;
  website?: string;
  email?: string;
}

export type BusinessType =
  | 'sole-proprietorship'
  | 'partnership'
  | 'llc'
  | 'corporation'
  | 's-corporation'
  | 'non-profit'
  | 'other';

export type OwnershipType = 'single-owner' | 'multi-owner' | 'shareholders';

export type TaxClassification =
  | 'sole-proprietorship'
  | 'partnership'
  | 's-election'
  | 'c-corporation'
  | 'non-profit';

// Philippine Address using PSGC codes
export interface BusinessAddress {
  regionPsgc: string; // Format: RR00000000
  provincePsgc: string; // Format: RRRRR00000
  cityMunicipalityPsgc: string; // Format: RRRRRRR000
  barangayPsgc: string; // Format: RRRRRRRRRR
  streetAddress?: string;
  buildingName?: string;
  unitNumber?: string;
  postalCode?: string;
}

export interface WizardStepInfo {
  id: BusinessRegistrationStep;
  title: string;
  description: string;
  isRequired: boolean;
}

export interface WizardNavigationState {
  currentStep: BusinessRegistrationStep;
  completedSteps: BusinessRegistrationStep[];
  canProgress: boolean;
  canGoBack: boolean;
  totalSteps: number;
  currentStepIndex: number;
}

export interface BusinessRegistrationState {
  data: Partial<BusinessRegistrationData>;
  navigation: WizardNavigationState;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  submission: {
    isSubmitting: boolean;
    error?: string;
  };
}

// PSGC Data Types
export interface PSGCRegion {
  psgcCode: string;
  regCode: string;
  regionName: string;
}

export interface PSGCProvince {
  psgcCode: string;
  regCode: string;
  provCode?: string;
  provName: string;
  provOldName?: string;
  cityClass?: 'HUC' | 'CC' | 'ICC';
  munCityCode?: string;
}

export interface PSGCMunicipality {
  psgcCode: string;
  regCode: string;
  provCode: string;
  munCityCode: string;
  munCityName: string;
  munCityOldName?: string;
}

export interface PSGCBarangay {
  psgcCode: string;
  regCode: string;
  provCode: string;
  munCityCode: string;
  brgyCode: string;
  brgyName: string;
  brgyOldName?: string;
}
