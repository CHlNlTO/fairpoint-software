// app/(protected)/chart-of-accounts/tax-types/page.tsx

'use client';

import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import { TaxTypeDialog } from '@/features/chart-of-accounts/components/tax-types/tax-type-dialog';
import { TaxTypeViewDialog } from '@/features/chart-of-accounts/components/tax-types/tax-type-view-dialog';
import { TaxTypesTable } from '@/features/chart-of-accounts/components/tax-types/tax-types-table';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import {
  useCreateTaxType,
  useDeleteTaxType,
  useTaxTypes,
  useUpdateTaxType,
} from '@/features/chart-of-accounts/hooks/use-tax-types';
import type {
  TaxType,
  TaxTypeFilters,
  TaxTypeFormData,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TaxTypesPage() {
  const { filters, updateFilters } = useCoaFilters<TaxTypeFilters>({
    sort_by: 'name',
    sort_order: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedTaxType, setSelectedTaxType] = useState<TaxType | undefined>();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [taxTypeToDelete, setTaxTypeToDelete] = useState<TaxType | undefined>();

  // Data fetching
  const { data: taxTypes, isLoading } = useTaxTypes(filters);

  // Mutations
  const createMutation = useCreateTaxType();
  const updateMutation = useUpdateTaxType();
  const deleteMutation = useDeleteTaxType();

  // Dialog handlers
  const handleCreate = () => {
    setSelectedTaxType(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (taxType: TaxType) => {
    setSelectedTaxType(taxType);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (taxType: TaxType) => {
    setSelectedTaxType(taxType);
    setViewDialogOpen(true);
  };

  const handleDelete = (taxType: TaxType) => {
    setTaxTypeToDelete(taxType);
    setConfirmationDialogOpen(true);
  };

  // Form submission handlers
  const handleFormSubmit = async (data: TaxTypeFormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (dialogMode === 'edit' && selectedTaxType) {
      await updateMutation.mutateAsync({
        id: selectedTaxType.id,
        ...data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (taxTypeToDelete) {
      await deleteMutation.mutateAsync({ id: taxTypeToDelete.id });
      setConfirmationDialogOpen(false);
      setTaxTypeToDelete(undefined);
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
        <h1 className="text-3xl font-bold tracking-tight">Tax Types</h1>
        <p className="text-muted-foreground">
          Manage different tax classifications for accurate tax reporting and
          compliance.
        </p>
      </div>

      <TaxTypesTable
        data={taxTypes}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* Create/Edit Dialog */}
      <TaxTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedTaxType}
        onSubmit={handleFormSubmit}
        isLoading={isLoadingForm}
      />

      {/* View Dialog */}
      {selectedTaxType && (
        <TaxTypeViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          taxType={selectedTaxType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CoaConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        title="Delete Tax Type"
        description={`Are you sure you want to delete "${taxTypeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
        variant="destructive"
      />
    </motion.div>
  );
}
