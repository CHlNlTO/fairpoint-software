// features/chart-of-accounts/components/coa-templates/coa-template-combined-form.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  coaTemplateCombinedFormSchema,
  type CoaTemplateCombinedFormData,
} from '../../lib/schemas';
import type {
  AccountClass,
  AccountSubclass,
  AccountSubtype,
  AccountType,
  BusinessType,
  CoaTemplateItemFormData,
  IndustryType,
  TaxType,
} from '../../lib/types';
import { CoaTemplateItemsTable } from './coa-template-items-table';

interface CoaTemplateCombinedFormProps {
  initialData?: Partial<CoaTemplateCombinedFormData>;
  onSubmit: (data: CoaTemplateCombinedFormData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';

  // Data for dropdowns
  taxTypes: TaxType[];
  businessTypes: BusinessType[];
  industryTypes: IndustryType[];
  accountClasses: AccountClass[];
  accountSubclasses: AccountSubclass[];
  accountTypes: AccountType[];
  accountSubtypes: AccountSubtype[];
}

export function CoaTemplateCombinedForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode,
  taxTypes,
  businessTypes,
  industryTypes,
  accountClasses,
  accountSubclasses,
  accountTypes,
  accountSubtypes,
}: CoaTemplateCombinedFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<CoaTemplateItemFormData[]>(
    initialData?.items || []
  );

  const form = useForm<CoaTemplateCombinedFormData>({
    resolver: zodResolver(coaTemplateCombinedFormSchema),
    defaultValues: {
      template_name: initialData?.template_name || '',
      description: initialData?.description || '',
      is_default: initialData?.is_default ?? false,
      is_active: initialData?.is_active ?? true,
      rules: {
        tax_type_id: initialData?.rules?.tax_type_id || 'any',
        business_type_id: initialData?.rules?.business_type_id || 'any',
        industry_type_id: initialData?.rules?.industry_type_id || 'any',
      },
      items: initialData?.items || [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Items state:', items);

    // Manual validation
    if (items.length === 0) {
      console.error('No items added. Please add at least one item.');
      return;
    }

    // Check if all items have required fields
    const invalidItems = items.filter(
      item =>
        !item.account_name ||
        !item.account_class_id ||
        !item.account_subclass_id ||
        !item.account_type_id ||
        !item.account_subtype_id
    );

    if (invalidItems.length > 0) {
      console.error('Some items are missing required fields:', invalidItems);
      return;
    }

    // Ensure all items have account codes generated
    const itemsWithCodes = items.map(item => {
      if (
        !item.account_code &&
        item.account_class_id &&
        item.account_subclass_id &&
        item.account_type_id &&
        item.account_subtype_id
      ) {
        // This should not happen due to useEffect, but just in case
        console.warn('Item missing account code:', item);
      }
      return item;
    });

    // Get form data
    const formData = form.getValues();
    console.log('Form data:', formData);

    try {
      const submitData = {
        ...formData,
        rules: {
          tax_type_id:
            formData.rules.tax_type_id === 'any'
              ? undefined
              : formData.rules.tax_type_id,
          business_type_id:
            formData.rules.business_type_id === 'any'
              ? undefined
              : formData.rules.business_type_id,
          industry_type_id:
            formData.rules.industry_type_id === 'any'
              ? undefined
              : formData.rules.industry_type_id,
        },
        items: itemsWithCodes,
      };
      console.log('Sending form data:', submitData);
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addItem = () => {
    const newItem: CoaTemplateItemFormData = {
      account_code: '',
      account_name: '',
      account_class_id: '',
      account_subclass_id: '',
      account_type_id: '',
      account_subtype_id: '',
      normal_balance: 'debit',
      is_active: true,
      sort_order: items.length,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    updates: Partial<CoaTemplateItemFormData>
  ) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-8 container w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === 'create' ? 'Create COA Template' : 'Edit COA Template'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create'
              ? 'Create a new Chart of Accounts template with rules and items'
              : 'Update the Chart of Accounts template information'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Template Information */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>
                Basic information about the COA template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Template Name */}
                <FormField
                  control={form.control}
                  name="template_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Descriptive name for this COA template
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
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
                        Detailed description of this COA template
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Default and Active Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Default Template
                        </FormLabel>
                        <FormDescription>
                          Set this template as the default for new businesses
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

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Whether this COA template is currently active
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
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Template Rules</CardTitle>
              <CardDescription>
                Define which business configurations this template applies to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tax Type */}
                <FormField
                  control={form.control}
                  name="rules.tax_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax type (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any Tax Type</SelectItem>
                          {taxTypes.map(taxType => (
                            <SelectItem key={taxType.id} value={taxType.id}>
                              {taxType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Tax type this template applies to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Type */}
                <FormField
                  control={form.control}
                  name="rules.business_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any Business Type</SelectItem>
                          {businessTypes.map(businessType => (
                            <SelectItem
                              key={businessType.id}
                              value={businessType.id}
                            >
                              {businessType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Business type this template applies to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Industry Type */}
                <FormField
                  control={form.control}
                  name="rules.industry_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry type (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any Industry Type</SelectItem>
                          {industryTypes.map(industryType => (
                            <SelectItem
                              key={industryType.id}
                              value={industryType.id}
                            >
                              {industryType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Industry type this template applies to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Items */}
          <Card>
            <CardContent>
              <CoaTemplateItemsTable
                items={items}
                accountClasses={accountClasses}
                accountSubclasses={accountSubclasses}
                accountTypes={accountTypes}
                accountSubtypes={accountSubtypes}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Create Template' : 'Update Template'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
