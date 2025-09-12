// features/business-registration/hooks/use-business-registration.ts

'use client';

import { useBusinessLoader } from '@/hooks/use-full-page-loader';
import { useLocalStorage } from '@/hooks/use-local-storage';
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

  // Persist draft in localStorage for resume
  const [draft, setDraft] = useLocalStorage<{
    data: Partial<BusinessRegistrationData>;
    step?: BusinessRegistrationStep;
  }>('business_registration_draft', { data: {}, step: 'basic-info' });

  const [data, setData] = useState<Partial<BusinessRegistrationData>>(
    () => draft?.data || {}
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();

  const state: BusinessRegistrationState = useMemo(
    () => ({
      data,
      navigation: {
        currentStep: 'basic-info',
        completedSteps: [],
        canProgress: false,
        canGoBack: false,
        totalSteps: 7,
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

      // Persist to draft
      setDraft(prev => ({ ...prev, data: { ...prev.data, ...updates } }));

      // Don't clear errors automatically - let validation handle this
    },
    []
  );

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateStep = useCallback(
    async (step: BusinessRegistrationStep): Promise<boolean> => {
      console.log('validateStep called for:', step);
      console.log('Current data:', data);
      setIsValidating(true);
      setErrors({});

      try {
        const schema = stepSchemas[step];
        if (!schema) {
          console.log('No schema found for step:', step);
          setIsValidating(false);
          return true;
        }

        const result = schema.safeParse(data);
        console.log('Validation result:', result);

        if (!result.success) {
          console.log('Validation failed with errors:', result.error.issues);
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

        console.log('Validation passed');
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
    console.log('submitRegistration called');
    setIsSubmitting(true);
    setSubmissionError(undefined);
    loader.showRegistration();

    try {
      // Final validation against last step in the flow
      console.log('Validating chart-of-accounts step...');
      const isValid = await validateStep('chart-of-accounts');
      console.log('Validation result:', isValid);

      if (!isValid) {
        console.log('Validation failed, stopping submission');
        setIsSubmitting(false);
        loader.hide();
        return;
      }

      // Give any in-flight step updates (watch effects) a tick to flush
      await new Promise(resolve => setTimeout(resolve, 0));

      // Helpers to sanitize payloads expected by API
      const formatTin = (tin?: string) => {
        if (!tin) return '';
        const digits = tin.replace(/\D/g, '');
        if (digits.length === 12) {
          return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}`;
        }
        return tin;
      };
      const normalizePsgc = (code?: string): string | undefined => {
        if (!code) return undefined;
        const digits = code.replace(/\D/g, '');
        if (/^\d{10}$/.test(digits)) return digits;
        if (/^\d{2}$/.test(digits)) return `${digits}00000000`;
        if (/^\d{5}$/.test(digits)) return `${digits}00000`;
        if (/^\d{7}$/.test(digits)) return `${digits}000`;
        // Fallback: right-pad zeros to 10 to satisfy API constraints
        if (digits.length < 10) return digits.padEnd(10, '0');
        return digits;
      };

      // UUID regex for validation
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      // 1) Create draft if we don't have an id yet
      let registrationId = (data as BusinessRegistrationData).registrationId;
      if (!registrationId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
          business_name: data.businessName,
          tin_number: formatTin(data.taxId),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          business_email: (data as any).businessEmail,
          barangay_psgc: normalizePsgc(data.address?.barangayPsgc),
          street_address: data.address?.streetAddress || '',
          building_name: data.address?.buildingName || '',
          unit_number: data.address?.unitNumber || '',
          postal_code: data.address?.postalCode || '',
          business_types: (data.businessCategories || []) as string[],
          business_structure: data.businessStructure,
        };

        // Only include fiscal_year_period_id if it's a valid UUID
        if (
          data.fiscalYearPeriodId &&
          uuidRegex.test(String(data.fiscalYearPeriodId))
        ) {
          payload.fiscal_year_period_id = data.fiscalYearPeriodId;
        }

        const res = await fetch('/api/business-registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create registration');
        const json = await res.json();
        registrationId = json.id;
        setData(prev => ({ ...prev, registrationId }));
        setDraft(prev => ({ ...prev, data: { ...prev.data, registrationId } }));
      }

      // 2) Update rest of fields
      if (registrationId) {
        const patchPayload: Record<string, unknown> = {
          business_types: (data.businessCategories || []) as string[],
          business_structure: data.businessStructure,
          income_tax_rate_id: data.incomeTaxRateId || null,
          business_tax_type: data.businessTaxType || null,
          business_tax_exempt: data.businessTaxExempt || false,
          additional_taxes: data.additionalTaxes || [],
        };
        if (
          data.fiscalYearPeriodId &&
          uuidRegex.test(String(data.fiscalYearPeriodId))
        ) {
          patchPayload.fiscal_year_period_id = data.fiscalYearPeriodId;
        }
        const updRes = await fetch(
          `/api/business-registrations/${registrationId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patchPayload),
          }
        );
        if (!updRes.ok) {
          const err = await updRes.json().catch(() => ({}));
          throw new Error(err?.error || 'Failed to update registration');
        }
      }

      // 3) Best-effort persist government registrations
      if (registrationId && (data.governmentAgencies?.length || 0) > 0) {
        await fetch(
          `/api/business-registrations/${registrationId}/government-registrations`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agencies: data.governmentAgencies }),
          }
        );
      }

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
    setDraft({ data: {}, step: 'basic-info' });
  }, []);

  const saveDraftStep = useCallback(
    (step: BusinessRegistrationStep) => {
      setDraft(prev => ({ ...prev, step }));
    },
    [setDraft]
  );

  return useMemo(
    () => ({
      ...state,
      actions: {
        updateData,
        validateStep,
        submitRegistration,
        clearErrors,
        clearFieldError,
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
      clearFieldError,
      reset,
      getFieldError,
      hasFieldError,
      data,
    ]
  );
}
