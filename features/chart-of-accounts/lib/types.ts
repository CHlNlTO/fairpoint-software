// features/chart-of-accounts/lib/types.ts

export interface AccountClass {
  id: string;
  code: number;
  name: string;
  normal_balance: 'debit' | 'credit';
  is_active: boolean;
  description?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountSubclass {
  id: string;
  account_class_id: string;
  code: number;
  name: string;
  is_active: boolean;
  description?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  account_class?: AccountClass;
}

export interface AccountType {
  id: string;
  account_subclass_id: string;
  user_id?: string;
  business_registration_id?: string;
  name: string;
  code: number;
  is_active: boolean;
  is_system_defined: boolean;
  description?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  account_subclass?: AccountSubclass;
}

export interface AccountSubtype {
  id: string;
  account_type_id: string;
  user_id?: string;
  business_registration_id?: string;
  name: string;
  code: number;
  is_active: boolean;
  is_system_defined: boolean;
  description?: string;
  hint?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  account_type?: AccountType;
}

export interface AccountClassFormData {
  code: number;
  name: string;
  normal_balance: 'debit' | 'credit';
  is_active: boolean;
  description?: string;
  hint?: string;
}

export interface AccountTypeFormData {
  account_subclass_id: string;
  code: number;
  name: string;
  is_active: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubtypeFormData {
  account_type_id: string;
  code: number;
  name: string;
  is_active: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubclassFormData {
  account_class_id: string;
  code: number;
  name: string;
  is_active: boolean;
  description?: string;
  hint?: string;
}

export interface AccountClassFilters {
  search?: string;
  is_active?: boolean;
  normal_balance?: 'debit' | 'credit';
  sort_by?: 'code' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AccountSubclassFilters {
  search?: string;
  is_active?: boolean;
  account_class_id?: string;
  sort_by?: 'code' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AccountTypeFilters {
  search?: string;
  is_active?: boolean;
  account_subclass_id?: string;
  is_system_defined?: boolean;
  sort_by?: 'code' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AccountSubtypeFilters {
  search?: string;
  is_active?: boolean;
  account_type_id?: string;
  is_system_defined?: boolean;
  sort_by?: 'code' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AccountSubtypeCreateRequest {
  account_type_id: string;
  code: number;
  name: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubtypeUpdateRequest {
  id: string;
  account_type_id?: string;
  code?: number;
  name?: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubtypeDeleteRequest {
  id: string;
}

export interface AccountClassCreateRequest {
  code: number;
  name: string;
  normal_balance: 'debit' | 'credit';
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountClassUpdateRequest {
  id: string;
  code?: number;
  name?: string;
  normal_balance?: 'debit' | 'credit';
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountClassDeleteRequest {
  id: string;
}

export interface AccountSubclassCreateRequest {
  account_class_id: string;
  code: number;
  name: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubclassUpdateRequest {
  id: string;
  account_class_id?: string;
  code?: number;
  name?: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountSubclassDeleteRequest {
  id: string;
}

export interface AccountTypeCreateRequest {
  account_subclass_id: string;
  code: number;
  name: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountTypeUpdateRequest {
  id: string;
  account_subclass_id?: string;
  code?: number;
  name?: string;
  is_active?: boolean;
  description?: string;
  hint?: string;
}

export interface AccountTypeDeleteRequest {
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
