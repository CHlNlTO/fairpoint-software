// features/business-registration/components/steps/business-categories-step.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { businessCategoriesStepSchema } from '@/features/business-registration/lib/schemas';
import type {
  BusinessCategory,
  BusinessRegistrationData,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BusinessCategoriesStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
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
}: BusinessCategoriesStepProps) {
  const form = useForm<BusinessCategoriesFormData>({
    resolver: zodResolver(businessCategoriesStepSchema),
    defaultValues: {
      businessCategories: (data.businessCategories as BusinessCategory[]) || [],
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Ensure businessCategories is always BusinessCategory[] (no undefineds)
      const cleanedValue = {
        ...value,
        businessCategories: Array.isArray(value.businessCategories)
          ? value.businessCategories.filter(
              (cat): cat is BusinessCategory => typeof cat === 'string' && !!cat
            )
          : [],
      };
      onNext({ ...data, ...cleanedValue });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  const toggle = (value: BusinessCategory) => {
    const current = new Set(form.getValues('businessCategories'));
    if (current.has(value)) current.delete(value);
    else current.add(value);
    form.setValue('businessCategories', Array.from(current));
  };

  const selected = new Set(form.watch('businessCategories') || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Which industries best describe your business?</CardTitle>
          <CardDescription>Choose all that apply.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`rounded-2xl border py-6 px-6 text-lg font-semibold shadow-sm transition-colors text-left ${
                  selected.has(opt.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
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
          {form.formState.errors.businessCategories && (
            <p className="text-sm text-destructive">
              {form.formState.errors.businessCategories.message as string}
            </p>
          )}
          <div className="pt-2">
            <Label className="text-xs text-muted-foreground">
              Select one or more options
            </Label>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
