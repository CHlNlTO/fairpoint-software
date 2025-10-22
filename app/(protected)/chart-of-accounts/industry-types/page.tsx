// app/(protected)/chart-of-accounts/industry-types/page.tsx

'use client';

import { IndustryTypeDialog } from '@/features/chart-of-accounts/components/industry-types/industry-type-dialog';
import { IndustryTypeViewDialog } from '@/features/chart-of-accounts/components/industry-types/industry-type-view-dialog';
import { IndustryTypesTable } from '@/features/chart-of-accounts/components/industry-types/industry-types-table';
import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import {
  useCreateIndustryType,
  useDeleteIndustryType,
  useIndustryTypes,
  useUpdateIndustryType,
} from '@/features/chart-of-accounts/hooks/use-industry-types';
import type {
  IndustryType,
  IndustryTypeFilters,
  IndustryTypeFormData,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function IndustryTypesPage() {
  const { filters, updateFilters } = useCoaFilters<IndustryTypeFilters>({
    sort_by: 'name',
    sort_order: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedIndustryType, setSelectedIndustryType] = useState<
    IndustryType | undefined
  >();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [industryTypeToDelete, setIndustryTypeToDelete] = useState<
    IndustryType | undefined
  >();

  // Data fetching
  const { data: industryTypes, isLoading } = useIndustryTypes(filters);

  // Mutations
  const createMutation = useCreateIndustryType();
  const updateMutation = useUpdateIndustryType();
  const deleteMutation = useDeleteIndustryType();

  // Dialog handlers
  const handleCreate = () => {
    setSelectedIndustryType(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (industryType: IndustryType) => {
    setSelectedIndustryType(industryType);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (industryType: IndustryType) => {
    setSelectedIndustryType(industryType);
    setViewDialogOpen(true);
  };

  const handleDelete = (industryType: IndustryType) => {
    setIndustryTypeToDelete(industryType);
    setConfirmationDialogOpen(true);
  };

  // Form submission handlers
  const handleFormSubmit = async (data: IndustryTypeFormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (dialogMode === 'edit' && selectedIndustryType) {
      await updateMutation.mutateAsync({
        id: selectedIndustryType.id,
        ...data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (industryTypeToDelete) {
      await deleteMutation.mutateAsync({ id: industryTypeToDelete.id });
      setConfirmationDialogOpen(false);
      setIndustryTypeToDelete(undefined);
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
        <h1 className="text-3xl font-bold tracking-tight">Industry Types</h1>
        <p className="text-muted-foreground">
          Manage different industry classifications for business categorization
          and reporting.
        </p>
      </div>

      <IndustryTypesTable
        data={industryTypes}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* Create/Edit Dialog */}
      <IndustryTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedIndustryType}
        onSubmit={handleFormSubmit}
        isLoading={isLoadingForm}
      />

      {/* View Dialog */}
      {selectedIndustryType && (
        <IndustryTypeViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          industryType={selectedIndustryType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CoaConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        title="Delete Industry Type"
        description={`Are you sure you want to delete "${industryTypeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
        variant="destructive"
      />
    </motion.div>
  );
}
