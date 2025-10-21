// features/chart-of-accounts/components/account-subtypes/account-subtype-actions.tsx

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
import { useDeleteAccountSubtype } from '../../hooks/use-account-subtypes';
import type { AccountSubtype } from '../../lib/types';
import { CoaConfirmationDialog } from '../shared/coa-confirmation-dialog';

interface AccountSubtypeActionsProps {
  accountSubtype: AccountSubtype;
  onEdit: (accountSubtype: AccountSubtype) => void;
  onDelete: (accountSubtype: AccountSubtype) => void;
  onView?: (accountSubtype: AccountSubtype) => void;
}

export function AccountSubtypeActions({
  accountSubtype,
  onEdit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDelete,
  onView,
}: AccountSubtypeActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const deleteMutation = useDeleteAccountSubtype();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: accountSubtype.id });
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
              <DropdownMenuItem onClick={() => onView(accountSubtype)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {!accountSubtype.is_system_defined && (
            <>
              <DropdownMenuItem onClick={() => onEdit(accountSubtype)}>
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
        description={`Are you sure you want to delete "${accountSubtype.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
