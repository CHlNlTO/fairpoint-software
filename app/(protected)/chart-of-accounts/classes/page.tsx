// app/(protected)/chart-of-accounts/classes/page.tsx

'use client';

import { AccountClassDialog } from '@/features/chart-of-accounts/components/account-classes/account-class-dialog';
import { AccountClassViewDialog } from '@/features/chart-of-accounts/components/account-classes/account-class-view-dialog';
import { AccountClassesTable } from '@/features/chart-of-accounts/components/account-classes/account-classes-table';
import { CoaConfirmationDialog } from '@/features/chart-of-accounts/components/shared/coa-confirmation-dialog';
import {
  useAccountClasses,
  useCreateAccountClass,
  useDeleteAccountClass,
  useUpdateAccountClass,
} from '@/features/chart-of-accounts/hooks/use-account-classes';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import type {
  AccountClass,
  AccountClassFormData,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AccountClassesPage() {
  const { filters, updateFilters } = useCoaFilters();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAccountClass, setSelectedAccountClass] = useState<
    AccountClass | undefined
  >();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [accountClassToDelete, setAccountClassToDelete] = useState<
    AccountClass | undefined
  >();

  // Data fetching
  const { data: accountClasses, isLoading } = useAccountClasses(filters);

  // Mutations
  const createMutation = useCreateAccountClass();
  const updateMutation = useUpdateAccountClass();
  const deleteMutation = useDeleteAccountClass();

  // Dialog handlers
  const handleCreate = () => {
    setSelectedAccountClass(undefined);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (accountClass: AccountClass) => {
    setSelectedAccountClass(accountClass);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (accountClass: AccountClass) => {
    setSelectedAccountClass(accountClass);
    setViewDialogOpen(true);
  };

  const handleDelete = (accountClass: AccountClass) => {
    setAccountClassToDelete(accountClass);
    setConfirmationDialogOpen(true);
  };

  // Form submission handlers
  const handleFormSubmit = async (data: AccountClassFormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (dialogMode === 'edit' && selectedAccountClass) {
      await updateMutation.mutateAsync({
        id: selectedAccountClass.id,
        ...data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (accountClassToDelete) {
      await deleteMutation.mutateAsync({ id: accountClassToDelete.id });
      setConfirmationDialogOpen(false);
      setAccountClassToDelete(undefined);
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
        <h1 className="text-3xl font-bold tracking-tight">Account Classes</h1>
        <p className="text-muted-foreground">
          Manage account classification hierarchy for your chart of accounts.
        </p>
      </div>

      <AccountClassesTable
        data={accountClasses}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      {/* Create/Edit Dialog */}
      <AccountClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedAccountClass}
        onSubmit={handleFormSubmit}
        isLoading={isLoadingForm}
      />

      {/* View Dialog */}
      <AccountClassViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        accountClass={selectedAccountClass}
      />

      {/* Delete Confirmation Dialog */}
      <CoaConfirmationDialog
        open={confirmationDialogOpen}
        onOpenChange={setConfirmationDialogOpen}
        title="Delete Account Class"
        description={`Are you sure you want to delete "${accountClassToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isLoadingDelete}
        variant="destructive"
      />
    </motion.div>
  );
}
