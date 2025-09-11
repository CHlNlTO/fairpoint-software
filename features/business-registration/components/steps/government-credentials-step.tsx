// features/business-registration/components/steps/government-credentials-step.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type {
  BusinessRegistrationData,
  GovernmentAgency,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import { governmentCredentialsStepSchema } from '../../lib/schemas';

interface GovernmentCredentialsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface GovernmentCredentialsFormData {
  governmentAgencies?: GovernmentAgency[];
}

const OPTIONS: { value: GovernmentAgency; label: string; emoji: string }[] = [
  { value: 'BIR', label: 'BIR', emoji: '📊' },
  { value: 'DTI', label: 'DTI', emoji: '🏢' },
  { value: 'LGU', label: 'LGU', emoji: '🏛️' },
  { value: 'SEC', label: 'SEC', emoji: '⚖️' },
  { value: 'CDA', label: 'CDA', emoji: '🤝' },
];

function getSuggestedAgencies(
  businessStructure?: BusinessRegistrationData['businessStructure']
): GovernmentAgency[] {
  switch (businessStructure) {
    case 'freelancing':
    case 'sole-proprietorship':
      return ['BIR', 'DTI', 'LGU'];
    case 'partnership':
    case 'corporation':
      return ['BIR', 'SEC', 'LGU'];
    case 'cooperative':
      return ['BIR', 'CDA'];
    default:
      return ['BIR', 'DTI', 'LGU'];
  }
}

export function GovernmentCredentialsStep({
  data,
  onNext,
}: GovernmentCredentialsStepProps) {
  const suggestedAgencies = React.useMemo(
    () => getSuggestedAgencies(data.businessStructure),
    [data.businessStructure]
  );

  const form = useForm<GovernmentCredentialsFormData>({
    resolver: zodResolver(governmentCredentialsStepSchema),
    defaultValues: {
      governmentAgencies: data.governmentAgencies || [],
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Ensure governmentAgencies is always GovernmentAgency[] (no undefineds)
      const cleanedValue = {
        ...value,
        governmentAgencies: Array.isArray(value.governmentAgencies)
          ? value.governmentAgencies.filter(
              (agency): agency is GovernmentAgency =>
                typeof agency === 'string' && !!agency
            )
          : [],
      };
      onNext({ ...data, ...cleanedValue });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  const toggle = (value: GovernmentAgency) => {
    const current = new Set(form.getValues('governmentAgencies') || []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    form.setValue('governmentAgencies', Array.from(current));
  };

  const selected = new Set(form.watch('governmentAgencies') || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            Which government agencies are you registered with?
          </CardTitle>
          <CardDescription>
            Select all agencies where your business is registered. Based on your
            business structure, we suggest: {suggestedAgencies.join(', ')}.
          </CardDescription>
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
          {form.formState.errors.governmentAgencies && (
            <p className="text-sm text-destructive">
              {form.formState.errors.governmentAgencies.message as string}
            </p>
          )}
          <div className="pt-2">
            <Label className="text-xs text-muted-foreground">
              Select all agencies where your business is registered
            </Label>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
