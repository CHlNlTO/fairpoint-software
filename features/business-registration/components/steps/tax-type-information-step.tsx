// features/business-registration/components/steps/tax-type-information-step.tsx

'use client';

import { Checkbox } from '@/components/animate-ui/radix/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaxRates } from '@/features/business-registration/hooks/use-master-data';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface TaxTypeInformationStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

interface TaxTypeInformationFormData {
  incomeTaxRateId: string;
  businessTaxType?: 'VAT' | 'Percentage Tax';
  businessTaxExempt?: boolean;
  additionalTaxes: string[];
}

export function TaxTypeInformationStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: TaxTypeInformationStepProps) {
  // Simple state management for form data (matching other step patterns)
  const [formData, setFormData] = React.useState<TaxTypeInformationFormData>({
    incomeTaxRateId: data.incomeTaxRateId || '',
    businessTaxType: data.businessTaxType,
    businessTaxExempt: data.businessTaxExempt || false,
    additionalTaxes: (data.additionalTaxes as string[]) || [],
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

  const {
    data: incomeRates,
    isLoading,
    error,
  } = useTaxRates('income_tax', data.businessStructure);

  // Determine exemption based on selected income tax (derived state)
  const incomeRateName = React.useMemo(() => {
    return (
      (incomeRates || []).find(r => r.id === formData.incomeTaxRateId)
        ?.rate_name || ''
    );
  }, [incomeRates, formData.incomeTaxRateId]);

  const isExempt = React.useMemo(() => {
    return (
      incomeRateName.includes('8%') ||
      incomeRateName.includes('Gross Income Tax') ||
      incomeRateName.toLowerCase().includes('exempt')
    );
  }, [incomeRateName]);

  // Apply exemption side-effects when income tax changes
  React.useEffect(() => {
    if (isExempt) {
      setFormData(prev => ({
        ...prev,
        businessTaxExempt: true,
        businessTaxType: undefined,
      }));
    }
  }, [isExempt]);

  const handleIncomeTaxChange = (value: string) => {
    setFormData(prev => ({ ...prev, incomeTaxRateId: value }));
    clearFieldError('incomeTaxRateId');
  };

  const handleBusinessTaxChange = (value: 'VAT' | 'Percentage Tax') => {
    setFormData(prev => ({
      ...prev,
      businessTaxExempt: false,
      businessTaxType: value,
    }));
    clearFieldError('businessTaxType');
  };

  const handleAdditionalTaxToggle = (taxCode: string, checked: boolean) => {
    const current = new Set(formData.additionalTaxes);
    if (checked) {
      current.add(taxCode);
    } else {
      current.delete(taxCode);
    }
    setFormData(prev => ({ ...prev, additionalTaxes: Array.from(current) }));
    clearFieldError('additionalTaxes');
  };

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
            <span className="font-bold">What type of</span> <br /> Income Tax do
            you have?
          </h2>
          <p className="text-muted-foreground">
            Select one and any additional options.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-0.5">
              Income Tax <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={handleIncomeTaxChange}
              value={formData.incomeTaxRateId}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`bg-white ${hasFieldError('incomeTaxRateId') ? 'border-destructive' : ''}`}
              >
                <SelectValue
                  placeholder={
                    isLoading
                      ? 'Loading tax rates...'
                      : error
                        ? 'Error loading tax rates'
                        : 'Select income tax'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading tax rates...
                  </SelectItem>
                ) : error ? (
                  <SelectItem value="error" disabled>
                    Error loading tax rates
                  </SelectItem>
                ) : (incomeRates || []).length === 0 ? (
                  <SelectItem value="no-data" disabled>
                    No tax rates available for {data.businessStructure}
                  </SelectItem>
                ) : (
                  (incomeRates || []).map(rate => (
                    <SelectItem key={rate.id} value={rate.id}>
                      {rate.rate_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {getFieldError('incomeTaxRateId') && (
              <p className="text-sm text-destructive">
                {getFieldError('incomeTaxRateId')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="inline-flex items-center gap-0.5">
              Business Tax <span className="text-destructive">*</span>
            </Label>
            {isExempt ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800/30">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                      Business Tax Exempt
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Based on your income tax selection
                    </p>
                  </div>
                </div>

                {/* Exemption Info */}
                <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-green-200/50 dark:border-green-800/20">
                  <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                    Tax Exemption Applied
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                    Your selected income tax rate automatically exempts you from
                    business tax requirements. This exemption is based on your
                    business structure and tax rate selection.
                  </p>
                </div>
              </div>
            ) : (
              <Select
                onValueChange={handleBusinessTaxChange}
                value={formData.businessTaxType}
              >
                <SelectTrigger
                  className={`bg-white ${hasFieldError('businessTaxType') ? 'border-destructive' : ''}`}
                >
                  <SelectValue placeholder="Select business tax" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAT">VAT (Sales {'>'} ₱3M)</SelectItem>
                  <SelectItem value="Percentage Tax">Percentage Tax</SelectItem>
                </SelectContent>
              </Select>
            )}
            {getFieldError('businessTaxType') && (
              <p className="text-sm text-destructive">
                {getFieldError('businessTaxType')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Additional Taxes</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { code: 'withholding_tax', label: 'Withholding Tax (1601C)' },
                {
                  code: 'expanded_withholding_tax',
                  label: 'Expanded Withholding',
                },
                { code: 'tamp', label: 'TAMP' },
              ].map(opt => {
                const checked = formData.additionalTaxes.includes(opt.code);
                return (
                  <label
                    key={opt.code}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={val =>
                        handleAdditionalTaxToggle(opt.code, !!val)
                      }
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
            {getFieldError('additionalTaxes') && (
              <p className="text-sm text-destructive">
                {getFieldError('additionalTaxes')}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
