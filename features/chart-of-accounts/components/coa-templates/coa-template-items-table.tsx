// features/chart-of-accounts/components/coa-templates/coa-template-items-table.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import type {
  AccountClass,
  AccountSubclass,
  AccountSubtype,
  AccountType,
  CoaTemplateItemFormData,
} from '../../lib/types';

interface CoaTemplateItemsTableProps {
  items: CoaTemplateItemFormData[];
  accountClasses: AccountClass[];
  accountSubclasses: AccountSubclass[];
  accountTypes: AccountType[];
  accountSubtypes: AccountSubtype[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    updates: Partial<CoaTemplateItemFormData>
  ) => void;
  disabled?: boolean;
}

export function CoaTemplateItemsTable({
  items,
  accountClasses,
  accountSubclasses,
  accountTypes,
  accountSubtypes,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  disabled = false,
}: CoaTemplateItemsTableProps) {
  // Generate account code based on hierarchy
  const generateAccountCode = (item: CoaTemplateItemFormData): string => {
    if (
      !item.account_class_id ||
      !item.account_subclass_id ||
      !item.account_type_id ||
      !item.account_subtype_id
    ) {
      return '';
    }

    const accountClass = accountClasses.find(
      c => c.id === item.account_class_id
    );
    const accountSubclass = accountSubclasses.find(
      s => s.id === item.account_subclass_id
    );
    const accountType = accountTypes.find(t => t.id === item.account_type_id);
    const accountSubtype = accountSubtypes.find(
      st => st.id === item.account_subtype_id
    );

    if (!accountClass || !accountSubclass || !accountType || !accountSubtype) {
      return '';
    }

    // Format: {class}{subclass}{type}{subtype}
    const baseCode = `${accountClass.code}${accountSubclass.code}${accountType.code}${accountSubtype.code}`;

    // Find the next available number for this combination
    const existingCodes = items
      .filter(
        otherItem =>
          otherItem.account_class_id === item.account_class_id &&
          otherItem.account_subclass_id === item.account_subclass_id &&
          otherItem.account_type_id === item.account_type_id &&
          otherItem.account_subtype_id === item.account_subtype_id &&
          otherItem.account_code.startsWith(baseCode)
      )
      .map(otherItem => {
        const suffix = otherItem.account_code.slice(baseCode.length);
        return parseInt(suffix) || 0;
      })
      .sort((a, b) => a - b);

    // Find the next available number
    let nextNumber = 1;
    for (const num of existingCodes) {
      if (num === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }

    return `${baseCode}${nextNumber.toString().padStart(2, '0')}`;
  };

  // Get account hierarchy data for each item
  const getAccountHierarchy = (item: CoaTemplateItemFormData) => {
    const accountClass = accountClasses.find(
      c => c.id === item.account_class_id
    );
    const accountSubclass = accountSubclasses.find(
      s => s.id === item.account_subclass_id
    );
    const accountType = accountTypes.find(t => t.id === item.account_type_id);
    const accountSubtype = accountSubtypes.find(
      st => st.id === item.account_subtype_id
    );

    return {
      accountClass,
      accountSubclass,
      accountType,
      accountSubtype,
    };
  };

  // Helper function to update item and generate account code
  const updateItemWithCode = (
    index: number,
    updates: Partial<CoaTemplateItemFormData>
  ) => {
    const updatedItem = { ...items[index], ...updates };

    // Generate account code if all hierarchy levels are selected
    if (
      updatedItem.account_class_id &&
      updatedItem.account_subclass_id &&
      updatedItem.account_type_id &&
      updatedItem.account_subtype_id
    ) {
      const newCode = generateAccountCode(updatedItem);
      if (newCode) {
        updatedItem.account_code = newCode;
      }
    }

    onUpdateItem(index, updatedItem);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Items</h3>
          <p className="text-sm text-muted-foreground">
            Define the accounts that will be included in this template
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddItem}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items Table */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          No items added yet. Click &quot;Add Item&quot; to get started.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] pl-4">Code</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[150px]">Account Class</TableHead>
                <TableHead className="w-[150px]">Account Subclass</TableHead>
                <TableHead className="w-[150px]">Account Type</TableHead>
                <TableHead className="w-[150px]">Account Subtype</TableHead>
                <TableHead className="w-[120px]">Normal Balance</TableHead>
                <TableHead className="w-[100px]">Active</TableHead>
                <TableHead className="w-[100px]">Sort Order</TableHead>
                <TableHead className="w-[80px] pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const hierarchy = getAccountHierarchy(item);
                return (
                  <TableRow key={item.id || index}>
                    {/* Account Code */}
                    <TableCell>
                      <Input
                        value={item.account_code}
                        placeholder="Auto-generated"
                        disabled={true}
                        className="min-w-20 bg-muted"
                      />
                    </TableCell>

                    {/* Account Name */}
                    <TableCell>
                      <Input
                        value={item.account_name}
                        onChange={e =>
                          onUpdateItem(index, { account_name: e.target.value })
                        }
                        placeholder="Account name"
                        disabled={disabled}
                        className="w-full min-w-56"
                      />
                    </TableCell>

                    {/* Account Class */}
                    <TableCell>
                      <Select
                        value={item.account_class_id}
                        onValueChange={classId => {
                          updateItemWithCode(index, {
                            account_class_id: classId,
                            account_subclass_id: '',
                            account_type_id: '',
                            account_subtype_id: '',
                            account_code: '',
                          });
                        }}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountClasses.map(classItem => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.code} - {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Account Subclass */}
                    <TableCell>
                      <Select
                        value={item.account_subclass_id}
                        onValueChange={subclassId => {
                          updateItemWithCode(index, {
                            account_subclass_id: subclassId,
                            account_type_id: '',
                            account_subtype_id: '',
                            account_code: '',
                          });
                        }}
                        disabled={disabled || !item.account_class_id}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select subclass" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountSubclasses
                            .filter(
                              s => s.account_class_id === item.account_class_id
                            )
                            .map(subclass => (
                              <SelectItem key={subclass.id} value={subclass.id}>
                                {subclass.code} - {subclass.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Account Type */}
                    <TableCell>
                      <Select
                        value={item.account_type_id}
                        onValueChange={typeId => {
                          updateItemWithCode(index, {
                            account_type_id: typeId,
                            account_subtype_id: '',
                            account_code: '',
                          });
                        }}
                        disabled={disabled || !item.account_subclass_id}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes
                            .filter(
                              t =>
                                t.account_subclass_id ===
                                item.account_subclass_id
                            )
                            .map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.code} - {type.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Account Subtype */}
                    <TableCell>
                      <Select
                        value={item.account_subtype_id}
                        onValueChange={subtypeId => {
                          updateItemWithCode(index, {
                            account_subtype_id: subtypeId,
                            account_code: '',
                          });
                        }}
                        disabled={disabled || !item.account_type_id}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select subtype" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountSubtypes
                            .filter(
                              st => st.account_type_id === item.account_type_id
                            )
                            .map(subtype => (
                              <SelectItem key={subtype.id} value={subtype.id}>
                                {subtype.code} - {subtype.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Normal Balance */}
                    <TableCell>
                      <Select
                        value={item.normal_balance}
                        onValueChange={balance =>
                          onUpdateItem(index, {
                            normal_balance: balance as 'debit' | 'credit',
                          })
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debit">Debit</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Active Status */}
                    <TableCell>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={isActive =>
                          onUpdateItem(index, { is_active: isActive })
                        }
                        disabled={disabled}
                      />
                    </TableCell>

                    {/* Sort Order */}
                    <TableCell>
                      <Input
                        type="number"
                        value={item.sort_order}
                        onChange={e =>
                          onUpdateItem(index, {
                            sort_order: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
