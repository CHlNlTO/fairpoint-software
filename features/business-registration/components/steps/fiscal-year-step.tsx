// features/business-registration/components/steps/fiscal-year-step.tsx

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface FiscalYearStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

type FiscalYearFormData = Pick<
  BusinessRegistrationData,
  | 'fiscalYearPeriodId'
  | 'fiscalYearCustomStartMonth'
  | 'fiscalYearCustomStartDay'
  | 'fiscalYearCustomEndMonth'
  | 'fiscalYearCustomEndDay'
>;

// Hardcoded fiscal year period IDs from the database
const FISCAL_YEAR_PERIODS = {
  STANDARD_CALENDAR: '4d5a61af-06f0-4cb8-9f88-086957f33c77', // Calendar Year (Jan 1 - Dec 31)
  FISCAL_YEAR: '7ed5e712-2cdb-471e-b70c-0e87656622dd', // Fiscal Year (Jun 1 - Jul 31)
  CUSTOM: 'custom', // Special identifier for custom periods
} as const;

interface FiscalYearOption {
  id: string;
  label: string;
  description: string;
}

export function FiscalYearStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: FiscalYearStepProps) {
  // Simple state management for form data (matching basic-info-step pattern)
  const [formData, setFormData] = React.useState<FiscalYearFormData>({
    fiscalYearPeriodId: data.fiscalYearPeriodId || '',
    fiscalYearCustomStartMonth: data.fiscalYearCustomStartMonth || undefined,
    fiscalYearCustomStartDay: data.fiscalYearCustomStartDay || undefined,
    fiscalYearCustomEndMonth: data.fiscalYearCustomEndMonth || undefined,
    fiscalYearCustomEndDay: data.fiscalYearCustomEndDay || undefined,
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

  // Set default period if none selected
  React.useEffect(() => {
    if (!formData.fiscalYearPeriodId) {
      setFormData(prev => ({
        ...prev,
        fiscalYearPeriodId: FISCAL_YEAR_PERIODS.STANDARD_CALENDAR,
      }));
    }
  }, []);

  const isCustom = formData.fiscalYearPeriodId === FISCAL_YEAR_PERIODS.CUSTOM;

  const handlePeriodChange = (periodId: string) => {
    setFormData(prev => ({ ...prev, fiscalYearPeriodId: periodId }));
    clearFieldError('fiscalYearPeriodId');
  };

  const handleCustomFieldChange = (
    field: keyof FiscalYearFormData,
    value: string
  ) => {
    // Allow empty string, convert to number only if not empty
    const numericValue = value === '' ? undefined : parseInt(value);

    // BIR Rule: Start day must always be 1
    if (field === 'fiscalYearCustomStartMonth' && numericValue) {
      setFormData(prev => ({
        ...prev,
        [field]: numericValue,
        fiscalYearCustomStartDay: 1, // Automatically set start day to 1
      }));
    } else if (field === 'fiscalYearCustomEndMonth' && numericValue) {
      // BIR Rule: End day must be the last day of the month
      const lastDayOfEndMonth = new Date(2024, numericValue, 0).getDate();
      setFormData(prev => ({
        ...prev,
        [field]: numericValue,
        fiscalYearCustomEndDay: lastDayOfEndMonth, // Automatically set end day to last day of month
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    }

    clearFieldError(field);
  };

  // Define the three options
  const fiscalYearOptions: FiscalYearOption[] = [
    {
      id: FISCAL_YEAR_PERIODS.STANDARD_CALENDAR,
      label: 'Standard Calendar Year',
      description: 'January 1 to December 31',
    },
    {
      id: FISCAL_YEAR_PERIODS.FISCAL_YEAR,
      label: 'Fiscal Year',
      description: 'June 1 to July 31',
    },
    {
      id: FISCAL_YEAR_PERIODS.CUSTOM,
      label: 'Custom Period',
      description: 'Define your own fiscal year period',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl">
          <span className="font-bold">Tell us when</span> <br />
          to start tracking
        </h2>
      </div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-0.5">
              Fiscal Year <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={handlePeriodChange}
              value={formData.fiscalYearPeriodId}
            >
              <SelectTrigger
                className={`bg-white ${hasFieldError('fiscalYearPeriodId') ? 'border-destructive' : ''}`}
              >
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {fiscalYearOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('fiscalYearPeriodId') && (
              <p className="text-sm text-destructive">
                {getFieldError('fiscalYearPeriodId')}
              </p>
            )}
          </div>

          {isCustom && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>BIR Requirements:</strong> Custom fiscal year must
                  start on the 1st day of a month, end on the last day of a
                  month, span exactly 12 months, and not end in December.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Example: July 1 - June 30, October 1 - September 30
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="inline-flex items-center gap-0.5">
                    Start Month <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Month (1-12)"
                    value={
                      formData.fiscalYearCustomStartMonth?.toString() || ''
                    }
                    onChange={e =>
                      handleCustomFieldChange(
                        'fiscalYearCustomStartMonth',
                        e.target.value
                      )
                    }
                    className={`bg-white ${hasFieldError('fiscalYearCustomStartMonth') ? 'border-destructive' : ''}`}
                  />
                  <div className="text-xs text-muted-foreground">
                    Start day is automatically set to 1 (BIR requirement)
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="inline-flex items-center gap-0.5">
                    End Month <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Month (1-12)"
                    value={formData.fiscalYearCustomEndMonth?.toString() || ''}
                    onChange={e =>
                      handleCustomFieldChange(
                        'fiscalYearCustomEndMonth',
                        e.target.value
                      )
                    }
                    className={`bg-white ${hasFieldError('fiscalYearCustomEndMonth') ? 'border-destructive' : ''}`}
                  />
                  <div className="text-xs text-muted-foreground">
                    End day is automatically calculated (BIR requirement)
                  </div>
                </div>
              </div>
              {(getFieldError('fiscalYearCustomStartMonth') ||
                getFieldError('fiscalYearCustomStartDay') ||
                getFieldError('fiscalYearCustomEndMonth') ||
                getFieldError('fiscalYearCustomEndDay')) && (
                <p className="text-sm text-destructive">
                  {getFieldError('fiscalYearCustomStartMonth') ||
                    getFieldError('fiscalYearCustomStartDay') ||
                    getFieldError('fiscalYearCustomEndMonth') ||
                    getFieldError('fiscalYearCustomEndDay')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
