// features/chart-of-accounts/components/account-classes/account-class-view-dialog.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { AccountClass } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface AccountClassViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountClass?: AccountClass;
}

export function AccountClassViewDialog({
  open,
  onOpenChange,
  accountClass,
}: AccountClassViewDialogProps) {
  if (!accountClass) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Class Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code
              </label>
              <p className="text-lg font-semibold">{accountClass.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <CoaStatusBadge isActive={accountClass.is_active} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{accountClass.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Normal Balance
            </label>
            <div className="mt-1">
              <Badge variant="outline" className="capitalize">
                {accountClass.normal_balance}
              </Badge>
            </div>
          </div>

          {accountClass.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm mt-1">{accountClass.description}</p>
            </div>
          )}

          {accountClass.hint && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Hint
              </label>
              <p className="text-sm mt-1">{accountClass.hint}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">
                Created
              </label>
              <p>{new Date(accountClass.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
