// features/business-registration/components/wizard-navigation.tsx

'use client';

import { Button } from '@/components/ui/button';
import type {
  BusinessRegistrationStep,
  WizardNavigationState,
} from '@/features/business-registration/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardNavigationProps {
  navigation: WizardNavigationState;
  onNext: () => void;
  onBack: () => void;
  onStepClick: (step: BusinessRegistrationStep) => void;
  isSubmitting?: boolean;
}

export function WizardNavigation({
  navigation,
  onNext,
  onBack,
  onStepClick,
  isSubmitting = false,
}: WizardNavigationProps) {
  const isFinalStep = navigation.currentStepIndex === navigation.totalSteps - 1;
  return (
    <div
      className="w-full px-4 py-4 md:px-2 md:py-3 rounded-xl bg-card border border-border/60 shadow-sm flex items-center justify-between gap-2 md:max-w-4xl mx-auto"
      style={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!navigation.canGoBack || isSubmitting}
        className="flex items-center gap-2 text-sm md:text-base"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Step {navigation.currentStepIndex + 1} of {navigation.totalSteps}
        </span>
      </div>

      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 text-sm md:text-base"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="hidden sm:inline">Processing...</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">
              {isFinalStep ? 'Finish' : 'Next'}
            </span>
            {isFinalStep && <span className="sm:hidden">✓</span>}
            {!isFinalStep && <ChevronRight className="h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
}
