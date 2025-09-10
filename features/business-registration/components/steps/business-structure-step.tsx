// features/business-registration/components/steps/business-structure-step.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { businessStructureStepSchema } from '@/features/business-registration/lib/schemas';
import type {
  BusinessRegistrationData,
  BusinessStructure,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BusinessStructureStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface BusinessStructureFormData {
  businessStructure: BusinessStructure;
}

const OPTIONS: { value: BusinessStructure; label: string; emoji: string }[] = [
  { value: 'freelancing', label: 'Freelance', emoji: '✍️' },
  { value: 'sole-proprietorship', label: 'Sole Proprietorship', emoji: '🧑‍💼' },
  { value: 'partnership', label: 'Partnership', emoji: '🤝' },
  { value: 'corporation', label: 'Corporation', emoji: '🏢' },
  { value: 'cooperative', label: 'Cooperative', emoji: '🌱' },
];

export function BusinessStructureStep({
  data,
  onNext,
}: BusinessStructureStepProps) {
  const form = useForm<BusinessStructureFormData>({
    resolver: zodResolver(businessStructureStepSchema),
    defaultValues: {
      businessStructure:
        (data.businessStructure as BusinessStructure) || 'freelancing',
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => onNext({ ...data, ...value }));
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  const selected = form.watch('businessStructure');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Tell us about your business setup</CardTitle>
          <CardDescription>Select one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => form.setValue('businessStructure', opt.value)}
                className={`rounded-2xl border py-6 px-6 text-lg font-semibold shadow-sm transition-colors text-left ${
                  selected === opt.value
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
