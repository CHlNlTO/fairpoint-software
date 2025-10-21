// features/chart-of-accounts/components/account-subclasses/account-subclass-view-dialog.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { AccountSubclass } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface AccountSubclassViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountSubclass?: AccountSubclass;
}

export function AccountSubclassViewDialog({
  open,
  onOpenChange,
  accountSubclass,
}: AccountSubclassViewDialogProps) {
  if (!accountSubclass) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Subclass Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code
              </label>
              <p className="text-lg font-semibold">{accountSubclass.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <CoaStatusBadge isActive={accountSubclass.is_active} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{accountSubclass.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Account Class
            </label>
            <div className="mt-1">
              <Badge variant="outline">
                {accountSubclass.account_class?.name || 'N/A'} (
                {accountSubclass.account_class?.code || 'N/A'})
              </Badge>
            </div>
          </div>

          {accountSubclass.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm mt-1">{accountSubclass.description}</p>
            </div>
          )}

          {accountSubclass.hint && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hint
              </label>
              <p className="text-sm mt-1">{accountSubclass.hint}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">
                Created
              </label>
              <p>{new Date(accountSubclass.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
