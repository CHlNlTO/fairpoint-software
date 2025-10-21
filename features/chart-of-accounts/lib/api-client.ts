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
} from './types';

const API_BASE_URL = '/api/accounts';

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

  const url = `${API_BASE_URL}/classes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

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
  const response = await fetch(`${API_BASE_URL}/classes?id=${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/classes`, {
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
  const response = await fetch(`${API_BASE_URL}/classes`, {
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
  const response = await fetch(`${API_BASE_URL}/classes?id=${data.id}`, {
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

  const url = `${API_BASE_URL}/subclasses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

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
  const response = await fetch(`${API_BASE_URL}/subclasses?id=${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/subclasses`, {
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
  const response = await fetch(`${API_BASE_URL}/subclasses`, {
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
  const response = await fetch(`${API_BASE_URL}/subclasses?id=${data.id}`, {
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
  const url = `${API_BASE_URL}/types${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
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
  const response = await fetch(`${API_BASE_URL}/types?id=${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/types`, {
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
  const response = await fetch(`${API_BASE_URL}/types`, {
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
  const response = await fetch(`${API_BASE_URL}/types?id=${data.id}`, {
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
  const url = `${API_BASE_URL}/subtypes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
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
  const response = await fetch(`${API_BASE_URL}/subtypes?id=${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/subtypes`, {
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
  const response = await fetch(`${API_BASE_URL}/subtypes`, {
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
  const response = await fetch(`${API_BASE_URL}/subtypes?id=${data.id}`, {
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
