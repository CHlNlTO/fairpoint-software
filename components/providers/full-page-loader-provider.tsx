// components/providers/full-page-loader-provider.tsx

'use client';

import { useFullPageLoader } from '@/hooks/use-full-page-loader';
import { FullPageLoader } from '@/components/ui/full-page-loader';
import { useEffect } from 'react';

interface FullPageLoaderProviderProps {
  children: React.ReactNode;
}

export function FullPageLoaderProvider({
  children,
}: FullPageLoaderProviderProps) {
  const { isVisible, message, variant, hide } = useFullPageLoader();

  // Auto-hide success messages after 2 seconds
  useEffect(() => {
    if (isVisible && variant === 'success') {
      const timer = setTimeout(() => {
        hide();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, variant, hide]);

  return (
    <>
      {children}
      {isVisible && <FullPageLoader message={message} variant={variant} />}
    </>
  );
}
