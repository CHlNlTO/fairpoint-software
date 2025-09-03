// features/business-registration/hooks/use-business-registration.ts

'use client';

import { useBusinessLoader } from '@/hooks/use-full-page-loader';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { stepSchemas } from '../lib/schemas';
import type {
  BusinessRegistrationData,
  BusinessRegistrationState,
  BusinessRegistrationStep,
} from '../lib/types';

interface UseBusinessRegistrationConfig {
  onSuccess?: (data: BusinessRegistrationData) => void;
  onError?: (error: string) => void;
}

export function useBusinessRegistration(
  config: UseBusinessRegistrationConfig = {}
) {
  const { onSuccess, onError } = config;
  const router = useRouter();
  const loader = useBusinessLoader();

  const [data, setData] = useState<Partial<BusinessRegistrationData>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();

  const state: BusinessRegistrationState = useMemo(
    () => ({
      data,
      navigation: {
        currentStep: 'business-info',
        completedSteps: [],
        canProgress: false,
        canGoBack: false,
        totalSteps: 5,
        currentStepIndex: 0,
      },
      validation: {
        errors,
        isValidating,
      },
      submission: {
        isSubmitting,
        error: submissionError,
      },
    }),
    [data, errors, isValidating, isSubmitting, submissionError]
  );

  const updateData = useCallback(
    <K extends keyof BusinessRegistrationData>(
      updates:
        | Pick<BusinessRegistrationData, K>
        | Partial<BusinessRegistrationData>
    ) => {
      setData(prev => ({ ...prev, ...updates }));

      // Clear related errors when data is updated
      const updatedFields = Object.keys(updates);
      setErrors(prev => {
        const newErrors = { ...prev };
        updatedFields.forEach(field => {
          delete newErrors[field];
        });
        return newErrors;
      });
    },
    []
  );

  const validateStep = useCallback(
    async (step: BusinessRegistrationStep): Promise<boolean> => {
      setIsValidating(true);
      setErrors({});

      try {
        const schema = stepSchemas[step];
        if (!schema) {
          setIsValidating(false);
          return true;
        }

        const result = schema.safeParse(data);

        if (!result.success) {
          const fieldErrors: Record<string, string[]> = {};

          result.error.issues.forEach(issue => {
            const field = issue.path.join('.');
            if (!fieldErrors[field]) {
              fieldErrors[field] = [];
            }
            fieldErrors[field].push(issue.message);
          });

          setErrors(fieldErrors);
          setIsValidating(false);
          return false;
        }

        setIsValidating(false);
        return true;
      } catch (error) {
        console.error('Validation error:', error);
        setErrors({ _general: ['An error occurred during validation'] });
        setIsValidating(false);
        return false;
      }
    },
    [data]
  );

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      const fieldErrors = errors[field];
      return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (field: string): boolean => {
      return Boolean(errors[field] && errors[field].length > 0);
    },
    [errors]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setSubmissionError(undefined);
  }, []);

  const submitRegistration = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    loader.showRegistration();

    try {
      // Final validation
      const isValid = await validateStep('review');

      if (!isValid) {
        setIsSubmitting(false);
        loader.hide();
        return;
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      loader.showSuccess('Business registered successfully!');

      setTimeout(() => {
        loader.hide();
        onSuccess?.(data as BusinessRegistrationData);
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to register business';

      setSubmissionError(errorMessage);
      onError?.(errorMessage);
      loader.hide();
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateStep, loader, onSuccess, onError, router]);

  const reset = useCallback(() => {
    setData({});
    setErrors({});
    setIsValidating(false);
    setIsSubmitting(false);
    setSubmissionError(undefined);
  }, []);

  return useMemo(
    () => ({
      ...state,
      actions: {
        updateData,
        validateStep,
        submitRegistration,
        clearErrors,
        reset,
      },
      utils: {
        getFieldError,
        hasFieldError,
        isStepValid: (step: BusinessRegistrationStep) => {
          const schema = stepSchemas[step];
          if (!schema) return true;
          return schema.safeParse(data).success;
        },
      },
    }),
    [
      state,
      updateData,
      validateStep,
      submitRegistration,
      clearErrors,
      reset,
      getFieldError,
      hasFieldError,
      data,
    ]
  );
}
