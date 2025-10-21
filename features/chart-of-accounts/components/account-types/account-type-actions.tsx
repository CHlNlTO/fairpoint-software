// features/chart-of-accounts/components/account-types/account-type-actions.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { useDeleteAccountType } from '../../hooks/use-account-types';
import type { AccountType } from '../../lib/types';
import { CoaConfirmationDialog } from '../shared/coa-confirmation-dialog';

interface AccountTypeActionsProps {
  accountType: AccountType;
  onEdit: (accountType: AccountType) => void;
  onDelete: (accountType: AccountType) => void;
  onView?: (accountType: AccountType) => void;
}

export function AccountTypeActions({
  accountType,
  onEdit,
  onDelete,
  onView,
}: AccountTypeActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const deleteMutation = useDeleteAccountType();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: accountType.id });
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <>
              <DropdownMenuItem onClick={() => onView(accountType)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {!accountType.is_system_defined && (
            <>
              <DropdownMenuItem onClick={() => onEdit(accountType)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CoaConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${accountType.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
