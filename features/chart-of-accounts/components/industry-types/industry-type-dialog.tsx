// features/chart-of-accounts/components/industry-types/industry-type-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IndustryType, IndustryTypeFormData } from '../../lib/types';
import { IndustryTypeForm } from './industry-type-form';

interface IndustryTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: IndustryType;
  onSubmit: (data: IndustryTypeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function IndustryTypeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: IndustryTypeDialogProps) {
  const title =
    mode === 'create' ? 'Create Industry Type' : 'Edit Industry Type';
  const description =
    mode === 'create'
      ? 'Add a new industry type to categorize businesses.'
      : 'Update the industry type information.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <IndustryTypeForm
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
