// features/business-registration/components/steps/business-type-step.tsx

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
import {
  BUSINESS_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from '@/features/business-registration/lib/constants';
import { businessTypeStepSchema } from '@/features/business-registration/lib/schemas';
import type {
  BusinessRegistrationData,
  BusinessType,
  OwnershipType,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BusinessTypeStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface BusinessTypeFormData {
  businessType: BusinessType;
  ownership: OwnershipType;
  employees?: number;
}

export function BusinessTypeStep({ data, onNext }: BusinessTypeStepProps) {
  const form = useForm<BusinessTypeFormData>({
    resolver: zodResolver(businessTypeStepSchema),
    defaultValues: {
      businessType: data.businessType || 'sole-proprietorship',
      ownership: data.ownership || 'single-owner',
      employees: data.employees || undefined,
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
          <CardTitle>Business Structure</CardTitle>
          <CardDescription>
            Define your business structure and ownership details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              onValueChange={value =>
                form.setValue('businessType', value as BusinessType)
              }
              defaultValue={form.watch('businessType')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPE_OPTIONS.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.businessType && (
              <p className="text-sm text-destructive">
                {form.formState.errors.businessType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownership">Ownership Structure *</Label>
            <Select
              onValueChange={value =>
                form.setValue('ownership', value as OwnershipType)
              }
              defaultValue={form.watch('ownership')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                {OWNERSHIP_TYPE_OPTIONS.map(ownership => (
                  <SelectItem key={ownership.value} value={ownership.value}>
                    {ownership.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.ownership && (
              <p className="text-sm text-destructive">
                {form.formState.errors.ownership.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employees">Number of Employees</Label>
            <Input
              id="employees"
              type="number"
              placeholder="Enter number of employees"
              {...form.register('employees', { valueAsNumber: true })}
              className={
                form.formState.errors.employees ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.employees && (
              <p className="text-sm text-destructive">
                {form.formState.errors.employees.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
