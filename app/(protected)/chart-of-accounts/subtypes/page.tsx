// app/(protected)/chart-of-accounts/subtypes/page.tsx

'use client';

import { AccountSubtypeDialog } from '@/features/chart-of-accounts/components/account-subtypes/account-subtype-dialog';
import { AccountSubtypeViewDialog } from '@/features/chart-of-accounts/components/account-subtypes/account-subtype-view-dialog';
import { AccountSubtypesTable } from '@/features/chart-of-accounts/components/account-subtypes/account-subtypes-table';
import { useAccountSubtypes } from '@/features/chart-of-accounts/hooks/use-account-subtypes';
import { useCoaFilters } from '@/features/chart-of-accounts/hooks/use-coa-filters';
import type {
  AccountSubtype,
  AccountSubtypeFilters,
} from '@/features/chart-of-accounts/lib/types';
import { motion } from 'framer-motion';
import * as React from 'react';

export default function AccountSubtypesPage() {
  const { filters, updateFilters } = useCoaFilters<AccountSubtypeFilters>({
    sort_by: 'code',
    sort_order: 'asc',
  });

  const {
    data: accountSubtypes = [],
    isLoading,
    isError,
  } = useAccountSubtypes(filters);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>(
    'create'
  );
  const [selectedAccountSubtype, setSelectedAccountSubtype] = React.useState<
    AccountSubtype | undefined
  >(undefined);

  const handleCreateNew = () => {
    setDialogMode('create');
    setSelectedAccountSubtype(undefined);
    setIsDialogOpen(true);
  };

  const handleEditAccountSubtype = (accountSubtype: AccountSubtype) => {
    setDialogMode('edit');
    setSelectedAccountSubtype(accountSubtype);
    setIsDialogOpen(true);
  };

  const handleDeleteAccountSubtype = (accountSubtype: AccountSubtype) => {
    // This will be handled by the actions component
    console.log('Delete account subtype:', accountSubtype);
  };

  const handleViewAccountSubtype = (accountSubtype: AccountSubtype) => {
    setSelectedAccountSubtype(accountSubtype);
    setIsViewDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Subtypes
          </h1>
          <p className="text-muted-foreground">
            Manage the specific subtypes of accounts within each account type.
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading account subtypes. Please try again.
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
        <h1 className="text-3xl font-bold tracking-tight">Account Subtypes</h1>
        <p className="text-muted-foreground">
          Manage the specific subtypes of accounts within each account type.
        </p>
      </div>

      <AccountSubtypesTable
        onEdit={handleEditAccountSubtype}
        onDelete={handleDeleteAccountSubtype}
        onView={handleViewAccountSubtype}
        onCreate={handleCreateNew}
      />

      <AccountSubtypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={selectedAccountSubtype}
      />

      <AccountSubtypeViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        accountSubtype={selectedAccountSubtype}
      />
    </motion.div>
  );
}
