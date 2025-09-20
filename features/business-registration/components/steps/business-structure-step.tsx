// features/business-registration/components/steps/business-structure-step.tsx

'use client';

import type {
  BusinessRegistrationData,
  BusinessStructure,
} from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface BusinessStructureStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

interface BusinessStructureFormData {
  businessStructure: BusinessStructure;
}

const OPTIONS: { value: BusinessStructure; label: string; emoji: string }[] = [
  { value: 'freelancing', label: 'Freelance', emoji: '✍️' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship', emoji: '🧑‍💼' },
  { value: 'partnership', label: 'Partnership', emoji: '🤝' },
  { value: 'corporation', label: 'Corporation', emoji: '🏢' },
  { value: 'cooperative', label: 'Cooperative', emoji: '🌱' },
];

export function BusinessStructureStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: BusinessStructureStepProps) {
  // Simple state management for form data (matching business-categories-step pattern)
  const [formData, setFormData] = React.useState<BusinessStructureFormData>({
    businessStructure:
      (data.businessStructure as BusinessStructure) || 'freelancing',
  });

  // Helper function to get field error
  const getFieldError = (field: string): string | undefined => {
    const fieldErrors = validation.errors[field];
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
  };

  // Helper function to check if field has error
  const hasFieldError = (field: string): boolean => {
    return Boolean(
      validation.errors[field] && validation.errors[field].length > 0
    );
  };

  // Update global state whenever form data changes
  React.useEffect(() => {
    onNext({ ...data, ...formData });
  }, [formData, onNext]);

  const select = (value: BusinessStructure) => {
    setFormData(prev => ({ ...prev, businessStructure: value }));
    clearFieldError('businessStructure');
  };

  const selected = formData.businessStructure;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            <span className="font-bold">Tell us about your</span> <br />{' '}
            business setup
          </h2>
          <p className="text-muted-foreground">Select one.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`rounded-2xl border py-6 px-6 text-lg font-semibold shadow-sm transition-colors text-left ${
                selected === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card hover:bg-background'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {opt.emoji}
                </span>
                <span>{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
        {getFieldError('businessStructure') && (
          <p className="text-sm text-destructive">
            {getFieldError('businessStructure')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
