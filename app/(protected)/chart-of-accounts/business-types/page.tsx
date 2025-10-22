// app/(protected)/chart-of-accounts/business-types/page.tsx

'use client';

import { BusinessTypeDialog } from '@/features/chart-of-accounts/components/business-types/business-type-dialog';
import { BusinessTypeViewDialog } from '@/features/chart-of-accounts/components/business-types/business-type-view-dialog';
import { BusinessTypesTable } from '@/features/chart-of-accounts/components/business-types/business-types-table';
import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import {
  useBusinessTypes,
  useCreateBusinessType,
  useDeleteBusinessType,
  useUpdateBusinessType,
} from '@/features/chart-of-accounts/hooks/use-business-types';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import type {
  BusinessType,
  BusinessTypeFilters,
  BusinessTypeFormData,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BusinessTypesPage() {
  const { filters, updateFilters } = useCoaFilters<BusinessTypeFilters>({
    sort_by: 'name',
    sort_order: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedBusinessType, setSelectedBusinessType] = useState<
    BusinessType | undefined
  >();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [businessTypeToDelete, setBusinessTypeToDelete] = useState<
    BusinessType | undefined
  >();

  // Data fetching
  const { data: businessTypes, isLoading } = useBusinessTypes(filters);

  // Mutations
  const createMutation = useCreateBusinessType();
  const updateMutation = useUpdateBusinessType();
  const deleteMutation = useDeleteBusinessType();

  // Dialog handlers
  const handleCreate = () => {
    setSelectedBusinessType(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (businessType: BusinessType) => {
    setSelectedBusinessType(businessType);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (businessType: BusinessType) => {
    setSelectedBusinessType(businessType);
    setViewDialogOpen(true);
  };

  const handleDelete = (businessType: BusinessType) => {
    setBusinessTypeToDelete(businessType);
    setConfirmationDialogOpen(true);
  };

  // Form submission handlers
  const handleFormSubmit = async (data: BusinessTypeFormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (dialogMode === 'edit' && selectedBusinessType) {
      await updateMutation.mutateAsync({
        id: selectedBusinessType.id,
        ...data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (businessTypeToDelete) {
      await deleteMutation.mutateAsync({ id: businessTypeToDelete.id });
      setConfirmationDialogOpen(false);
      setBusinessTypeToDelete(undefined);
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
        <h1 className="text-3xl font-bold tracking-tight">Business Types</h1>
        <p className="text-muted-foreground">
          Manage different types of business structures for categorization and
          reporting.
        </p>
      </div>

      <BusinessTypesTable
        data={businessTypes}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* Create/Edit Dialog */}
      <BusinessTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedBusinessType}
        onSubmit={handleFormSubmit}
        isLoading={isLoadingForm}
      />

      {/* View Dialog */}
      {selectedBusinessType && (
        <BusinessTypeViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          businessType={selectedBusinessType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CoaConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        title="Delete Business Type"
        description={`Are you sure you want to delete "${businessTypeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
        variant="destructive"
      />
    </motion.div>
  );
}
