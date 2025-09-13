// lib/types.ts

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatar?: string;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  address?: string;
  phone?: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// New types for auth system
export type AuthProvider =
  | 'google'
  | 'email_password'
  | 'github'
  | 'microsoft'
  | 'apple'
  | 'unknown';

export interface AuthUserInfo {
  isNewUser: boolean;
  authProvider: AuthProvider;
  signupMethod: string;
  createdAt: Date;
  lastSignInAt: Date;
}

// Business types for the businesses page
export interface BusinessAddress {
  barangayPsgc: string;
  streetAddress?: string;
  buildingName?: string;
  unitNumber?: string;
  postalCode?: string;
}

export interface BusinessTaxInfo {
  type?: string;
  exempt?: boolean;
}

export interface BusinessFiscalYear {
  id: string;
  name: string;
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  tin: string;
  types: string[];
  structure: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  address: BusinessAddress;
  taxInfo: BusinessTaxInfo;
  fiscalYear: BusinessFiscalYear;
}

export interface BusinessesResponse {
  businesses: Business[];
}
