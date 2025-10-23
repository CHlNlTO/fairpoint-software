// app/(protected)/chart-of-accounts/coa-templates/page.tsx

'use client';

import { CoaTemplateViewDialog } from '@/features/chart-of-accounts/components/coa-templates/coa-template-view-dialog';
import { CoaTemplatesTable } from '@/features/chart-of-accounts/components/coa-templates/coa-templates-table';
import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import {
  useCoaTemplates,
  useDeleteCoaTemplate,
} from '@/features/chart-of-accounts/hooks/use-coa-templates';
import type {
  CoaTemplate,
  CoaTemplateFilters,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CoaTemplatesPage() {
  const router = useRouter();
  const { filters, updateFilters } = useCoaFilters<CoaTemplateFilters>({
    sort_by: 'template_name',
    sort_order: 'asc',
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCoaTemplate, setSelectedCoaTemplate] = useState<
    CoaTemplate | undefined
  >();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [coaTemplateToDelete, setCoaTemplateToDelete] = useState<
    CoaTemplate | undefined
  >();

  // Data fetching
  const { data: coaTemplates, isLoading } = useCoaTemplates(filters);

  // Mutations
  const deleteMutation = useDeleteCoaTemplate();

  // Navigation handlers
  const handleCreate = () => {
    router.push('/chart-of-accounts/coa-templates/create');
  };

  const handleEdit = (coaTemplate: CoaTemplate) => {
    router.push(`/chart-of-accounts/coa-templates/edit/${coaTemplate.id}`);
  };

  const handleView = (coaTemplate: CoaTemplate) => {
    setSelectedCoaTemplate(coaTemplate);
    setViewDialogOpen(true);
  };

  const handleDelete = (coaTemplate: CoaTemplate) => {
    setCoaTemplateToDelete(coaTemplate);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (coaTemplateToDelete) {
      await deleteMutation.mutateAsync({ id: coaTemplateToDelete.id });
      setConfirmationDialogOpen(false);
      setCoaTemplateToDelete(undefined);
    }
  };

  const isLoadingDelete = deleteMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">COA Templates</h1>
        <p className="text-muted-foreground">
          Manage chart of accounts templates for different business types and
          industries.
        </p>
      </div>

      <CoaTemplatesTable
        data={coaTemplates}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* View Dialog */}
      {selectedCoaTemplate && (
        <CoaTemplateViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          coaTemplate={selectedCoaTemplate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CoaConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        title="Delete COA Template"
        description={`Are you sure you want to delete "${coaTemplateToDelete?.template_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
        variant="destructive"
      />
    </motion.div>
  );
}
