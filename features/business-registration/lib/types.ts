// features/business-registration/lib/types.ts

export type BusinessRegistrationStep =
  | 'basic-info'
  | 'business-categories'
  | 'fiscal-year'
  | 'business-structure'
  | 'government-credentials'
  | 'tax-type-information'
  | 'chart-of-accounts';

export interface BusinessRegistrationData {
  // Optional registration id once draft/record is created
  registrationId?: string;
  // Step 1: Basic Business Information
  businessName: string;
  taxId: string; // TIN
  address: BusinessAddress;
  businessEmail: string;

  // Step 2: Business Type (categories)
  businessCategories: BusinessCategory[];

  // Step 3: Fiscal Year
  fiscalYearPeriodId?: string; // selected predefined period
  fiscalYearCustomStartMonth?: number;
  fiscalYearCustomStartDay?: number;
  fiscalYearCustomEndMonth?: number;
  fiscalYearCustomEndDay?: number;

  // Step 4: Business Structure
  businessStructure: BusinessStructure;

  // Step 5: Government Credentials (optional)
  governmentAgencies?: GovernmentAgency[];

  // Step 6: Tax Type Information
  incomeTaxRateId: string; // required
  businessTaxType?: 'VAT' | 'Percentage Tax';
  businessTaxExempt?: boolean;
  additionalTaxes?: string[]; // e.g., ['withholding_tax','expanded_withholding_tax','tamp']

  // Step 7: Chart of Accounts
  coaSetupOption: 'default' | 'import';
  coaCsvData?: string; // CSV content when import option is chosen
}

// Step 2 categories
export type BusinessCategory =
  | 'services'
  | 'retail'
  | 'manufacturing'
  | 'import_export';

// Step 4 structure
export type BusinessStructure =
  | 'freelancing'
  | 'sole_proprietorship'
  | 'partnership'
  | 'corporation'
  | 'cooperative';

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

export type GovernmentAgency = 'BIR' | 'DTI' | 'LGU' | 'SEC' | 'CDA';

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
