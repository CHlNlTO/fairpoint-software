// features/business-registration/components/steps/government-credentials-step.tsx

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
import type {
  BusinessRegistrationData,
  GovernmentCredential,
  GovernmentRegistrationStatus,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { governmentCredentialsStepSchema } from '../../lib/schemas';

interface GovernmentCredentialsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface GovernmentCredentialsFormData {
  governmentCredentials: GovernmentCredential[];
}

const AGENCY_LABELS: Record<string, string> = {
  BIR: 'BIR',
  DTI: 'DTI',
  LGU: 'LGU',
  SEC: 'SEC',
  CDA: 'CDA',
};

function getSuggestedAgencies(
  businessStructure?: BusinessRegistrationData['businessType']
): string[] {
  // Map UI structure to agencies per flowchart
  // Note: UI "businessType" currently includes structures; adapt mapping accordingly
  switch (businessStructure) {
    case 'sole-proprietorship':
      return ['BIR', 'DTI', 'LGU'];
    case 'partnership':
    case 'corporation':
      return ['BIR', 'SEC', 'LGU'];
    default:
      // Treat others as freelancing/sole prop equivalent unless Cooperative supported later
      return ['BIR', 'DTI', 'LGU'];
  }
}

export function GovernmentCredentialsStep({
  data,
  onNext,
}: GovernmentCredentialsStepProps) {
  const suggestedAgencies = React.useMemo(
    () => getSuggestedAgencies(data.businessType),
    [data.businessType]
  );

  const defaultRows: GovernmentCredential[] = React.useMemo(() => {
    const fromExisting = data.governmentCredentials || [];
    const existingByAgency = new Map(fromExisting.map(a => [a.agencyCode, a]));
    return suggestedAgencies.map(
      code =>
        existingByAgency.get(code) || {
          agencyCode: code,
          status: 'registered',
        }
    );
  }, [data.governmentCredentials, suggestedAgencies]);

  const form = useForm<GovernmentCredentialsFormData>({
    resolver: zodResolver(governmentCredentialsStepSchema as never),
    defaultValues: {
      governmentCredentials: defaultRows,
    },
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: 'governmentCredentials',
  });

  // Push updates upward on change
  React.useEffect(() => {
    const subscription = form.watch(value => {
      onNext({ ...data, ...value });
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
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Government Credentials</CardTitle>
          <CardDescription>
            Provide registration details for the suggested agencies based on
            your business structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Agency</Label>
                  <Input
                    value={AGENCY_LABELS[field.agencyCode] || field.agencyCode}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`status-${index}`}>Status</Label>
                  <Select
                    onValueChange={value =>
                      update(index, {
                        ...field,
                        status: value as GovernmentRegistrationStatus,
                      })
                    }
                    defaultValue={(field.status || 'registered') as string}
                  >
                    <SelectTrigger id={`status-${index}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {['registered', 'pending', 'expired', 'cancelled'].map(
                        s => (
                          <SelectItem key={s} value={s}>
                            {s[0].toUpperCase() + s.slice(1)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`regnum-${index}`}>Registration Number</Label>
                  <Input
                    id={`regnum-${index}`}
                    placeholder="Enter registration number"
                    defaultValue={field.registrationNumber || ''}
                    onChange={e =>
                      update(index, {
                        ...field,
                        registrationNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`regdate-${index}`}>Registration Date</Label>
                  <Input
                    id={`regdate-${index}`}
                    type="date"
                    defaultValue={field.registrationDate || ''}
                    onChange={e =>
                      update(index, {
                        ...field,
                        registrationDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`expdate-${index}`}>Expiry Date</Label>
                  <Input
                    id={`expdate-${index}`}
                    type="date"
                    defaultValue={field.expiryDate || ''}
                    onChange={e =>
                      update(index, { ...field, expiryDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
