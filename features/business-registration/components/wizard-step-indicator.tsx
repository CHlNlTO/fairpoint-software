// features/business-registration/components/wizard-step-indicator.tsx

'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { STEP_ORDER, WIZARD_STEPS } from '../lib/constants';
import type { BusinessRegistrationStep } from '../lib/types';

interface WizardStepIndicatorProps {
  currentStep: BusinessRegistrationStep;
  completedSteps: BusinessRegistrationStep[];
  onStepClick?: (step: BusinessRegistrationStep) => void;
  className?: string;
}

export function WizardStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: WizardStepIndicatorProps) {
  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-center space-x-2 md:space-x-4">
        {WIZARD_STEPS.map((step, stepIndex) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = stepIndex > currentStepIndex && !isCompleted;
          const isClickable = stepIndex <= currentStepIndex || isCompleted;

          return (
            <li key={step.id} className="relative flex items-center">
              {/* Step Circle */}
              <button
                type="button"
                disabled={!isClickable || !onStepClick}
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={cn(
                  'relative flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                  'h-10 w-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square', // Ensures perfect circle
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isCompleted && 'bg-primary text-primary-foreground shadow-sm',
                  isCurrent &&
                    'bg-primary/10 border-2 border-primary text-primary',
                  isUpcoming &&
                    'bg-muted border-2 border-muted-foreground/20 text-muted-foreground',
                  isClickable &&
                    onStepClick &&
                    'hover:scale-105 cursor-pointer',
                  !isClickable && 'cursor-not-allowed'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <span>{stepIndex + 1}</span>
                )}

                {/* Current step ring animation */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.3 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 1,
                    }}
                  />
                )}
              </button>

              {/* Step Label - Hidden on mobile, shown on larger screens */}
              <div className="hidden md:block ml-3 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isCompleted && 'text-primary',
                    isCurrent && 'text-primary',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    'text-xs transition-colors duration-200',
                    isCompleted && 'text-muted-foreground',
                    isCurrent && 'text-muted-foreground',
                    isUpcoming && 'text-muted-foreground/60'
                  )}
                >
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {stepIndex < WIZARD_STEPS.length - 1 && (
                <div className="hidden md:block relative ml-6">
                  <div
                    className={cn(
                      'h-px w-12 transition-colors duration-300',
                      stepIndex < currentStepIndex || isCompleted
                        ? 'bg-primary'
                        : 'bg-muted-foreground/20'
                    )}
                  />

                  {/* Animated progress line for current step */}
                  {stepIndex === currentStepIndex - 1 && (
                    <motion.div
                      className="absolute inset-0 h-px bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      style={{ originX: 0 }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile Step Counter */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {WIZARD_STEPS.length}
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {WIZARD_STEPS[currentStepIndex]?.title}
        </p>
      </div>
    </nav>
  );
}
