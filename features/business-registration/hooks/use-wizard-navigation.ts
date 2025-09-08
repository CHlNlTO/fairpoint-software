// features/business-registration/hooks/use-wizard-navigation.ts

'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useCallback, useMemo, useState } from 'react';
import { STEP_ORDER } from '../lib/constants';
import type {
  BusinessRegistrationStep,
  WizardNavigationState,
} from '../lib/types';

interface UseWizardNavigationConfig {
  initialStep?: BusinessRegistrationStep;
  onStepChange?: (step: BusinessRegistrationStep) => void;
}

export function useWizardNavigation(config: UseWizardNavigationConfig = {}) {
  const { initialStep = 'business-info', onStepChange } = config;

  const [draft, setDraft] = useLocalStorage<{
    step: BusinessRegistrationStep;
  }>('business_registration_draft', { step: initialStep });

  const [currentStep, setCurrentStep] = useState<BusinessRegistrationStep>(
    () => draft?.step || initialStep
  );
  const [completedSteps, setCompletedSteps] = useState<
    BusinessRegistrationStep[]
  >([]);

  const currentStepIndex = useMemo(
    () => STEP_ORDER.indexOf(currentStep),
    [currentStep]
  );

  const navigationState: WizardNavigationState = useMemo(
    () => ({
      currentStep,
      completedSteps,
      canProgress: currentStepIndex < STEP_ORDER.length - 1,
      canGoBack: currentStepIndex > 0,
      totalSteps: STEP_ORDER.length,
      currentStepIndex,
    }),
    [currentStep, completedSteps, currentStepIndex]
  );

  const goToStep = useCallback(
    (step: BusinessRegistrationStep) => {
      const stepIndex = STEP_ORDER.indexOf(step);
      const currentIndex = STEP_ORDER.indexOf(currentStep);

      // Only allow going to completed steps or the next step
      if (stepIndex <= currentIndex || completedSteps.includes(step)) {
        setCurrentStep(step);
        setDraft({ step });
        onStepChange?.(step);
      }
    },
    [currentStep, completedSteps, onStepChange, setDraft]
  );

  const nextStep = useCallback(() => {
    if (navigationState.canProgress) {
      const nextStepIndex = currentStepIndex + 1;
      const nextStepId = STEP_ORDER[nextStepIndex];

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }

      setCurrentStep(nextStepId);
      setDraft({ step: nextStepId });
      onStepChange?.(nextStepId);
    }
  }, [
    currentStep,
    currentStepIndex,
    completedSteps,
    navigationState.canProgress,
    onStepChange,
    setDraft,
  ]);

  const prevStep = useCallback(() => {
    if (navigationState.canGoBack) {
      const prevStepIndex = currentStepIndex - 1;
      const prevStepId = STEP_ORDER[prevStepIndex];

      setCurrentStep(prevStepId);
      setDraft({ step: prevStepId });
      onStepChange?.(prevStepId);
    }
  }, [currentStepIndex, navigationState.canGoBack, onStepChange, setDraft]);

  const markStepCompleted = useCallback(
    (step: BusinessRegistrationStep) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps(prev => [...prev, step]);
      }
    },
    [completedSteps]
  );

  const isStepCompleted = useCallback(
    (step: BusinessRegistrationStep) => completedSteps.includes(step),
    [completedSteps]
  );

  const canAccessStep = useCallback(
    (step: BusinessRegistrationStep) => {
      const stepIndex = STEP_ORDER.indexOf(step);
      const currentIndex = currentStepIndex;

      // Can access current step, completed steps, or the next step
      return stepIndex <= currentIndex || completedSteps.includes(step);
    },
    [currentStepIndex, completedSteps]
  );

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps([]);
    setDraft({ step: initialStep });
    onStepChange?.(initialStep);
  }, [initialStep, onStepChange, setDraft]);

  return useMemo(
    () => ({
      ...navigationState,
      actions: {
        goToStep,
        nextStep,
        prevStep,
        markStepCompleted,
        reset,
      },
      utils: {
        isStepCompleted,
        canAccessStep,
      },
    }),
    [
      navigationState,
      goToStep,
      nextStep,
      prevStep,
      markStepCompleted,
      reset,
      isStepCompleted,
      canAccessStep,
    ]
  );
}
