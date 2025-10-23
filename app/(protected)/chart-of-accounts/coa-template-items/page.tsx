// app/(protected)/chart-of-accounts/coa-template-items/page.tsx

'use client';

import { CoaTemplateItemsTable } from '@/features/chart-of-accounts/components/coa-template-items/coa-template-items-table';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import { useCoaTemplateItems } from '@/features/chart-of-accounts/hooks/use-coa-template-items';
import type { CoaTemplateItemFilters } from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';

export default function CoaTemplateItemsPage() {
  const { filters, updateFilters } = useCoaFilters<CoaTemplateItemFilters>();

  // Data fetching
  const { data: templateItems, isLoading } = useCoaTemplateItems(filters);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          COA Template Items
        </h1>
        <p className="text-muted-foreground">
          View and manage all chart of accounts template items across all
          templates.
        </p>
      </div>

      <CoaTemplateItemsTable
        data={templateItems}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
      />
    </motion.div>
  );
}
