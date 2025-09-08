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

export const businessInfoStepSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessDescription: z.string().optional(),
  industry: z.string().optional(),
});

export const businessTypeStepSchema = z.object({
  businessType: z.enum([
    'sole-proprietorship',
    'partnership',
    'llc',
    'corporation',
    's-corporation',
    'non-profit',
    'other',
  ]),
  ownership: z.enum(['single-owner', 'multi-owner', 'shareholders']),
  employees: z.number().optional(),
});

export const taxInformationSchema = z.object({
  taxId: z.string().optional(),
  taxClassification: z
    .enum([
      'sole-proprietorship',
      'partnership',
      's-election',
      'c-corporation',
      'non-profit',
    ])
    .optional(),
  fiscalYearEnd: z.string().optional(),
  incomeTaxRateId: z.string().uuid().optional(),
  businessTaxType: z.enum(['VAT', 'Percentage Tax']).optional(),
  businessTaxExempt: z.boolean().optional(),
  additionalTaxes: z.array(z.string()).optional(),
});

export const contactDetailsStepSchema = z.object({
  address: businessAddressSchema,
  phone: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

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
  ...businessInfoStepSchema.shape,
  ...businessTypeStepSchema.shape,
  ...taxInformationSchema.shape,
  ...governmentCredentialsBase.shape,
  ...contactDetailsStepSchema.shape,
});

// Individual step validation schemas
export const stepSchemas = {
  'business-info': businessInfoStepSchema,
  'business-type': businessTypeStepSchema,
  'government-credentials': governmentCredentialsStepSchema,
  'tax-information': taxInformationSchema,
  'contact-details': contactDetailsStepSchema,
  review: businessRegistrationSchema,
} as const;
