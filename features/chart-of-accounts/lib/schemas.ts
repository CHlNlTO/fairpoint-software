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
