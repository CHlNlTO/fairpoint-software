// features/chart-of-accounts/components/business-types/business-type-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BusinessType, BusinessTypeFormData } from '../../lib/types';
import { BusinessTypeForm } from './business-type-form';

interface BusinessTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<BusinessType>;
  onSubmit: (data: BusinessTypeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BusinessTypeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: BusinessTypeDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (data: BusinessTypeFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Dialog submission error:', error);
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Business Type';
      case 'edit':
        return 'Edit Business Type';
      default:
        return 'Business Type';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <BusinessTypeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
