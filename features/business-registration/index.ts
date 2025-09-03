// features/business-registration/index.ts

// Components
export { BusinessRegistrationWizard } from './components/business-registration-wizard';
export { WizardNavigation } from './components/wizard-navigation';
export { WizardStepIndicator } from './components/wizard-step-indicator';

// Step Components
export { BusinessInfoStep } from './components/steps/business-info-step';
export { BusinessTypeStep } from './components/steps/business-type-step';
export { ContactDetailsStep } from './components/steps/contact-details-step';
export { TaxInformationStep } from './components/steps/tax-information-step';

// Hooks
export { useBusinessRegistration } from './hooks/use-business-registration';
export { useWizardNavigation } from './hooks/use-wizard-navigation';

// Types
export type {
  BusinessAddress,
  BusinessRegistrationData,
  BusinessRegistrationState,
  BusinessRegistrationStep,
  BusinessType,
  OwnershipType,
  PSGCBarangay,
  PSGCMunicipality,
  PSGCProvince,
  PSGCRegion,
  TaxClassification,
  WizardNavigationState,
  WizardStepInfo,
} from './lib/types';

// Constants
export {
  BUSINESS_TYPE_OPTIONS,
  INDUSTRY_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  PSGC_UTILS,
  STEP_ORDER,
  TAX_CLASSIFICATION_OPTIONS,
  WIZARD_STEPS,
} from './lib/constants';

// Schemas
export {
  businessInfoStepSchema,
  businessRegistrationSchema,
  businessTypeStepSchema,
  contactDetailsStepSchema,
  stepSchemas,
  taxInformationSchema,
} from './lib/schemas';
