// features/welcome/components/welcome-page.tsx

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWelcomeRedirect } from '../hooks/use-welcome-redirect';
import type { WelcomePageProps } from '../lib/types';
import Image from 'next/image';

export function WelcomePage({ user }: WelcomePageProps) {
  const { skipWelcome, redirectToBusinessRegistration } = useWelcomeRedirect();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
    >
      {/* Main Heading with Party Popper */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* <span className="text-4xl">🎉</span> */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome aboard, {user.firstName}!
          </h1>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed"
      >
        Just tell us a bit about your business, and we'll handle the rest. Simple, guided, and stress-free.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10 mb-16 w-full max-w-lg"
      >
        <Button
          variant="ghost"
          onClick={skipWelcome}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-base px-6 py-2 sm:ml-2"
        >
          Skip for now
        </Button>
        <Button
          onClick={redirectToBusinessRegistration}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Finish your profile
        </Button>
      </motion.div>

      {/* Logo */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center mb-2">
          <Image src="/logo.png" alt="FairPoint" width={1000} height={1000} className='w-1/3' />
        </div>
      </motion.div>
    </motion.div>
  );
}
