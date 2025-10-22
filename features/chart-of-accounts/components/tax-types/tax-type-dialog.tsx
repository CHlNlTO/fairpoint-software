// features/chart-of-accounts/components/tax-types/tax-type-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TaxType, TaxTypeFormData } from '../../lib/types';
import { TaxTypeForm } from './tax-type-form';

interface TaxTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: TaxType;
  onSubmit: (data: TaxTypeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TaxTypeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: TaxTypeDialogProps) {
  const title = mode === 'create' ? 'Create Tax Type' : 'Edit Tax Type';
  const description =
    mode === 'create'
      ? 'Add a new tax type to categorize different tax classifications.'
      : 'Update the tax type information.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TaxTypeForm
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
