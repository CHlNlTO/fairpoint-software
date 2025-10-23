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

export interface BusinessType {
  id: string;
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface BusinessTypeFormData {
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
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

export interface BusinessTypeFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'created_at';
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

export interface BusinessTypeCreateRequest {
  name: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface BusinessTypeUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface BusinessTypeDeleteRequest {
  id: string;
}

// ============================================================================
// INDUSTRY TYPE INTERFACES
// ============================================================================

export interface IndustryType {
  id: string;
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IndustryTypeFormData {
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
}

export interface IndustryTypeFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface IndustryTypeCreateRequest {
  name: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface IndustryTypeUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface IndustryTypeDeleteRequest {
  id: string;
}

// ============================================================================
// TAX TYPE INTERFACES
// ============================================================================

export interface TaxType {
  id: string;
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxTypeFormData {
  name: string;
  description?: string;
  hint?: string;
  is_active: boolean;
}

export interface TaxTypeFilters {
  search?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface TaxTypeCreateRequest {
  name: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface TaxTypeUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  hint?: string;
  is_active?: boolean;
}

export interface TaxTypeDeleteRequest {
  id: string;
}

// ============================================================================
// COA TEMPLATE INTERFACES
// ============================================================================

export interface CoaTemplate {
  id: string;
  template_name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoaTemplateFormData {
  template_name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
}

export interface CoaTemplateFilters {
  search?: string;
  is_default?: boolean;
  is_active?: boolean;
  sort_by?: 'template_name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface CoaTemplateCreateRequest {
  template_name: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface CoaTemplateUpdateRequest {
  id: string;
  template_name?: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface CoaTemplateDeleteRequest {
  id: string;
}

// ============================================================================
// COMBINED COA TEMPLATE FORM INTERFACES
// ============================================================================

export interface CoaTemplateItemFormData {
  id?: string; // For editing existing items
  account_code: string;
  account_name: string;
  account_class_id: string;
  account_subclass_id: string;
  account_type_id: string;
  account_subtype_id: string;
  normal_balance: 'debit' | 'credit';
  is_active: boolean;
  sort_order: number;
}

export interface CoaTemplateRulesFormData {
  tax_type_id?: string;
  business_type_id?: string;
  industry_type_id?: string;
}

export interface CoaTemplateCombinedFormData {
  template_name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  rules: CoaTemplateRulesFormData;
  items: CoaTemplateItemFormData[];
}

export interface CoaTemplateCombinedCreateRequest {
  template_name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  rules: CoaTemplateRulesFormData;
  items: Omit<CoaTemplateItemFormData, 'id'>[];
}

export interface CoaTemplateCombinedUpdateRequest {
  id: string;
  template_name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  rules: CoaTemplateRulesFormData;
  items: CoaTemplateItemFormData[];
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

// ============================================================================
// COA TEMPLATE ITEMS TABLE INTERFACES
// ============================================================================

export interface CoaTemplateItem {
  id: string;
  template_id: string;
  account_code: string;
  account_name: string;
  account_subtype_id: string;
  normal_balance: 'debit' | 'credit';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  template?: {
    id: string;
    template_name: string;
  };
  account_subtype?: {
    id: string;
    name: string;
    code: string;
    account_type?: {
      id: string;
      name: string;
      code: string;
      account_subclass?: {
        id: string;
        name: string;
        code: string;
        account_class?: {
          id: string;
          name: string;
          code: string;
        };
      };
    };
  };
}

export interface CoaTemplateItemFilters {
  search?: string;
  template_id?: string;
  is_active?: boolean;
  normal_balance?: 'debit' | 'credit';
  sort_by?:
    | 'template_name'
    | 'account_code'
    | 'account_name'
    | 'sort_order'
    | 'created_at';
  sort_order?: 'asc' | 'desc';
}
