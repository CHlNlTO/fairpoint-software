// features/chart-of-accounts/components/account-types/account-type-dialog.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAccountSubclasses } from '../../hooks/use-account-subclasses';
import {
  useCreateAccountType,
  useUpdateAccountType,
} from '../../hooks/use-account-types';
import type { AccountType, AccountTypeFormData } from '../../lib/types';
import { AccountTypeForm } from './account-type-form';

interface AccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: AccountType;
}

export function AccountTypeDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: AccountTypeDialogProps) {
  const createMutation = useCreateAccountType();
  const updateMutation = useUpdateAccountType();
  const { data: accountSubclasses = [] } = useAccountSubclasses();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: AccountTypeFormData) => {
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
            {mode === 'create' ? 'Create Account Type' : 'Edit Account Type'}
          </DialogTitle>
        </DialogHeader>
        <AccountTypeForm
          initialData={initialData}
          accountSubclasses={accountSubclasses}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
