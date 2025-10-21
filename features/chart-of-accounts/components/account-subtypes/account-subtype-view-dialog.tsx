// features/chart-of-accounts/components/account-subtypes/account-subtype-view-dialog.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { AccountSubtype } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface AccountSubtypeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountSubtype?: AccountSubtype;
}

export function AccountSubtypeViewDialog({
  open,
  onOpenChange,
  accountSubtype,
}: AccountSubtypeViewDialogProps) {
  if (!accountSubtype) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Subtype Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code
              </label>
              <p className="text-lg font-semibold">{accountSubtype.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <CoaStatusBadge isActive={accountSubtype.is_active} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{accountSubtype.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Type
            </label>
            <div className="mt-1">
              <Badge
                variant={
                  accountSubtype.is_system_defined ? 'secondary' : 'outline'
                }
              >
                {accountSubtype.is_system_defined
                  ? 'System Defined'
                  : 'User Defined'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Account Type
            </label>
            <p className="text-lg font-medium">
              {accountSubtype.account_type?.name || 'N/A'} (
              {accountSubtype.account_type?.account_subclass?.name || 'N/A'})
            </p>
          </div>

          {accountSubtype.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm mt-1">{accountSubtype.description}</p>
            </div>
          )}

          {accountSubtype.hint && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hint
              </label>
              <p className="text-sm mt-1">{accountSubtype.hint}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">
                Created
              </label>
              <p>{new Date(accountSubtype.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
