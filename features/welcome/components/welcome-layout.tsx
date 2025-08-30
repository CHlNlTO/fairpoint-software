// features/welcome/components/welcome-layout.tsx

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FireworksBackground } from '@/components/animate-ui/backgrounds/fireworks';
import { cn } from '@/lib/utils';

interface WelcomeLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function WelcomeLayout({ children, className }: WelcomeLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fireworks Background */}
      <div className="absolute inset-0 z-0">
        <FireworksBackground
          population={3}
          color={['#3b82f6', '#8b5cf6', '#06b6d4']}
          fireworkSpeed={{ min: 6, max: 10 }}
          particleSpeed={{ min: 3, max: 8 }}
        />
      </div>

      {/* Content Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn(
          'relative z-10 flex min-h-screen w-full items-center justify-center p-4',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
