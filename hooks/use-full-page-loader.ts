// hooks/use-full-page-loader.ts

'use client';

import { create } from 'zustand';

interface LoaderState {
  isVisible: boolean;
  message: string;
  variant: 'default' | 'success' | 'processing';
  show: (
    message?: string,
    variant?: 'default' | 'success' | 'processing'
  ) => void;
  hide: () => void;
  showSuccess: (message?: string) => void;
  showProcessing: (message?: string) => void;
}

export const useFullPageLoader = create<LoaderState>(set => ({
  isVisible: false,
  message: 'Processing your request...',
  variant: 'default',

  show: (message = 'Processing your request...', variant = 'default') => {
    set({ isVisible: true, message, variant });
  },

  hide: () => {
    set({ isVisible: false });
  },

  showSuccess: (message = 'Success!') => {
    set({ isVisible: true, message, variant: 'success' });
  },

  showProcessing: (message = 'Processing...') => {
    set({ isVisible: true, message, variant: 'processing' });
  },
}));

// Convenience hook for auth operations
export const useAuthLoader = () => {
  const { show, hide, showSuccess } = useFullPageLoader();

  return {
    showSignIn: () => show('Signing you in...', 'processing'),
    showSignUp: () => show('Creating your account...', 'processing'),
    showGoogleAuth: () => show('Authenticating with Google...', 'processing'),
    showSuccess: (message?: string) => showSuccess(message),
    hide: () => hide(),
  };
};

// Convenience hook for business operations
export const useBusinessLoader = () => {
  const { show, hide, showSuccess } = useFullPageLoader();

  return {
    showRegistration: () => show('Setting up your business...', 'processing'),
    showProcessing: () => show('Processing your request...', 'processing'),
    showSuccess: (message?: string) => showSuccess(message),
    hide: () => hide(),
  };
};
