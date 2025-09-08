// features/business-registration/components/steps/tax-information-step.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaxRates } from '@/features/business-registration/hooks/use-master-data';
import { TAX_CLASSIFICATION_OPTIONS } from '@/features/business-registration/lib/constants';
import { taxInformationSchema } from '@/features/business-registration/lib/schemas';
import type {
  BusinessRegistrationData,
  TaxClassification,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface TaxInformationStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface TaxInformationFormData {
  taxId?: string;
  taxClassification?: TaxClassification;
  fiscalYearEnd?: string;
  incomeTaxRateId?: string;
  businessTaxType?: 'VAT' | 'Percentage Tax';
  businessTaxExempt?: boolean;
  additionalTaxes?: string[];
}

export function TaxInformationStep({ data, onNext }: TaxInformationStepProps) {
  const form = useForm<TaxInformationFormData>({
    resolver: zodResolver(taxInformationSchema),
    defaultValues: {
      taxId: data.taxId || '',
      taxClassification: data.taxClassification || undefined,
      fiscalYearEnd: data.fiscalYearEnd || '',
      incomeTaxRateId: data.incomeTaxRateId || '',
      businessTaxType: data.businessTaxType,
      businessTaxExempt: data.businessTaxExempt || false,
      additionalTaxes: data.additionalTaxes || [],
    },
  });

  const { data: incomeRates } = useTaxRates('income_tax', undefined);

  // Update parent data when form values change
  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Ensure additionalTaxes is always a string[] (no undefineds)
      const sanitizedValue = {
        ...value,
        additionalTaxes:
          value.additionalTaxes?.filter(
            (t): t is string => typeof t === 'string'
          ) ?? [],
      };
      onNext({
        ...data,
        ...sanitizedValue,
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>
            Configure your tax settings. This information helps us set up your
            tax calculations correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax Identification Number (TIN)</Label>
            <Input
              id="taxId"
              placeholder="Enter your TIN (e.g., 123-456-789-000)"
              {...form.register('taxId')}
              className={
                form.formState.errors.taxId ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.taxId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.taxId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxClassification">Tax Classification</Label>
            <Select
              onValueChange={value =>
                form.setValue('taxClassification', value as TaxClassification)
              }
              defaultValue={form.watch('taxClassification')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tax classification" />
              </SelectTrigger>
              <SelectContent>
                {TAX_CLASSIFICATION_OPTIONS.map(classification => (
                  <SelectItem
                    key={classification.value}
                    value={classification.value}
                  >
                    {classification.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.taxClassification && (
              <p className="text-sm text-destructive">
                {form.formState.errors.taxClassification.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
            <Input
              id="fiscalYearEnd"
              placeholder="MM/DD (e.g., 12/31)"
              {...form.register('fiscalYearEnd')}
              className={
                form.formState.errors.fiscalYearEnd ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.fiscalYearEnd && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fiscalYearEnd.message}
              </p>
            )}
          </div>

          {/* 6.1 Type of Income Tax */}
          <div className="space-y-2">
            <Label htmlFor="incomeTaxRateId">Income Tax</Label>
            <Select
              onValueChange={value => form.setValue('incomeTaxRateId', value)}
              defaultValue={form.watch('incomeTaxRateId')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income tax" />
              </SelectTrigger>
              <SelectContent>
                {(incomeRates || []).map(rate => (
                  <SelectItem key={rate.id} value={rate.id}>
                    {rate.rate_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6.2 Business Tax selection with auto-exempt rule */}
          <div className="space-y-2">
            <Label>Business Tax</Label>
            {(() => {
              const incomeRateName =
                (incomeRates || []).find(
                  r => r.id === form.watch('incomeTaxRateId')
                )?.rate_name || '';
              const isExempt =
                incomeRateName.includes('8%') ||
                incomeRateName.includes('Gross Income Tax') ||
                incomeRateName.toLowerCase().includes('tax-exempt');
              if (isExempt) {
                if (!form.watch('businessTaxExempt')) {
                  form.setValue('businessTaxExempt', true);
                  form.setValue(
                    'businessTaxType',
                    undefined as unknown as never
                  );
                }
                return (
                  <p className="text-sm text-muted-foreground">
                    Business Tax Exempt by rule
                  </p>
                );
              }
              return (
                <Select
                  onValueChange={value => {
                    form.setValue('businessTaxExempt', false);
                    form.setValue(
                      'businessTaxType',
                      value as 'VAT' | 'Percentage Tax'
                    );
                  }}
                  defaultValue={form.watch('businessTaxType')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business tax" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VAT">VAT (Sales {'>'} ₱3M)</SelectItem>
                    <SelectItem value="Percentage Tax">
                      Percentage Tax
                    </SelectItem>
                  </SelectContent>
                </Select>
              );
            })()}
          </div>

          {/* 6.3 Additional Taxes */}
          <div className="space-y-2">
            <Label>Additional Taxes (optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { code: 'withholding_tax', label: 'Withholding Tax (1601C)' },
                {
                  code: 'expanded_withholding_tax',
                  label: 'Expanded Withholding',
                },
                { code: 'tamp', label: 'TAMP' },
              ].map(opt => {
                const checked =
                  form.watch('additionalTaxes')?.includes(opt.code) || false;
                return (
                  <label
                    key={opt.code}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        const current = new Set<string>(
                          (form.watch('additionalTaxes') || []).filter(
                            Boolean
                          ) as string[]
                        );
                        if (e.target.checked) current.add(opt.code);
                        else current.delete(opt.code);
                        form.setValue('additionalTaxes', Array.from(current));
                      }}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
