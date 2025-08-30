// features/welcome/hooks/use-welcome-redirect.ts

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

const WELCOME_COMPLETED_KEY = 'welcome-completed';

export function useWelcomeRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasCompletedWelcome] = useLocalStorage(WELCOME_COMPLETED_KEY, false);

  const markWelcomeCompleted = () => {
    localStorage.setItem(WELCOME_COMPLETED_KEY, 'true');
  };

  const redirectToDashboard = () => {
    markWelcomeCompleted();
    router.push('/dashboard');
  };

  const redirectToBusinessRegistration = () => {
    markWelcomeCompleted();
    router.push('/business-registration');
  };

  const skipWelcome = () => {
    markWelcomeCompleted();
    router.push('/dashboard');
  };

  // Check if user should be redirected to welcome page
  const shouldRedirectToWelcome = (isNewUser: boolean) => {
    if (!isNewUser) return false;
    if (hasCompletedWelcome) return false;
    if (pathname === '/welcome') return false;
    return true;
  };

  // Auto-redirect to welcome if needed
  useEffect(() => {
    // This will be called by the parent component when user data is available
  }, [hasCompletedWelcome, pathname]);

  return {
    hasCompletedWelcome,
    shouldRedirectToWelcome,
    redirectToDashboard,
    redirectToBusinessRegistration,
    skipWelcome,
  };
}
