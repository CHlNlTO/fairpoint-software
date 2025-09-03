// features/business-registration/hooks/use-wizard-navigation.ts

'use client';

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

  const [currentStep, setCurrentStep] =
    useState<BusinessRegistrationStep>(initialStep);
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
        onStepChange?.(step);
      }
    },
    [currentStep, completedSteps, onStepChange]
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
      onStepChange?.(nextStepId);
    }
  }, [
    currentStep,
    currentStepIndex,
    completedSteps,
    navigationState.canProgress,
    onStepChange,
  ]);

  const prevStep = useCallback(() => {
    if (navigationState.canGoBack) {
      const prevStepIndex = currentStepIndex - 1;
      const prevStepId = STEP_ORDER[prevStepIndex];

      setCurrentStep(prevStepId);
      onStepChange?.(prevStepId);
    }
  }, [currentStepIndex, navigationState.canGoBack, onStepChange]);

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
    onStepChange?.(initialStep);
  }, [initialStep, onStepChange]);

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
