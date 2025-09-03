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
}

export function TaxInformationStep({ data, onNext }: TaxInformationStepProps) {
  const form = useForm<TaxInformationFormData>({
    resolver: zodResolver(taxInformationSchema),
    defaultValues: {
      taxId: data.taxId || '',
      taxClassification: data.taxClassification || undefined,
      fiscalYearEnd: data.fiscalYearEnd || '',
    },
  });

  // Update parent data when form values change
  React.useEffect(() => {
    const subscription = form.watch(value => {
      onNext({
        ...data,
        ...value,
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
