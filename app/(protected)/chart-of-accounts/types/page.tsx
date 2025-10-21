// app/(protected)/chart-of-accounts/types/page.tsx

'use client';

import { AccountTypeDialog } from '@/features/chart-of-accounts/components/account-types/account-type-dialog';
import { AccountTypeViewDialog } from '@/features/chart-of-accounts/components/account-types/account-type-view-dialog';
import { AccountTypesTable } from '@/features/chart-of-accounts/components/account-types/account-types-table';
import { useAccountTypes } from '@/features/chart-of-accounts/hooks/use-account-types';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import type {
  AccountType,
  AccountTypeFilters,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import * as React from 'react';

export default function AccountTypesPage() {
  const { filters, updateFilters } = useCoaFilters<AccountTypeFilters>({
    sort_by: 'code',
    sort_order: 'asc',
  });

  const {
    data: accountTypes = [],
    isLoading,
    isError,
  } = useAccountTypes(filters);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>(
    'create'
  );
  const [selectedAccountType, setSelectedAccountType] = React.useState<
    AccountType | undefined
  >(undefined);

  const handleCreateNew = () => {
    setDialogMode('create');
    setSelectedAccountType(undefined);
    setIsDialogOpen(true);
  };

  const handleEditAccountType = (accountType: AccountType) => {
    setDialogMode('edit');
    setSelectedAccountType(accountType);
    setIsDialogOpen(true);
  };

  const handleDeleteAccountType = (accountType: AccountType) => {
    // This will be handled by the actions component
    console.log('Delete account type:', accountType);
  };

  const handleViewAccountType = (accountType: AccountType) => {
    setSelectedAccountType(accountType);
    setIsViewDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account Types</h1>
          <p className="text-muted-foreground">
            Manage the specific types of accounts within each account subclass.
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading account types. Please try again.
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
        <h1 className="text-3xl font-bold tracking-tight">Account Types</h1>
        <p className="text-muted-foreground">
          Manage the specific types of accounts within each account subclass.
        </p>
      </div>

      <AccountTypesTable
        data={accountTypes}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={updateFilters}
        onEdit={handleEditAccountType}
        onDelete={handleDeleteAccountType}
        onView={handleViewAccountType}
        onCreate={handleCreateNew}
      />

      <AccountTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={selectedAccountType}
      />

      <AccountTypeViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        accountType={selectedAccountType}
      />
    </motion.div>
  );
}
