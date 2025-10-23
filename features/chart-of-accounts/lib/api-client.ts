// features/chart-of-accounts/lib/api-client.ts

import type {
  AccountClass,
  AccountClassCreateRequest,
  AccountClassDeleteRequest,
  AccountClassFilters,
  AccountClassUpdateRequest,
  AccountSubclass,
  AccountSubclassCreateRequest,
  AccountSubclassDeleteRequest,
  AccountSubclassFilters,
  AccountSubclassUpdateRequest,
  AccountSubtype,
  AccountSubtypeCreateRequest,
  AccountSubtypeDeleteRequest,
  AccountSubtypeFilters,
  AccountSubtypeUpdateRequest,
  AccountType,
  AccountTypeCreateRequest,
  AccountTypeDeleteRequest,
  AccountTypeFilters,
  AccountTypeUpdateRequest,
  ApiResponse,
  BusinessType,
  BusinessTypeCreateRequest,
  BusinessTypeDeleteRequest,
  BusinessTypeFilters,
  BusinessTypeUpdateRequest,
  CoaTemplate,
  CoaTemplateCreateRequest,
  CoaTemplateDeleteRequest,
  CoaTemplateFilters,
  CoaTemplateItem,
  CoaTemplateItemFilters,
  CoaTemplateUpdateRequest,
  IndustryType,
  IndustryTypeCreateRequest,
  IndustryTypeDeleteRequest,
  IndustryTypeFilters,
  IndustryTypeUpdateRequest,
  TaxType,
  TaxTypeCreateRequest,
  TaxTypeDeleteRequest,
  TaxTypeFilters,
  TaxTypeUpdateRequest,
} from './types';

const ACCOUNTS_API_BASE_URL = '/api/accounts';
const TYPES_API_BASE_URL = '/api/types';
const COA_API_BASE_URL = '/api/chart-of-accounts';

/**
 * Fetch all account classes with optional filters
 */
export async function fetchAccountClasses(
  filters?: AccountClassFilters
): Promise<AccountClass[]> {
  const searchParams = new URLSearchParams();

  // Only send search filter to API - sorting and other filters are handled client-side
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }

  const url = `${ACCOUNTS_API_BASE_URL}/classes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountClass[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single account class by ID
 */
export async function fetchAccountClass(id: string): Promise<AccountClass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/classes?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountClass> = await response.json();
  return result.data;
}

/**
 * Create a new account class
 */
export async function createAccountClass(
  data: AccountClassCreateRequest
): Promise<AccountClass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountClass> = await response.json();
  return result.data;
}

/**
 * Update an existing account class
 */
export async function updateAccountClass(
  data: AccountClassUpdateRequest
): Promise<AccountClass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/classes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountClass> = await response.json();
  return result.data;
}

/**
 * Delete an account class
 */
export async function deleteAccountClass(
  data: AccountClassDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${ACCOUNTS_API_BASE_URL}/classes?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// ACCOUNT SUBCLASS API FUNCTIONS
// ============================================================================

/**
 * Fetch all account subclasses with optional filters
 */
export async function fetchAccountSubclasses(
  filters?: AccountSubclassFilters
): Promise<AccountSubclass[]> {
  const searchParams = new URLSearchParams();

  // Only send search filter to API - sorting and other filters are handled client-side
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }

  const url = `${ACCOUNTS_API_BASE_URL}/subclasses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubclass[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single account subclass by ID
 */
export async function fetchAccountSubclass(
  id: string
): Promise<AccountSubclass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subclasses?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubclass> = await response.json();
  return result.data;
}

/**
 * Create a new account subclass
 */
export async function createAccountSubclass(
  data: AccountSubclassCreateRequest
): Promise<AccountSubclass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subclasses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubclass> = await response.json();
  return result.data;
}

/**
 * Update an existing account subclass
 */
export async function updateAccountSubclass(
  data: AccountSubclassUpdateRequest
): Promise<AccountSubclass> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subclasses`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubclass> = await response.json();
  return result.data;
}

/**
 * Delete an account subclass
 */
export async function deleteAccountSubclass(
  data: AccountSubclassDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${ACCOUNTS_API_BASE_URL}/subclasses?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// ACCOUNT TYPE API FUNCTIONS
// ============================================================================

/**
 * Fetch all account types with optional filters
 */
export async function fetchAccountTypes(
  filters?: AccountTypeFilters
): Promise<AccountType[]> {
  const searchParams = new URLSearchParams();
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }
  const url = `${ACCOUNTS_API_BASE_URL}/types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountType[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single account type by ID
 */
export async function fetchAccountType(id: string): Promise<AccountType> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/types?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountType> = await response.json();
  return result.data;
}

/**
 * Create a new account type
 */
export async function createAccountType(
  data: AccountTypeCreateRequest
): Promise<AccountType> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountType> = await response.json();
  return result.data;
}

/**
 * Update an existing account type
 */
export async function updateAccountType(
  data: AccountTypeUpdateRequest
): Promise<AccountType> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/types`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountType> = await response.json();
  return result.data;
}

/**
 * Delete an account type
 */
export async function deleteAccountType(
  data: AccountTypeDeleteRequest
): Promise<void> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/types?id=${data.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// ACCOUNT SUBTYPE API FUNCTIONS
// ============================================================================

/**
 * Fetch all account subtypes with optional filters
 */
export async function fetchAccountSubtypes(
  filters?: AccountSubtypeFilters
): Promise<AccountSubtype[]> {
  const searchParams = new URLSearchParams();
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }
  const url = `${ACCOUNTS_API_BASE_URL}/subtypes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubtype[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single account subtype by ID
 */
export async function fetchAccountSubtype(id: string): Promise<AccountSubtype> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subtypes?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubtype> = await response.json();
  return result.data;
}

/**
 * Create a new account subtype
 */
export async function createAccountSubtype(
  data: AccountSubtypeCreateRequest
): Promise<AccountSubtype> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subtypes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubtype> = await response.json();
  return result.data;
}

/**
 * Update an existing account subtype
 */
export async function updateAccountSubtype(
  data: AccountSubtypeUpdateRequest
): Promise<AccountSubtype> {
  const response = await fetch(`${ACCOUNTS_API_BASE_URL}/subtypes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<AccountSubtype> = await response.json();
  return result.data;
}

/**
 * Delete an account subtype
 */
export async function deleteAccountSubtype(
  data: AccountSubtypeDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${ACCOUNTS_API_BASE_URL}/subtypes?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// BUSINESS TYPES API FUNCTIONS
// ============================================================================

/**
 * Fetch all business types with optional filters
 */
export async function fetchBusinessTypes(
  filters?: BusinessTypeFilters
): Promise<BusinessType[]> {
  const searchParams = new URLSearchParams();

  // Only send search filter to API - sorting and other filters are handled client-side
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }

  const url = `${TYPES_API_BASE_URL}/business-types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<BusinessType[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single business type by ID
 */
export async function fetchBusinessType(id: string): Promise<BusinessType> {
  const response = await fetch(
    `${TYPES_API_BASE_URL}/business-types?id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<BusinessType> = await response.json();
  return result.data;
}

/**
 * Create a new business type
 */
export async function createBusinessType(
  data: BusinessTypeCreateRequest
): Promise<BusinessType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/business-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<BusinessType> = await response.json();
  return result.data;
}

/**
 * Update an existing business type
 */
export async function updateBusinessType(
  data: BusinessTypeUpdateRequest
): Promise<BusinessType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/business-types`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<BusinessType> = await response.json();
  return result.data;
}

/**
 * Delete a business type
 */
export async function deleteBusinessType(
  data: BusinessTypeDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${TYPES_API_BASE_URL}/business-types?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// INDUSTRY TYPES API FUNCTIONS
// ============================================================================

/**
 * Fetch all industry types with optional filters
 */
export async function fetchIndustryTypes(
  filters?: IndustryTypeFilters
): Promise<IndustryType[]> {
  const searchParams = new URLSearchParams();
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }
  const url = `${TYPES_API_BASE_URL}/industry-types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<IndustryType[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single industry type by ID
 */
export async function fetchIndustryType(id: string): Promise<IndustryType> {
  const response = await fetch(
    `${TYPES_API_BASE_URL}/industry-types?id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<IndustryType> = await response.json();
  return result.data;
}

/**
 * Create a new industry type
 */
export async function createIndustryType(
  data: IndustryTypeCreateRequest
): Promise<IndustryType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/industry-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<IndustryType> = await response.json();
  return result.data;
}

/**
 * Update an existing industry type
 */
export async function updateIndustryType(
  data: IndustryTypeUpdateRequest
): Promise<IndustryType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/industry-types`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<IndustryType> = await response.json();
  return result.data;
}

/**
 * Delete an industry type
 */
export async function deleteIndustryType(
  data: IndustryTypeDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${TYPES_API_BASE_URL}/industry-types?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// TAX TYPES API FUNCTIONS
// ============================================================================

/**
 * Fetch all tax types with optional filters
 */
export async function fetchTaxTypes(
  filters?: TaxTypeFilters
): Promise<TaxType[]> {
  const searchParams = new URLSearchParams();
  if (filters?.search) {
    searchParams.append('search', filters.search);
  }
  const url = `${TYPES_API_BASE_URL}/tax-types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TaxType[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single tax type by ID
 */
export async function fetchTaxType(id: string): Promise<TaxType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/tax-types?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TaxType> = await response.json();
  return result.data;
}

/**
 * Create a new tax type
 */
export async function createTaxType(
  data: TaxTypeCreateRequest
): Promise<TaxType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/tax-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TaxType> = await response.json();
  return result.data;
}

/**
 * Update an existing tax type
 */
export async function updateTaxType(
  data: TaxTypeUpdateRequest
): Promise<TaxType> {
  const response = await fetch(`${TYPES_API_BASE_URL}/tax-types`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<TaxType> = await response.json();
  return result.data;
}

/**
 * Delete a tax type
 */
export async function deleteTaxType(data: TaxTypeDeleteRequest): Promise<void> {
  const response = await fetch(
    `${TYPES_API_BASE_URL}/tax-types?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// COA TEMPLATES API FUNCTIONS
// ============================================================================

/**
 * Fetch all COA templates with optional filters
 */
export async function fetchCoaTemplates(
  filters?: CoaTemplateFilters
): Promise<CoaTemplate[]> {
  const searchParams = new URLSearchParams();
  if (filters?.search) {
    searchParams.append('template_name', filters.search);
  }
  if (filters?.is_default !== undefined) {
    searchParams.append('is_default', filters.is_default.toString());
  }
  if (filters?.is_active !== undefined) {
    searchParams.append('is_active', filters.is_active.toString());
  }
  const url = `${COA_API_BASE_URL}/coa-templates${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<CoaTemplate[]> = await response.json();
  return result.data;
}

/**
 * Fetch a single COA template by ID
 */
export async function fetchCoaTemplate(id: string): Promise<CoaTemplate> {
  const response = await fetch(`${COA_API_BASE_URL}/coa-templates?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<CoaTemplate> = await response.json();
  return result.data;
}

/**
 * Create a new COA template
 */
export async function createCoaTemplate(
  data: CoaTemplateCreateRequest
): Promise<CoaTemplate> {
  const response = await fetch(`${COA_API_BASE_URL}/coa-templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<CoaTemplate> = await response.json();
  return result.data;
}

/**
 * Update an existing COA template
 */
export async function updateCoaTemplate(
  data: CoaTemplateUpdateRequest
): Promise<CoaTemplate> {
  const response = await fetch(`${COA_API_BASE_URL}/coa-templates`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<CoaTemplate> = await response.json();
  return result.data;
}

/**
 * Delete a COA template
 */
export async function deleteCoaTemplate(
  data: CoaTemplateDeleteRequest
): Promise<void> {
  const response = await fetch(
    `${COA_API_BASE_URL}/coa-templates?id=${data.id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<{ message: string }> = await response.json();
  return;
}

// ============================================================================
// COA TEMPLATE ITEMS API FUNCTIONS
// ============================================================================

/**
 * Fetch all COA template items with optional filters
 */
export async function fetchCoaTemplateItems(
  filters?: CoaTemplateItemFilters
): Promise<CoaTemplateItem[]> {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.template_id) {
    params.append('template_id', filters.template_id);
  }
  if (filters?.is_active !== undefined) {
    params.append('is_active', filters.is_active.toString());
  }
  if (filters?.normal_balance) {
    params.append('normal_balance', filters.normal_balance);
  }
  if (filters?.sort_by) {
    params.append('sort_by', filters.sort_by);
  }
  if (filters?.sort_order) {
    params.append('sort_order', filters.sort_order);
  }

  const response = await fetch(
    `${COA_API_BASE_URL}/template-items?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const result: ApiResponse<CoaTemplateItem[]> = await response.json();
  return result.data;
}
