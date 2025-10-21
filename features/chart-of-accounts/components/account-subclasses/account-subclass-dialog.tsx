// features/chart-of-accounts/components/account-subclasses/account-subclass-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAccountClasses } from '../../hooks/use-account-classes';
import {
  useCreateAccountSubclass,
  useUpdateAccountSubclass,
} from '../../hooks/use-account-subclasses';
import type { AccountSubclass, AccountSubclassFormData } from '../../lib/types';
import { AccountSubclassForm } from './account-subclass-form';

interface AccountSubclassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: AccountSubclass;
}

export function AccountSubclassDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: AccountSubclassDialogProps) {
  const createMutation = useCreateAccountSubclass();
  const updateMutation = useUpdateAccountSubclass();
  const { data: accountClasses = [] } = useAccountClasses();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: AccountSubclassFormData) => {
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
              ? 'Create Account Subclass'
              : 'Edit Account Subclass'}
          </DialogTitle>
        </DialogHeader>
        <AccountSubclassForm
          initialData={initialData}
          accountClasses={accountClasses}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
