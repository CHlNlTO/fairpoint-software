// features/business-registration/components/steps/government-credentials-step.tsx

'use client';

import type {
  BusinessRegistrationData,
  GovernmentAgency,
} from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface GovernmentCredentialsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface GovernmentCredentialsFormData {
  governmentAgencies: GovernmentAgency[];
}

const OPTIONS: { value: GovernmentAgency; label: string; emoji: string }[] = [
  { value: 'BIR', label: 'BIR', emoji: '📊' },
  { value: 'DTI', label: 'DTI', emoji: '🏢' },
  { value: 'LGU', label: 'LGU', emoji: '🏛️' },
  { value: 'SEC', label: 'SEC', emoji: '⚖️' },
  { value: 'CDA', label: 'CDA', emoji: '🤝' },
];

function getFilteredAgencies(
  businessStructure?: BusinessRegistrationData['businessStructure']
): GovernmentAgency[] {
  switch (businessStructure) {
    case 'freelancing':
    case 'sole_proprietorship':
      return ['BIR', 'DTI', 'LGU'];
    case 'partnership':
    case 'corporation':
      return ['BIR', 'SEC', 'LGU'];
    case 'cooperative':
      return ['BIR', 'CDA'];
    default:
      // Show all agencies if no business structure is selected
      return ['BIR', 'DTI', 'LGU', 'SEC', 'CDA'];
  }
}

export function GovernmentCredentialsStep({
  data,
  onNext,
}: GovernmentCredentialsStepProps) {
  const filteredAgencies = React.useMemo(
    () => getFilteredAgencies(data.businessStructure),
    [data.businessStructure]
  );

  // Simple state management for form data (matching business-categories-step pattern)
  const [formData, setFormData] = React.useState<GovernmentCredentialsFormData>(
    {
      governmentAgencies: (data.governmentAgencies as GovernmentAgency[]) || [],
    }
  );

  // Update global state whenever form data changes
  React.useEffect(() => {
    onNext({ ...data, ...formData });
  }, [formData, onNext]);

  const toggle = (value: GovernmentAgency) => {
    const current = new Set(formData.governmentAgencies);
    if (current.has(value)) current.delete(value);
    else current.add(value);

    const newAgencies = Array.from(current);
    setFormData(prev => ({ ...prev, governmentAgencies: newAgencies }));
  };

  const selected = new Set(formData.governmentAgencies);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            <span className="font-bold">Which government agencies</span> <br />{' '}
            are you registered with?
          </h2>
          <p className="text-muted-foreground">Select all that applies.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPTIONS.filter(opt => filteredAgencies.includes(opt.value)).map(
            opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`rounded-2xl border py-6 px-6 text-lg font-semibold shadow-sm transition-colors text-left ${
                  selected.has(opt.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card hover:bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  <span>{opt.label}</span>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
