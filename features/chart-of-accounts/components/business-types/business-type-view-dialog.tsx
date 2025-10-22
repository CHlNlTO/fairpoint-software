// features/chart-of-accounts/components/business-types/business-type-view-dialog.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import type { BusinessType } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface BusinessTypeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessType: BusinessType;
}

export function BusinessTypeViewDialog({
  open,
  onOpenChange,
  businessType,
}: BusinessTypeViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Business Type Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <Separator className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="mt-1 text-sm">{businessType.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <CoaStatusBadge isActive={businessType.is_active} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {businessType.description && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <Separator className="mt-2" />
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {businessType.description}
              </p>
            </div>
          )}

          {/* Hint */}
          {businessType.hint && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Hint</h3>
                <Separator className="mt-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                {businessType.hint}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Timestamps</h3>
              <Separator className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <p className="mt-1 text-sm">
                  {format(new Date(businessType.created_at), 'PPP p')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Updated At
                </label>
                <p className="mt-1 text-sm">
                  {format(new Date(businessType.updated_at), 'PPP p')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
