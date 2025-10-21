// features/chart-of-accounts/components/account-subclasses/account-subclass-form.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  accountSubclassSchema,
  type AccountSubclassFormData,
} from '../../lib/schemas';
import type { AccountClass, AccountSubclass } from '../../lib/types';

interface AccountSubclassFormProps {
  initialData?: Partial<AccountSubclass>;
  accountClasses: AccountClass[];
  onSubmit: (data: AccountSubclassFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AccountSubclassForm({
  initialData,
  accountClasses,
  onSubmit,
  onCancel,
  isLoading = false,
}: AccountSubclassFormProps) {
  const form = useForm<AccountSubclassFormData>({
    resolver: zodResolver(accountSubclassSchema),
    defaultValues: {
      account_class_id: initialData?.account_class_id || '',
      code: initialData?.code || 1,
      name: initialData?.name || '',
      is_active: initialData?.is_active ?? true,
      description: initialData?.description || '',
      hint: initialData?.hint || '',
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    await onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="account_class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Class</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountClasses.map(accountClass => (
                    <SelectItem key={accountClass.id} value={accountClass.id}>
                      {accountClass.name} ({accountClass.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The parent account class for this subclass
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter account subclass code"
                    {...field}
                    onChange={e =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Unique numeric code for this account subclass
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter account subclass name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Descriptive name for this account subclass
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isLoading}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Detailed description of this account subclass
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hint</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter hint (optional)"
                  {...field}
                  disabled={isLoading}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Quick reference hint for this account subclass
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Whether this account subclass is currently active
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Account Subclass'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
