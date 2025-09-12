// features/business-registration/components/wizard-navigation.tsx

'use client';

import { Button } from '@/components/ui/button';
import type {
  BusinessRegistrationStep,
  WizardNavigationState,
} from '@/features/business-registration/lib/types';
import { useFullPageLoader } from '@/hooks/use-full-page-loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const { showProcessing, hide } = useFullPageLoader();
  const isFirstStep = navigation.currentStepIndex === 0;
  const isFinalStep = navigation.currentStepIndex === navigation.totalSteps - 1;

  const handleBackClick = () => {
    if (isFirstStep) {
      showProcessing('Returning to dashboard...');
      router.push('/dashboard');
      // Hide loader after a short delay to ensure navigation completes
      setTimeout(() => hide(), 1000);
    } else {
      onBack();
    }
  };

  return (
    <div
      className={`
        w-full flex items-center justify-between gap-2 px-4 py-4
        md:px-2 md:py-3 md:rounded-xl md:bg-card md:border md:border-border/60 md:shadow-sm
        md:max-w-4xl mx-auto
      `}
      style={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <Button
        variant="secondary"
        onClick={handleBackClick}
        disabled={isSubmitting}
        className="flex items-center gap-2 text-sm md:text-base bg-card"
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
