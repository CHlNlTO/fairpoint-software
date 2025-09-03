// features/business-registration/components/business-registration-wizard.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBusinessRegistration } from '@/features/business-registration/hooks/use-business-registration';
import { useWizardNavigation } from '@/features/business-registration/hooks/use-wizard-navigation';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { BusinessInfoStep } from './steps/business-info-step';
import { BusinessTypeStep } from './steps/business-type-step';
import { ContactDetailsStep } from './steps/contact-details-step';
import { TaxInformationStep } from './steps/tax-information-step';
import { WizardNavigation } from './wizard-navigation';
import { WizardStepIndicator } from './wizard-step-indicator';

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
    if (currentStep === 'review') {
      // Submit the registration
      try {
        await submitRegistration();
      } catch (error) {
        console.error('Registration submission failed:', error);
      }
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleStepClick = (step: string) => {
    goToStep(step as any);
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data,
      onNext: handleStepComplete,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 'business-info':
        return <BusinessInfoStep {...stepProps} />;
      case 'business-type':
        return <BusinessTypeStep {...stepProps} />;
      case 'tax-information':
        return <TaxInformationStep {...stepProps} />;
      case 'contact-details':
        return <ContactDetailsStep {...stepProps} />;
      case 'review':
        return <ReviewStep data={data} onBack={handleBack} />;
      default:
        return <BusinessInfoStep {...stepProps} />;
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

// Review Step Component
interface ReviewStepProps {
  data: Partial<BusinessRegistrationData>;
  onBack: () => void;
}

function ReviewStep({ data, onBack }: ReviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Review & Submit</CardTitle>
          <CardDescription>
            Please review your information before submitting your business
            registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business Name
                </label>
                <p className="text-sm">{data.businessName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Industry
                </label>
                <p className="text-sm">{data.industry || 'Not specified'}</p>
              </div>
            </div>
            {data.businessDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm">{data.businessDescription}</p>
              </div>
            )}
          </div>

          {/* Business Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Business Type
                </label>
                <p className="text-sm">{data.businessType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Ownership
                </label>
                <p className="text-sm">{data.ownership}</p>
              </div>
            </div>
            {data.employees && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Number of Employees
                </label>
                <p className="text-sm">{data.employees}</p>
              </div>
            )}
          </div>

          {/* Tax Information */}
          {(data.taxId || data.taxClassification || data.fiscalYearEnd) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tax Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.taxId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tax ID
                    </label>
                    <p className="text-sm">{data.taxId}</p>
                  </div>
                )}
                {data.taxClassification && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tax Classification
                    </label>
                    <p className="text-sm">{data.taxClassification}</p>
                  </div>
                )}
                {data.fiscalYearEnd && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Fiscal Year End
                    </label>
                    <p className="text-sm">{data.fiscalYearEnd}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="text-sm">{data.phone}</p>
                </div>
              )}
              {data.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{data.email}</p>
                </div>
              )}
            </div>
            {data.website && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Website
                </label>
                <p className="text-sm">{data.website}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
