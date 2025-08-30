'use client';

import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import type { accounts, CredentialResponse } from 'google-one-tap';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNewlyCreatedUser, getAuthProvider } from '@/lib/utils';
import { useAuthLoader } from '@/hooks/use-full-page-loader';

declare const google: { accounts: accounts };

// generate nonce to use for google id token sign-in
const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return [nonce, hashedNonce];
};

const GoogleOneTap = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const { showGoogleAuth, hide, showSuccess } = useAuthLoader();

  const initializeGoogleOneTap = async () => {
    // Prevent multiple initializations
    if (isInitialized) return;

    console.log('Initializing Google One Tap');
    const [nonce, hashedNonce] = await generateNonce();
    console.log('Nonce: ', nonce, hashedNonce);

    // check if there's already an existing session before initializing the one-tap UI
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session', error);
    }

    // If user is authenticated, only redirect if they're on a public route
    if (data.session) {
      // Don't redirect if already on a protected route
      if (pathname === '/' || pathname.startsWith('/auth')) {
        router.push('/dashboard');
      }
      return;
    }

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: CredentialResponse) => {
        try {
          // Show the loader immediately
          showGoogleAuth();

          // send id token returned in response.credential to supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          });

          if (error) throw error;
          console.log('Session data: ', data);
          console.log('Successfully logged in with Google One Tap');

          if (data.user) {
            // Check if this is a new user
            const isNewUser = isNewlyCreatedUser(data.user);
            const authProvider = getAuthProvider(data.user);

            if (isNewUser) {
              console.log(`New user signed up via ${authProvider}`);
              // Show success message briefly before redirect
              showSuccess('Welcome! Setting up your account...');
              // Redirect to welcome page for new users
              setTimeout(() => {
                router.push('/welcome');
              }, 1500);
            } else {
              // Show success message briefly before redirect
              showSuccess('Welcome back!');
              // Existing user, redirect to dashboard
              setTimeout(() => {
                router.push('/dashboard');
              }, 1000);
            }
          }
        } catch (error) {
          console.error('Error logging in with Google One Tap', error);
          hide(); // Hide loader on error
        }
      },
      nonce: hashedNonce,
      // Disable FedCM to avoid network errors in development
      use_fedcm_for_prompt: false,
      // Add additional options for better compatibility
      auto_select: false,
      itp_support: true,
      cancel_on_tap_outside: true,
    });

    // Add a small delay before prompting to ensure everything is initialized
    setTimeout(() => {
      google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed()) {
          console.log(
            'One Tap not displayed:',
            notification.getDismissedReason()
          );
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap skipped:', notification.getMomentType());
        }
      });
    }, 1000);

    setIsInitialized(true);
  };

  // Only initialize on public routes to avoid unnecessary redirects
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/auth')) {
      initializeGoogleOneTap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Wrap the async function so onReady gets a sync function (to fix type error)
  const handleScriptReady = () => {
    // Only initialize if we're on a public route
    if (pathname === '/' || pathname.startsWith('/auth')) {
      initializeGoogleOneTap();
    }
  };

  return (
    <Script
      onReady={handleScriptReady}
      src="https://accounts.google.com/gsi/client"
    />
  );
};

export default GoogleOneTap;
