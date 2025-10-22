// features/chart-of-accounts/components/industry-types/industry-type-view-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, FileText, Lightbulb, Tag } from 'lucide-react';
import type { IndustryType } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface IndustryTypeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industryType?: IndustryType;
}

export function IndustryTypeViewDialog({
  open,
  onOpenChange,
  industryType,
}: IndustryTypeViewDialogProps) {
  if (!industryType) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {industryType.name}
          </DialogTitle>
          <DialogDescription>
            View industry type details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <CoaStatusBadge isActive={industryType.is_active} />
          </div>

          <Separator />

          {/* Description */}
          {industryType.description && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Description</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {industryType.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Hint */}
          {industryType.hint && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Hint</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {industryType.hint}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Timestamps */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Timestamps</span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(industryType.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(industryType.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
