// features/chart-of-accounts/components/account-subtypes/account-subtype-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateAccountSubtype,
  useUpdateAccountSubtype,
} from '../../hooks/use-account-subtypes';
import type { AccountSubtype, AccountSubtypeFormData } from '../../lib/types';
import { AccountSubtypeForm } from './account-subtype-form';

interface AccountSubtypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: AccountSubtype;
}

export function AccountSubtypeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: AccountSubtypeDialogProps) {
  const createMutation = useCreateAccountSubtype();
  const updateMutation = useUpdateAccountSubtype();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: AccountSubtypeFormData) => {
    if (mode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (mode === 'edit' && initialData?.id) {
      await updateMutation.mutateAsync({ ...data, id: initialData.id });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Create Account Subtype'
              : 'Edit Account Subtype'}
          </DialogTitle>
        </DialogHeader>
        <AccountSubtypeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
