// features/business-registration/components/steps/chart-of-accounts-step.tsx

'use client';

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
import { chartOfAccountsStepSchema } from '@/features/business-registration/lib/schemas';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';

interface ChartOfAccountsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface ChartOfAccountsFormData {
  coaSetupOption: 'default' | 'import';
  coaCsvData?: string;
}

export function ChartOfAccountsStep({
  data,
  onNext,
}: ChartOfAccountsStepProps) {
  const form = useForm<ChartOfAccountsFormData>({
    resolver: zodResolver(chartOfAccountsStepSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      coaSetupOption: (data.coaSetupOption as any) || 'default',
      coaCsvData: data.coaCsvData || '',
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => onNext({ ...data, ...value }));
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  const handleFile = async (file: File) => {
    const text = await file.text();
    form.setValue('coaCsvData', text);
  };

  const option = form.watch('coaSetupOption');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Set-up Chart of Accounts</CardTitle>
          <CardDescription>
            Use a default template or import your own CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>COA Setup Options</Label>
            <Select
              onValueChange={v =>
                form.setValue('coaSetupOption', v as 'default' | 'import')
              }
              defaultValue={form.watch('coaSetupOption')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Use Default Template</SelectItem>
                <SelectItem value="import">Import CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {option === 'default' ? (
            <p className="text-sm text-muted-foreground">
              We will use a default template based on your business categories
              and structure.
            </p>
          ) : (
            <div className="space-y-2">
              <Label>Upload CSV Template</Label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {form.formState.errors.coaCsvData && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.coaCsvData.message as string}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
