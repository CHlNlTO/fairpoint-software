// features/chart-of-accounts/components/coa-templates/coa-template-view-dialog.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, FileText, Star, Tag } from 'lucide-react';
import type { CoaTemplate } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface CoaTemplateViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coaTemplate?: CoaTemplate;
}

export function CoaTemplateViewDialog({
  open,
  onOpenChange,
  coaTemplate,
}: CoaTemplateViewDialogProps) {
  if (!coaTemplate) {
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
            {coaTemplate.template_name}
            {coaTemplate.is_default && (
              <Badge variant="secondary" className="ml-2">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View COA template details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <CoaStatusBadge isActive={coaTemplate.is_active} />
          </div>

          <Separator />

          {/* Description */}
          {coaTemplate.description && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Description</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {coaTemplate.description}
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
                  <span>{formatDate(coaTemplate.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(coaTemplate.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
