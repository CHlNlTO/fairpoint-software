// features/chart-of-accounts/components/business-types/business-type-form.tsx

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  businessTypeSchema,
  type BusinessTypeFormData,
} from '../../lib/schemas';
import type { BusinessType } from '../../lib/types';

interface BusinessTypeFormProps {
  initialData?: Partial<BusinessType>;
  onSubmit: (data: BusinessTypeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function BusinessTypeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}: BusinessTypeFormProps) {
  const form = useForm<BusinessTypeFormData>({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      hint: initialData?.hint || '',
      is_active: initialData?.is_active ?? true,
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter business type name" {...field} />
              </FormControl>
              <FormDescription>
                Descriptive name for this business type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                />
              </FormControl>
              <FormDescription>
                Detailed description of this business type
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
                <Input placeholder="Enter hint (optional)" {...field} />
              </FormControl>
              <FormDescription>
                Quick reference hint for this business type
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
                  Whether this business type is currently active
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
