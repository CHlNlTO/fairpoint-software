// app/(protected)/chart-of-accounts/coa-templates/create/page.tsx

'use client';

import { CoaTemplateCombinedForm } from '@/features/chart-of-accounts/components/coa-templates/coa-template-combined-form';
import { useAccountClasses } from '@/features/chart-of-accounts/hooks/use-account-classes';
import { useAccountSubclasses } from '@/features/chart-of-accounts/hooks/use-account-subclasses';
import { useAccountSubtypes } from '@/features/chart-of-accounts/hooks/use-account-subtypes';
import { useAccountTypes } from '@/features/chart-of-accounts/hooks/use-account-types';
import { useBusinessTypes } from '@/features/chart-of-accounts/hooks/use-business-types';
import { useIndustryTypes } from '@/features/chart-of-accounts/hooks/use-industry-types';
import { useTaxTypes } from '@/features/chart-of-accounts/hooks/use-tax-types';
import type { CoaTemplateCombinedFormData } from '@/features/chart-of-accounts/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateCoaTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all required data
  const { data: taxTypes = [], isLoading: taxTypesLoading } = useTaxTypes();
  const { data: businessTypes = [], isLoading: businessTypesLoading } =
    useBusinessTypes();
  const { data: industryTypes = [], isLoading: industryTypesLoading } =
    useIndustryTypes();
  const { data: accountClasses = [], isLoading: accountClassesLoading } =
    useAccountClasses();
  const { data: accountSubclasses = [], isLoading: accountSubclassesLoading } =
    useAccountSubclasses();
  const { data: accountTypes = [], isLoading: accountTypesLoading } =
    useAccountTypes();
  const { data: accountSubtypes = [], isLoading: accountSubtypesLoading } =
    useAccountSubtypes();

  const isDataLoading =
    taxTypesLoading ||
    businessTypesLoading ||
    industryTypesLoading ||
    accountClassesLoading ||
    accountSubclassesLoading ||
    accountTypesLoading ||
    accountSubtypesLoading;

  const handleSubmit = async (data: CoaTemplateCombinedFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating COA template:', data);

      const response = await fetch('/api/chart-of-accounts/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create COA template');
      }

      toast.success('COA template created successfully');

      // Invalidate the cache to ensure fresh data is fetched
      await queryClient.invalidateQueries({
        queryKey: ['coa-templates'],
      });

      router.push('/chart-of-accounts/coa-templates');
    } catch (error) {
      console.error('Error creating COA template:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create COA template'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="bg-background"
    >
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <CoaTemplateCombinedForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="create"
          taxTypes={taxTypes}
          businessTypes={businessTypes}
          industryTypes={industryTypes}
          accountClasses={accountClasses}
          accountSubclasses={accountSubclasses}
          accountTypes={accountTypes}
          accountSubtypes={accountSubtypes}
        />
      </div>
    </motion.div>
  );
}
