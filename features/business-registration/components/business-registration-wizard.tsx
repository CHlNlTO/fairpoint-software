// features/business-registration/components/business-registration-wizard.tsx

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useWizardNavigation } from '@/features/business-registration/hooks/use-wizard-navigation';
import { WizardNavigation } from './wizard-navigation';
import { WizardStepIndicator } from './wizard-step-indicator';

import { useBusinessRegistration } from '@/features/business-registration/hooks/use-business-registration';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';

import { BasicInfoStep } from '@/features/business-registration/components/steps/basic-info-step';
import { BusinessCategoriesStep } from '@/features/business-registration/components/steps/business-categories-step';
import { BusinessStructureStep } from '@/features/business-registration/components/steps/business-structure-step';
import { ChartOfAccountsStep } from '@/features/business-registration/components/steps/chart-of-accounts-step';
import { FiscalYearStep } from '@/features/business-registration/components/steps/fiscal-year-step';
import { GovernmentCredentialsStep } from '@/features/business-registration/components/steps/government-credentials-step';
import { TaxTypeInformationStep } from '@/features/business-registration/components/steps/tax-type-information-step';

interface BusinessRegistrationWizardProps {
  onComplete?: (data: BusinessRegistrationData) => void;
  onCancel?: () => void;
  className?: string;
}

export function BusinessRegistrationWizard({
  onComplete,
  onCancel,
  className,
}: BusinessRegistrationWizardProps) {
  const {
    data,
    actions: { updateData, submitRegistration },
    submission,
  } = useBusinessRegistration({
    onSuccess: onComplete,
  });

  const {
    currentStep,
    completedSteps,
    canProgress,
    canGoBack,
    totalSteps,
    currentStepIndex,
    actions: { goToStep, nextStep, prevStep },
  } = useWizardNavigation();

  const handleStepComplete = (stepData: Partial<BusinessRegistrationData>) => {
    updateData(stepData);
  };

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep);

    if (currentStep === 'chart-of-accounts') {
      // Finalize submission on last step
      console.log('About to call submitRegistration...');
      await submitRegistration();
      console.log('submitRegistration completed');
    } else if (currentStep === 'government-credentials') {
      // Best-effort persist government registrations if we already have a registration id
      try {
        if (data.registrationId && data.governmentAgencies?.length) {
          await fetch(
            `/api/business-registrations/${data.registrationId}/government-registrations`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ agencies: data.governmentAgencies }),
            }
          );
        }
      } catch (e) {
        console.error('Failed to persist government registrations', e);
      } finally {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleStepClick = (step: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goToStep(step as any);
  };

  // Show notifications when submission state changes
  useEffect(() => {
    if (submission.error) {
      toast.error('Registration Error', {
        description: submission.error,
        duration: Infinity, // Persist until manually dismissed
        dismissible: true,
      });
    }
  }, [submission.error]);

  const renderCurrentStep = () => {
    const stepProps = {
      data,
      onNext: handleStepComplete,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 'basic-info':
        return <BasicInfoStep {...stepProps} />;
      case 'business-categories':
        return <BusinessCategoriesStep {...stepProps} />;
      case 'fiscal-year':
        return <FiscalYearStep {...stepProps} />;
      case 'business-structure':
        return <BusinessStructureStep {...stepProps} />;
      case 'government-credentials':
        return <GovernmentCredentialsStep {...stepProps} />;
      case 'tax-type-information':
        return <TaxTypeInformationStep {...stepProps} />;
      case 'chart-of-accounts':
        return <ChartOfAccountsStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  const navigation = {
    currentStep,
    completedSteps,
    canProgress,
    canGoBack,
    totalSteps,
    currentStepIndex,
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto mobile-nav-safe-area ${className || ''}`}
    >
      {/* Step Indicator */}
      <div className="mb-14">
        <WizardStepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative min-h-[400px] md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Navigation - fixed at bottom */}
        <div className="hidden md:block fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <WizardNavigation
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            onStepClick={handleStepClick}
            isSubmitting={submission.isSubmitting}
          />
        </div>
      </div>

      {/* Mobile Navigation - fixed at bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border/60 shadow-lg">
        <div className="px-4 py-3">
          <WizardNavigation
            navigation={navigation}
            onNext={handleNext}
            onBack={handleBack}
            onStepClick={handleStepClick}
            isSubmitting={submission.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

// Review step removed in new 7-step flow
