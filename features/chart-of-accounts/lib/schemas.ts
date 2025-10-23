// features/chart-of-accounts/lib/schemas.ts

import { z } from 'zod';

// Account Class Schemas
export const accountClassSchema = z.object({
  code: z.number().int().min(1, 'Code must be a positive integer'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  normal_balance: z.enum(['debit', 'credit']),
  is_active: z.boolean(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
});

export const accountClassCreateSchema = accountClassSchema;

export const accountClassUpdateSchema = accountClassSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const accountClassFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  normal_balance: z.enum(['debit', 'credit']).optional(),
  sort_by: z.enum(['code', 'name', 'created_at']).default('code'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Account Subclass Schemas
export const accountSubclassSchema = z.object({
  account_class_id: z.string().uuid('Invalid account class ID format'),
  code: z.number().int().min(1, 'Code must be a positive integer'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  is_active: z.boolean(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
});

export const accountSubclassCreateSchema = accountSubclassSchema;

export const accountSubclassUpdateSchema = accountSubclassSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid ID format'),
  });

export const accountSubclassFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  account_class_id: z.string().uuid().optional(),
  sort_by: z.enum(['code', 'name', 'created_at']).default('code'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Account Type Schemas
export const accountTypeSchema = z.object({
  account_subclass_id: z.string().uuid('Invalid account subclass ID format'),
  code: z
    .number()
    .int()
    .min(1, 'Code must be between 1 and 99')
    .max(99, 'Code must be between 1 and 99'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  is_active: z.boolean(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
});

export const accountTypeCreateSchema = accountTypeSchema;

export const accountTypeUpdateSchema = accountTypeSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const accountTypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  account_subclass_id: z.string().uuid().optional(),
  is_system_defined: z.boolean().optional(),
  sort_by: z.enum(['code', 'name', 'created_at']).default('code'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Account Subtype Schemas
export const accountSubtypeSchema = z.object({
  account_type_id: z.string().uuid('Invalid account type ID format'),
  code: z
    .number()
    .int()
    .min(1, 'Code must be between 1 and 99')
    .max(99, 'Code must be between 1 and 99'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  is_active: z.boolean(),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
});

export const accountSubtypeCreateSchema = accountSubtypeSchema;

export const accountSubtypeUpdateSchema = accountSubtypeSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid ID format'),
  });

export const accountSubtypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  account_type_id: z.string().uuid().optional(),
  is_system_defined: z.boolean().optional(),
  sort_by: z.enum(['code', 'name', 'created_at']).default('code'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Business Type Schemas
export const businessTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
});

export const businessTypeCreateSchema = businessTypeSchema;

export const businessTypeUpdateSchema = businessTypeSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const businessTypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(['name', 'created_at']).default('name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Export types
export type AccountClassFormData = z.infer<typeof accountClassSchema>;
export type AccountClassCreateData = z.infer<typeof accountClassCreateSchema>;
export type AccountClassUpdateData = z.infer<typeof accountClassUpdateSchema>;
export type AccountClassFiltersData = z.infer<typeof accountClassFiltersSchema>;

export type AccountSubtypeFormData = z.infer<typeof accountSubtypeSchema>;
export type AccountSubtypeCreateData = z.infer<
  typeof accountSubtypeCreateSchema
>;
export type AccountSubtypeUpdateData = z.infer<
  typeof accountSubtypeUpdateSchema
>;
export type AccountSubtypeFiltersData = z.infer<
  typeof accountSubtypeFiltersSchema
>;
export type AccountSubclassFormData = z.infer<typeof accountSubclassSchema>;
export type AccountSubclassCreateData = z.infer<
  typeof accountSubclassCreateSchema
>;
export type AccountSubclassUpdateData = z.infer<
  typeof accountSubclassUpdateSchema
>;
export type AccountSubclassFiltersData = z.infer<
  typeof accountSubclassFiltersSchema
>;

export type AccountTypeFormData = z.infer<typeof accountTypeSchema>;
export type AccountTypeCreateData = z.infer<typeof accountTypeCreateSchema>;
export type AccountTypeUpdateData = z.infer<typeof accountTypeUpdateSchema>;
export type AccountTypeFiltersData = z.infer<typeof accountTypeFiltersSchema>;

export type BusinessTypeFormData = z.infer<typeof businessTypeSchema>;
export type BusinessTypeCreateData = z.infer<typeof businessTypeCreateSchema>;
export type BusinessTypeUpdateData = z.infer<typeof businessTypeUpdateSchema>;
export type BusinessTypeFiltersData = z.infer<typeof businessTypeFiltersSchema>;

// ============================================================================
// INDUSTRY TYPE SCHEMAS
// ============================================================================

export const industryTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
});

export const industryTypeCreateSchema = industryTypeSchema;

export const industryTypeUpdateSchema = industryTypeSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const industryTypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(['name', 'created_at']).default('name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type IndustryTypeFormData = z.infer<typeof industryTypeSchema>;
export type IndustryTypeCreateData = z.infer<typeof industryTypeCreateSchema>;
export type IndustryTypeUpdateData = z.infer<typeof industryTypeUpdateSchema>;
export type IndustryTypeFiltersData = z.infer<typeof industryTypeFiltersSchema>;

// ============================================================================
// TAX TYPE SCHEMAS
// ============================================================================

export const taxTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  hint: z
    .string()
    .max(200, 'Hint must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
});

export const taxTypeCreateSchema = taxTypeSchema;

export const taxTypeUpdateSchema = taxTypeSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const taxTypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(['name', 'created_at']).default('name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type TaxTypeFormData = z.infer<typeof taxTypeSchema>;
export type TaxTypeCreateData = z.infer<typeof taxTypeCreateSchema>;
export type TaxTypeUpdateData = z.infer<typeof taxTypeUpdateSchema>;
export type TaxTypeFiltersData = z.infer<typeof taxTypeFiltersSchema>;

// ============================================================================
// COA TEMPLATE SCHEMAS
// ============================================================================

export const coaTemplateSchema = z.object({
  template_name: z
    .string()
    .min(1, 'Template name is required')
    .max(200, 'Template name must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  is_default: z.boolean(),
  is_active: z.boolean(),
});

export const coaTemplateCreateSchema = coaTemplateSchema;

export const coaTemplateUpdateSchema = coaTemplateSchema.partial().extend({
  id: z.string().uuid('Invalid ID format'),
});

export const coaTemplateFiltersSchema = z.object({
  search: z.string().optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(['template_name', 'created_at']).default('template_name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export type CoaTemplateFormData = z.infer<typeof coaTemplateSchema>;
export type CoaTemplateCreateData = z.infer<typeof coaTemplateCreateSchema>;
export type CoaTemplateUpdateData = z.infer<typeof coaTemplateUpdateSchema>;
export type CoaTemplateFiltersData = z.infer<typeof coaTemplateFiltersSchema>;

// ============================================================================
// COMBINED COA TEMPLATE FORM SCHEMAS
// ============================================================================

export const coaTemplateItemFormSchema = z.object({
  id: z.string().uuid().optional(),
  account_code: z
    .string()
    .min(1, 'Account code is required')
    .regex(/^[0-9]{6}$/, 'Account code must be exactly 6 digits'),
  account_name: z
    .string()
    .min(1, 'Account name is required')
    .max(200, 'Account name must be 200 characters or less'),
  account_class_id: z.string().uuid('Invalid account class'),
  account_subclass_id: z.string().uuid('Invalid account subclass'),
  account_type_id: z.string().uuid('Invalid account type'),
  account_subtype_id: z.string().uuid('Invalid account subtype'),
  normal_balance: z.enum(['debit', 'credit']),
  is_active: z.boolean(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater'),
});

export const coaTemplateRulesFormSchema = z.object({
  tax_type_id: z
    .string()
    .refine(val => val === 'any' || z.string().uuid().safeParse(val).success, {
      message: 'Must be "any" or a valid UUID',
    })
    .optional(),
  business_type_id: z
    .string()
    .refine(val => val === 'any' || z.string().uuid().safeParse(val).success, {
      message: 'Must be "any" or a valid UUID',
    })
    .optional(),
  industry_type_id: z
    .string()
    .refine(val => val === 'any' || z.string().uuid().safeParse(val).success, {
      message: 'Must be "any" or a valid UUID',
    })
    .optional(),
});

export const coaTemplateCombinedFormSchema = z.object({
  template_name: z
    .string()
    .min(1, 'Template name is required')
    .max(200, 'Template name must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  is_default: z.boolean(),
  is_active: z.boolean(),
  rules: coaTemplateRulesFormSchema,
  items: z
    .array(coaTemplateItemFormSchema)
    .min(1, 'At least one item is required'),
});

export const coaTemplateCombinedCreateSchema = coaTemplateCombinedFormSchema;

export const coaTemplateCombinedUpdateSchema =
  coaTemplateCombinedFormSchema.extend({
    id: z.string().uuid('Invalid ID format'),
  });

export type CoaTemplateItemFormData = z.infer<typeof coaTemplateItemFormSchema>;
export type CoaTemplateRulesFormData = z.infer<
  typeof coaTemplateRulesFormSchema
>;
export type CoaTemplateCombinedFormData = z.infer<
  typeof coaTemplateCombinedFormSchema
>;
export type CoaTemplateCombinedCreateData = z.infer<
  typeof coaTemplateCombinedCreateSchema
>;
export type CoaTemplateCombinedUpdateData = z.infer<
  typeof coaTemplateCombinedUpdateSchema
>;
