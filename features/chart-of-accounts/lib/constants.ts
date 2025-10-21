// features/chart-of-accounts/lib/constants.ts

export const ACCOUNT_SUBTYPE_SORT_OPTIONS = [
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
] as const;

export const ACCOUNT_SUBTYPE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
] as const;

export const ACCOUNT_SUBTYPE_SYSTEM_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'system', label: 'System Defined' },
  { value: 'user', label: 'User Defined' },
] as const;

export const NORMAL_BALANCE_OPTIONS = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Credit' },
] as const;

export const ACCOUNT_CLASS_SORT_OPTIONS = [
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
] as const;

export const ACCOUNT_SUBCLASS_SORT_OPTIONS = [
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

export const ACCOUNT_CLASS_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
] as const;

export const ACCOUNT_SUBCLASS_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
] as const;

export const ACCOUNT_TYPE_SORT_OPTIONS = [
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
] as const;

export const ACCOUNT_TYPE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
] as const;

export const ACCOUNT_TYPE_SYSTEM_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'system', label: 'System Defined' },
  { value: 'user', label: 'User Defined' },
] as const;

export const TABLE_PAGE_SIZE = 10;
export const TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
