// app/(protected)/chart-of-accounts/subclasses/page.tsx

'use client';

import { AccountSubclassDialog } from '@/features/chart-of-accounts/components/account-subclasses/account-subclass-dialog';
import { AccountSubclassViewDialog } from '@/features/chart-of-accounts/components/account-subclasses/account-subclass-view-dialog';
import { AccountSubclassesTable } from '@/features/chart-of-accounts/components/account-subclasses/account-subclasses-table';
import { useAccountSubclasses } from '@/features/chart-of-accounts/hooks/use-account-subclasses';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import type {
  AccountSubclass,
  AccountSubclassFilters,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import * as React from 'react';

export default function AccountSubclassesPage() {
  const { filters, updateFilters } = useCoaFilters<AccountSubclassFilters>({
    sort_by: 'code',
    sort_order: 'asc',
  });

  const {
    data: accountSubclasses = [],
    isLoading,
    isError,
  } = useAccountSubclasses(filters);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>(
    'create'
  );
  const [selectedAccountSubclass, setSelectedAccountSubclass] = React.useState<
    AccountSubclass | undefined
  >(undefined);

  const handleCreateNew = () => {
    setDialogMode('create');
    setSelectedAccountSubclass(undefined);
    setIsDialogOpen(true);
  };

  const handleEditAccountSubclass = (accountSubclass: AccountSubclass) => {
    setDialogMode('edit');
    setSelectedAccountSubclass(accountSubclass);
    setIsDialogOpen(true);
  };

  const handleDeleteAccountSubclass = (accountSubclass: AccountSubclass) => {
    // This will be handled by the actions component
    console.log('Delete account subclass:', accountSubclass);
  };

  const handleViewAccountSubclass = (accountSubclass: AccountSubclass) => {
    setSelectedAccountSubclass(accountSubclass);
    setIsViewDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Subclasses
          </h1>
          <p className="text-muted-foreground">
            Manage the sub-classification of accounts within each account class.
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading account subclasses. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Account Subclasses
        </h1>
        <p className="text-muted-foreground">
          Manage the sub-classification of accounts within each account class.
        </p>
      </div>

      <AccountSubclassesTable
        data={accountSubclasses}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEditAccountSubclass}
        onDelete={handleDeleteAccountSubclass}
        onView={handleViewAccountSubclass}
        onCreate={handleCreateNew}
      />

      <AccountSubclassDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={selectedAccountSubclass}
      />

      <AccountSubclassViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        accountSubclass={selectedAccountSubclass}
      />
    </motion.div>
  );
}
