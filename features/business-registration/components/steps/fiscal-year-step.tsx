// features/business-registration/components/steps/fiscal-year-step.tsx

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
import { fiscalYearStepSchema } from '@/features/business-registration/lib/schemas';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FiscalYearStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

type FiscalYearFormData = Pick<
  BusinessRegistrationData,
  | 'fiscalYearPeriodId'
  | 'fiscalYearCustomStartMonth'
  | 'fiscalYearCustomStartDay'
  | 'fiscalYearCustomEndMonth'
  | 'fiscalYearCustomEndDay'
>;

export function FiscalYearStep({ data, onNext }: FiscalYearStepProps) {
  const form = useForm<FiscalYearFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fiscalYearStepSchema) as any,
    defaultValues: {
      fiscalYearPeriodId:
        (data.fiscalYearPeriodId as
          | 'standard-jan-dec'
          | 'standard-jun-jul'
          | 'custom'
          | undefined) || 'standard-jan-dec',
      fiscalYearCustomStartMonth: data.fiscalYearCustomStartMonth,
      fiscalYearCustomStartDay: data.fiscalYearCustomStartDay,
      fiscalYearCustomEndMonth: data.fiscalYearCustomEndMonth,
      fiscalYearCustomEndDay: data.fiscalYearCustomEndDay,
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => onNext({ ...data, ...value }));
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  const isCustom = form.watch('fiscalYearPeriodId') === 'custom';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Tell us when to start tracking</CardTitle>
          <CardDescription>Choose your fiscal year period.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Fiscal Year</Label>
            <Select
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={v => form.setValue('fiscalYearPeriodId', v as any)}
              defaultValue={form.watch('fiscalYearPeriodId') as string}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard-jan-dec">
                  Standard Calendar Year (Jan 1 - Dec 31)
                </SelectItem>
                <SelectItem value="standard-jun-jul">
                  Fiscal Year (Jun 1 - May 31)
                </SelectItem>
                <SelectItem value="custom">Other Period</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start (MM/DD)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="MM"
                    {...form.register('fiscalYearCustomStartMonth', {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    placeholder="DD"
                    {...form.register('fiscalYearCustomStartDay', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>End (MM/DD)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="MM"
                    {...form.register('fiscalYearCustomEndMonth', {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    placeholder="DD"
                    {...form.register('fiscalYearCustomEndDay', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
