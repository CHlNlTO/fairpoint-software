// features/business-registration/index.ts

// Components
export { BusinessRegistrationWizard } from './components/business-registration-wizard';
export { TINInput } from './components/tin-input';
export { WizardNavigation } from './components/wizard-navigation';
export { WizardStepIndicator } from './components/wizard-step-indicator';

// Step Components
export { BasicInfoStep } from './components/steps/basic-info-step';
export { BusinessCategoriesStep } from './components/steps/business-categories-step';
export { BusinessStructureStep } from './components/steps/business-structure-step';
export { ChartOfAccountsStep } from './components/steps/chart-of-accounts-step';
export { FiscalYearStep } from './components/steps/fiscal-year-step';
export { GovernmentCredentialsStep } from './components/steps/government-credentials-step';
export { TaxTypeInformationStep } from './components/steps/tax-type-information-step';

// Hooks
export { useBusinessRegistration } from './hooks/use-business-registration';
export {
  useFiscalYearPeriods,
  useGovernmentAgencies,
  useTaxRates,
} from './hooks/use-master-data';
export { useWizardNavigation } from './hooks/use-wizard-navigation';

// Types
export type {
  BusinessAddress,
  BusinessCategory,
  BusinessRegistrationData,
  BusinessRegistrationState,
  BusinessRegistrationStep,
  BusinessStructure,
  GovernmentAgency,
  PSGCBarangay,
  PSGCMunicipality,
  PSGCProvince,
  PSGCRegion,
  WizardNavigationState,
  WizardStepInfo,
} from './lib/types';

// Constants
export {
  INDUSTRY_OPTIONS,
  PSGC_UTILS,
  STEP_ORDER,
  WIZARD_STEPS,
} from './lib/constants';

// Schemas
export {
  basicInfoStepSchema,
  businessCategoriesStepSchema,
  businessRegistrationSchema,
  businessStructureStepSchema,
  chartOfAccountsStepSchema,
  fiscalYearStepSchema,
  governmentCredentialsStepSchema,
  stepSchemas,
  taxTypeInformationSchema,
} from './lib/schemas';
