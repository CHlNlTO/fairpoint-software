// features/business-registration/components/steps/business-categories-step.tsx

'use client';

import type {
  BusinessCategory,
  BusinessRegistrationData,
} from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface BusinessCategoriesStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

interface BusinessCategoriesFormData {
  businessCategories: BusinessCategory[];
}

const OPTIONS: { value: BusinessCategory; label: string; emoji: string }[] = [
  { value: 'services', label: 'Services', emoji: '🧰' },
  { value: 'retail', label: 'Retail', emoji: '🛍️' },
  { value: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
  { value: 'import-export', label: 'Import/Export', emoji: '🌎' },
];

export function BusinessCategoriesStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: BusinessCategoriesStepProps) {
  // Simple state management for form data (matching basic-info-step pattern)
  const [formData, setFormData] = React.useState<BusinessCategoriesFormData>({
    businessCategories: (data.businessCategories as BusinessCategory[]) || [],
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

  const toggle = (value: BusinessCategory) => {
    const current = new Set(formData.businessCategories);
    if (current.has(value)) current.delete(value);
    else current.add(value);

    const newCategories = Array.from(current);
    setFormData(prev => ({ ...prev, businessCategories: newCategories }));
    clearFieldError('businessCategories');
  };

  const selected = new Set(formData.businessCategories || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            <span className="font-bold">Which industries best</span> <br />{' '}
            describe your business?
          </h2>
          <p className="text-muted-foreground">Choose all that apply.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded-2xl border py-6 px-6 text-lg font-semibold shadow-sm transition-colors text-left ${
                selected.has(opt.value)
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
        {getFieldError('businessCategories') && (
          <p className="text-sm text-destructive">
            {getFieldError('businessCategories')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
