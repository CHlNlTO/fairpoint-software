// app/(protected)/chart-of-accounts/coa-templates/page.tsx

'use client';

import { CoaTemplateDialog } from '@/features/chart-of-accounts/components/coa-templates/coa-template-dialog';
import { CoaTemplateViewDialog } from '@/features/chart-of-accounts/components/coa-templates/coa-template-view-dialog';
import { CoaTemplatesTable } from '@/features/chart-of-accounts/components/coa-templates/coa-templates-table';
import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import {
  useCoaTemplates,
  useCreateCoaTemplate,
  useDeleteCoaTemplate,
  useUpdateCoaTemplate,
} from '@/features/chart-of-accounts/hooks/use-coa-templates';
import type {
  CoaTemplate,
  CoaTemplateFilters,
  CoaTemplateFormData,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CoaTemplatesPage() {
  const { filters, updateFilters } = useCoaFilters<CoaTemplateFilters>({
    sort_by: 'template_name',
    sort_order: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
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
  const createMutation = useCreateCoaTemplate();
  const updateMutation = useUpdateCoaTemplate();
  const deleteMutation = useDeleteCoaTemplate();

  // Dialog handlers
  const handleCreate = () => {
    setSelectedCoaTemplate(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (coaTemplate: CoaTemplate) => {
    setSelectedCoaTemplate(coaTemplate);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (coaTemplate: CoaTemplate) => {
    setSelectedCoaTemplate(coaTemplate);
    setViewDialogOpen(true);
  };

  const handleDelete = (coaTemplate: CoaTemplate) => {
    setCoaTemplateToDelete(coaTemplate);
    setConfirmationDialogOpen(true);
  };

  // Form submission handlers
  const handleFormSubmit = async (data: CoaTemplateFormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (dialogMode === 'edit' && selectedCoaTemplate) {
      await updateMutation.mutateAsync({
        id: selectedCoaTemplate.id,
        ...data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (coaTemplateToDelete) {
      await deleteMutation.mutateAsync({ id: coaTemplateToDelete.id });
      setConfirmationDialogOpen(false);
      setCoaTemplateToDelete(undefined);
    }
  };

  const isLoadingForm = createMutation.isPending || updateMutation.isPending;
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

      {/* Create/Edit Dialog */}
      <CoaTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedCoaTemplate}
        onSubmit={handleFormSubmit}
        isLoading={isLoadingForm}
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
