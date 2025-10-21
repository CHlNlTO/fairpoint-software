// features/chart-of-accounts/components/account-classes/account-class-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AccountClass, AccountClassFormData } from '../../lib/types';
import { AccountClassForm } from './account-class-form';

interface AccountClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<AccountClass>;
  onSubmit: (data: AccountClassFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AccountClassDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: AccountClassDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (data: AccountClassFormData) => {
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
        return 'Create Account Class';
      case 'edit':
        return 'Edit Account Class';
      default:
        return 'Account Class';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <AccountClassForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
