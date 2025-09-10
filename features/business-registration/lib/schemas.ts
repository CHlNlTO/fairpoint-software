// features/business-registration/lib/schemas.ts

import { z } from 'zod';

export const businessAddressSchema = z.object({
  regionPsgc: z.string().regex(/^\d{2}0{8}$/, 'Invalid region PSGC format'),
  provincePsgc: z.string().regex(/^\d{5}0{5}$/, 'Invalid province PSGC format'),
  cityMunicipalityPsgc: z
    .string()
    .regex(/^\d{7}0{3}$/, 'Invalid city/municipality PSGC format'),
  barangayPsgc: z.string().regex(/^\d{10}$/, 'Invalid barangay PSGC format'),
  streetAddress: z.string().optional(),
  buildingName: z.string().optional(),
  unitNumber: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, 'Invalid postal code format')
    .optional(),
});

// Step 1: Basic Info
export const basicInfoStepSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  taxId: z.string().min(1, 'TIN is required'),
  businessEmail: z.string().email('Please enter a valid email address'),
  address: z.lazy(() => businessAddressSchema),
});

// Step 2: Business Categories
export const businessCategoriesStepSchema = z.object({
  businessCategories: z
    .array(z.enum(['services', 'retail', 'manufacturing', 'import-export']))
    .min(1, 'Select at least one business type'),
});

// Step 3: Fiscal Year
export const fiscalYearStepSchema = z
  .object({
    fiscalYearPeriodId: z
      .enum(['standard-jan-dec', 'standard-jun-jul', 'custom'])
      .optional(),
    fiscalYearCustomStartMonth: z.number().int().min(1).max(12).optional(),
    fiscalYearCustomStartDay: z.number().int().min(1).max(31).optional(),
    fiscalYearCustomEndMonth: z.number().int().min(1).max(12).optional(),
    fiscalYearCustomEndDay: z.number().int().min(1).max(31).optional(),
  })
  .refine(
    data => {
      if (data.fiscalYearPeriodId === 'custom') {
        return (
          !!data.fiscalYearCustomStartMonth &&
          !!data.fiscalYearCustomStartDay &&
          !!data.fiscalYearCustomEndMonth &&
          !!data.fiscalYearCustomEndDay
        );
      }
      return true;
    },
    {
      message: 'Please provide complete custom fiscal year dates',
      path: ['fiscalYearPeriodId'],
    }
  );

// Step 4: Business Structure
export const businessStructureStepSchema = z.object({
  businessStructure: z.enum([
    'freelancing',
    'sole-proprietorship',
    'partnership',
    'corporation',
    'cooperative',
  ]),
});

// Step 6: Tax Type Information
export const taxTypeInformationSchema = z.object({
  incomeTaxRateId: z.string().min(1, 'Select an income tax type'),
  businessTaxType: z.enum(['VAT', 'Percentage Tax']).optional(),
  businessTaxExempt: z.boolean().optional(),
  additionalTaxes: z.array(z.string()).optional(),
});

// Step 7: Chart of Accounts
export const chartOfAccountsStepSchema = z
  .object({
    coaSetupOption: z.enum(['default', 'import']),
    coaCsvData: z.string().optional(),
  })
  .refine(
    data => {
      if (data.coaSetupOption === 'import') {
        return !!data.coaCsvData && data.coaCsvData.length > 0;
      }
      return true;
    },
    { message: 'Please upload a CSV file for import', path: ['coaCsvData'] }
  );

// Government Credentials (Step 5)
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Invalid date format (use YYYY-MM-DD)');

export const governmentCredentialSchema = z.object({
  agencyCode: z.enum(['BIR', 'DTI', 'LGU', 'SEC', 'CDA']),
  registrationNumber: z.string().max(100).optional().or(z.literal('')),
  registrationDate: isoDate.optional().or(z.literal('')),
  expiryDate: isoDate.optional().or(z.literal('')),
  status: z.enum(['registered', 'pending', 'expired', 'cancelled']).optional(),
});

const governmentCredentialsBase = z.object({
  governmentCredentials: z.array(governmentCredentialSchema).optional(),
});

export const governmentCredentialsStepSchema =
  governmentCredentialsBase.optional();

export const businessRegistrationSchema = z.object({
  ...basicInfoStepSchema.shape,
  ...businessCategoriesStepSchema.shape,
  ...fiscalYearStepSchema.shape,
  ...businessStructureStepSchema.shape,
  ...governmentCredentialsBase.shape,
  ...taxTypeInformationSchema.shape,
  ...chartOfAccountsStepSchema.shape,
});

// Individual step validation schemas
export const stepSchemas = {
  'basic-info': basicInfoStepSchema,
  'business-categories': businessCategoriesStepSchema,
  'fiscal-year': fiscalYearStepSchema,
  'business-structure': businessStructureStepSchema,
  'government-credentials': governmentCredentialsStepSchema,
  'tax-type-information': taxTypeInformationSchema,
  'chart-of-accounts': chartOfAccountsStepSchema,
} as const;
