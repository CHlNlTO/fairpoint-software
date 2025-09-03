// features/business-registration/components/steps/business-info-step.tsx

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
import { Textarea } from '@/components/ui/textarea';
import { INDUSTRY_OPTIONS } from '@/features/business-registration/lib/constants';
import { businessInfoStepSchema } from '@/features/business-registration/lib/schemas';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BusinessInfoStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface BusinessInfoFormData {
  businessName: string;
  businessDescription?: string;
  industry?: string;
}

export function BusinessInfoStep({ data, onNext }: BusinessInfoStepProps) {
  const form = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoStepSchema),
    defaultValues: {
      businessName: data.businessName || '',
      businessDescription: data.businessDescription || '',
      industry: data.industry || '',
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
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Tell us about your business. This information helps us customize
            your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              {...form.register('businessName')}
              className={
                form.formState.errors.businessName ? 'border-destructive' : ''
              }
            />
            {form.formState.errors.businessName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.businessName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              placeholder="Describe what your business does"
              {...form.register('businessDescription')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              onValueChange={value => form.setValue('industry', value)}
              defaultValue={form.watch('industry')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map(industry => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
