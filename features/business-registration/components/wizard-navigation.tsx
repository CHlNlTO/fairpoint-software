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
      className="w-full px-2 py-3 rounded-xl bg-background/70 border border-border/60 shadow-sm flex items-center justify-between gap-2"
      style={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!navigation.canGoBack || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Step {navigation.currentStepIndex + 1} of {navigation.totalSteps}
        </span>
      </div>

      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            {isFinalStep ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
