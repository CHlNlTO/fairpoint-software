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
