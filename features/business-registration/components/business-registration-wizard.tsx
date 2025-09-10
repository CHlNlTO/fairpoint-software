// features/business-registration/components/business-registration-wizard.tsx

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

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
    if (currentStep === 'chart-of-accounts') {
      // Finalize submission on last step
      try {
        await submitRegistration();
      } catch (error) {
        console.error('Registration submission failed:', error);
      }
    } else if (currentStep === 'government-credentials') {
      // Best-effort persist government registrations if we already have a registration id
      try {
        if (data.registrationId && data.governmentCredentials?.length) {
          await fetch(
            `/api/business-registrations/${data.registrationId}/government-registrations`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credentials: data.governmentCredentials }),
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
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className || ''}`}>
      {/* Header */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Business Registration</CardTitle>
          <CardDescription>
            Complete your business registration to get started with Fairpoint
            Software.
          </CardDescription>
        </CardHeader>
      </Card> */}

      {/* Step Indicator */}
      <WizardStepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Main Content */}
      <div className="min-h-[400px]">
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
      </div>

      {/* Navigation */}
      <WizardNavigation
        navigation={navigation}
        onNext={handleNext}
        onBack={handleBack}
        onStepClick={handleStepClick}
        isSubmitting={submission.isSubmitting}
      />

      {/* Error Display */}
      {submission.error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{submission.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Review step removed in new 7-step flow
