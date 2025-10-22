// features/chart-of-accounts/components/coa-templates/coa-template-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CoaTemplate, CoaTemplateFormData } from '../../lib/types';
import { CoaTemplateForm } from './coa-template-form';

interface CoaTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: CoaTemplate;
  onSubmit: (data: CoaTemplateFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CoaTemplateDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: CoaTemplateDialogProps) {
  const title = mode === 'create' ? 'Create COA Template' : 'Edit COA Template';
  const description =
    mode === 'create'
      ? 'Add a new chart of accounts template for businesses.'
      : 'Update the COA template information.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CoaTemplateForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
