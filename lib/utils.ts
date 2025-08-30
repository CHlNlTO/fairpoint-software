import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { AuthProvider, User } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

/**
 * Check if a Supabase user is newly created by comparing timestamps
 * @param user - Supabase user object
 * @param thresholdMs - Time threshold in milliseconds (default: 5000ms = 5 seconds)
 * @returns boolean indicating if user is newly created
 */
export function isNewlyCreatedUser(user: any, thresholdMs: number = 5000): boolean {
  if (!user?.created_at || !user?.last_sign_in_at) {
    return false;
  }

  const createdAt = new Date(user.created_at);
  const lastSignInAt = new Date(user.last_sign_in_at);

  // If created_at and last_sign_in_at are very close (within threshold),
  // the user is likely newly created
  const timeDifference = Math.abs(createdAt.getTime() - lastSignInAt.getTime());
  return timeDifference < thresholdMs;
}

/**
 * Get the authentication provider used by the user
 * @param user - Supabase user object
 * @returns string indicating the auth provider
 */
export function getAuthProvider(user: any): AuthProvider {
  if (!user?.identities || user.identities.length === 0) {
    return 'email_password';
  }

  // Check the first identity (most recent)
  const identity = user.identities[0];

  if (identity.provider === 'google') {
    return 'google';
  } else if (identity.provider === 'email') {
    return 'email_password';
  }

  return 'unknown';
}

/**
 * Extract user information from Supabase auth claims
 * @param claims - Supabase auth claims object
 * @returns User object with extracted information
 */
export function extractUserFromClaims(claims: any): User {
  const userMetadata = claims.user_metadata || {};
  const firstName = userMetadata.name || userMetadata.first_name || userMetadata.full_name?.split(' ')[0] || 'User';

  return {
    id: claims.sub || claims.user_id || '',
    firstName,
    lastName: userMetadata.last_name || userMetadata.full_name?.split(' ').slice(1).join(' '),
    email: claims.email || '',
    avatar: userMetadata.avatar_url || userMetadata.picture || '/avatars/accountant.jpg',
    isNewUser: true, // This will be determined by business logic
    createdAt: new Date(claims.iat ? claims.iat * 1000 : Date.now()),
    updatedAt: new Date(),
  };
}
