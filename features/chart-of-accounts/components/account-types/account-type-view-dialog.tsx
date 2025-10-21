// features/chart-of-accounts/components/account-types/account-type-view-dialog.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { AccountType } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface AccountTypeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountType?: AccountType;
}

export function AccountTypeViewDialog({
  open,
  onOpenChange,
  accountType,
}: AccountTypeViewDialogProps) {
  if (!accountType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Type Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code
              </label>
              <p className="text-lg font-semibold">{accountType.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <CoaStatusBadge isActive={accountType.is_active} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{accountType.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Type
            </label>
            <div className="mt-1">
              <Badge variant="outline">
                {accountType.is_system_defined
                  ? 'System Defined'
                  : 'User Defined'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Account Subclass
            </label>
            <div className="mt-1">
              <Badge variant="outline">
                {accountType.account_subclass?.name || 'N/A'} (
                {accountType.account_subclass?.account_class?.name || 'N/A'})
              </Badge>
            </div>
          </div>

          {accountType.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm mt-1">{accountType.description}</p>
            </div>
          )}

          {accountType.hint && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hint
              </label>
              <p className="text-sm mt-1">{accountType.hint}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">
                Created
              </label>
              <p>{new Date(accountType.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
