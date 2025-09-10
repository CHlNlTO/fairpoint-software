// features/business-registration/components/steps/tax-type-information-step.tsx

'use client';

import { Checkbox } from '@/components/animate-ui/radix/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaxRates } from '@/features/business-registration/hooks/use-master-data';
import { taxTypeInformationSchema } from '@/features/business-registration/lib/schemas';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface TaxTypeInformationStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface TaxTypeInformationFormData {
  incomeTaxRateId: string;
  businessTaxType?: 'VAT' | 'Percentage Tax';
  businessTaxExempt?: boolean;
  additionalTaxes?: string[];
}

export function TaxTypeInformationStep({
  data,
  onNext,
}: TaxTypeInformationStepProps) {
  const form = useForm<TaxTypeInformationFormData>({
    resolver: zodResolver(taxTypeInformationSchema),
    defaultValues: {
      incomeTaxRateId: data.incomeTaxRateId || '',
      businessTaxType: data.businessTaxType,
      businessTaxExempt: data.businessTaxExempt || false,
      additionalTaxes: data.additionalTaxes || [],
    },
  });

  const { data: incomeRates } = useTaxRates(
    'income_tax',
    data.businessStructure
  );

  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Fix: Ensure additionalTaxes is always string[] (no undefineds)
      const cleanedValue = {
        ...value,
        additionalTaxes: (value.additionalTaxes || []).filter(
          (tax): tax is string => typeof tax === 'string'
        ),
      };
      onNext({ ...data, ...cleanedValue });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  // Determine exemption based on selected income tax (derived state)
  const incomeTaxRateId = form.watch('incomeTaxRateId');
  const incomeRateName = React.useMemo(() => {
    return (
      (incomeRates || []).find(r => r.id === incomeTaxRateId)?.rate_name || ''
    );
  }, [incomeRates, incomeTaxRateId]);

  const isExempt = React.useMemo(() => {
    return (
      incomeRateName.includes('8%') ||
      incomeRateName.includes('Gross Income Tax') ||
      incomeRateName.toLowerCase().includes('exempt')
    );
  }, [incomeRateName]);

  // Apply exemption side-effects outside of render
  React.useEffect(() => {
    if (isExempt) {
      if (!form.getValues('businessTaxExempt')) {
        form.setValue('businessTaxExempt', true);
      }
      if (form.getValues('businessTaxType')) {
        form.setValue('businessTaxType', undefined as unknown as never);
      }
    }
  }, [isExempt, form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>What type of Income Tax do you have?</CardTitle>
          <CardDescription>
            Select one and any additional options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incomeTaxRateId">Income Tax</Label>
            <Select
              onValueChange={v => form.setValue('incomeTaxRateId', v)}
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

          <div className="space-y-2">
            <Label>Business Tax</Label>
            {isExempt ? (
              <p className="text-sm text-muted-foreground">
                Business Tax Exempt by rule
              </p>
            ) : (
              <Select
                onValueChange={v => {
                  form.setValue('businessTaxExempt', false);
                  form.setValue(
                    'businessTaxType',
                    v as 'VAT' | 'Percentage Tax'
                  );
                }}
                defaultValue={form.watch('businessTaxType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business tax" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAT">VAT (Sales {'>'} ₱3M)</SelectItem>
                  <SelectItem value="Percentage Tax">Percentage Tax</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

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
                    <Checkbox
                      checked={checked}
                      onCheckedChange={val => {
                        const current = new Set<string>(
                          (form.watch('additionalTaxes') || []).filter(
                            Boolean
                          ) as string[]
                        );
                        if (val) current.add(opt.code);
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
