// components/ui/full-page-loader.tsx

'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import * as React from 'react';

interface FullPageLoaderProps {
  message?: string;
  variant?: 'default' | 'success' | 'processing';
  className?: string;
}

export function FullPageLoader({
  message = 'Processing your request...',
  variant = 'default',
  className,
}: FullPageLoaderProps) {
  const [dots, setDots] = React.useState('');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
        };
      case 'processing':
        return {
          icon: <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />,
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
        };
      default:
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          bgGradient: 'from-background to-muted/50',
          borderColor: 'border-border',
          textColor: 'text-foreground',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Floating particles - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Main loader card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'relative w-full max-w-md mx-4 p-8 rounded-2xl',
          'bg-gradient-to-br',
          styles.bgGradient,
          'border border-border/50 shadow-2xl',
          'backdrop-blur-xl',
          className
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: variant === 'success' ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            {styles.icon}
          </motion.div>

          {/* Message */}
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={cn(
                'text-xl font-semibold tracking-tight',
                styles.textColor
              )}
            >
              {message}
            </motion.h2>

            {variant === 'default' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Please wait while we process your request{dots}
              </motion.p>
            )}
          </div>

          {/* Progress indicator */}
          {variant === 'processing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full bg-muted rounded-full h-2 overflow-hidden"
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </motion.div>
          )}

          {/* Decorative elements */}
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/30"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Convenience components for common use cases
export function AuthLoader({ message }: { message?: string }) {
  return (
    <FullPageLoader
      message={message || 'Signing you in...'}
      variant="processing"
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    />
  );
}

export function SuccessLoader({ message }: { message?: string }) {
  return (
    <FullPageLoader
      message={message || 'Success!'}
      variant="success"
      className="bg-gradient-to-br from-green-50 to-emerald-50"
    />
  );
}

export function ProcessingLoader({ message }: { message?: string }) {
  return (
    <FullPageLoader
      message={message || 'Processing...'}
      variant="processing"
      className="bg-gradient-to-br from-amber-50 to-orange-50"
    />
  );
}
