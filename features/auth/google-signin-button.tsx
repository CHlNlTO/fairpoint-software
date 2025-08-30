"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { CredentialResponse } from "google-one-tap";
import { isNewlyCreatedUser, getAuthProvider } from "@/lib/utils";

interface GoogleSignInButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function GoogleSignInButton({
  className,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Load Google client library
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !buttonRef.current) return;

    // Generate nonce for security
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);

    crypto.subtle.digest('SHA-256', encodedNonce).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        nonce: hashedNonce,
        use_fedcm_for_prompt: false, // Disable FedCM to avoid network errors
      });

      // Render the Google sign-in button
      window.google.accounts.id.renderButton(buttonRef.current!, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonRef.current!.offsetWidth,
      });
    });
  };

  const handleCredentialResponse = async (response: CredentialResponse) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error('Google sign-in error:', error);
        return;
      }

      if (data.user) {
        // Check if this is a new user
        const isNewUser = isNewlyCreatedUser(data.user);
        const authProvider = getAuthProvider(data.user);

        if (isNewUser) {
          console.log(`New user signed up via ${authProvider}`);
          // Redirect to welcome page for new users
          router.push('/welcome');
        } else {
          // Existing user, redirect to dashboard
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <div className={className}>
      <div ref={buttonRef} className="w-full" />
    </div>
  );
}
