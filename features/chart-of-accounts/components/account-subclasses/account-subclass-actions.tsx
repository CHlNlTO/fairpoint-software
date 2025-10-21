// features/chart-of-accounts/components/account-subclasses/account-subclass-actions.tsx

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
import { useDeleteAccountSubclass } from '../../hooks/use-account-subclasses';
import type { AccountSubclass } from '../../lib/types';
import { CoaConfirmationDialog } from '../shared/coa-confirmation-dialog';

interface AccountSubclassActionsProps {
  accountSubclass: AccountSubclass;
  onEdit: (accountSubclass: AccountSubclass) => void;
  onDelete: (accountSubclass: AccountSubclass) => void;
  onView?: (accountSubclass: AccountSubclass) => void;
}

export function AccountSubclassActions({
  accountSubclass,
  onEdit,
  onDelete,
  onView,
}: AccountSubclassActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const deleteMutation = useDeleteAccountSubclass();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: accountSubclass.id });
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
              <DropdownMenuItem onClick={() => onView(accountSubclass)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => onEdit(accountSubclass)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CoaConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${accountSubclass.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
