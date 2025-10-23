// features/chart-of-accounts/components/coa-templates/account-hierarchy-dropdowns.tsx

'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';
import type {
  AccountClass,
  AccountSubclass,
  AccountSubtype,
  AccountType,
} from '../../lib/types';

interface AccountHierarchyDropdownsProps {
  accountClasses: AccountClass[];
  accountSubclasses: AccountSubclass[];
  accountTypes: AccountType[];
  accountSubtypes: AccountSubtype[];
  selectedClassId: string;
  selectedSubclassId: string;
  selectedTypeId: string;
  selectedSubtypeId: string;
  onClassChange: (classId: string) => void;
  onSubclassChange: (subclassId: string) => void;
  onTypeChange: (typeId: string) => void;
  onSubtypeChange: (subtypeId: string) => void;
  disabled?: boolean;
}

export function AccountHierarchyDropdowns({
  accountClasses,
  accountSubclasses,
  accountTypes,
  accountSubtypes,
  selectedClassId,
  selectedSubclassId,
  selectedTypeId,
  selectedSubtypeId,
  onClassChange,
  onSubclassChange,
  onTypeChange,
  onSubtypeChange,
  disabled = false,
}: AccountHierarchyDropdownsProps) {
  // Filter subclasses based on selected class
  const filteredSubclasses = useMemo(() => {
    if (!selectedClassId) return accountSubclasses;
    return accountSubclasses.filter(
      subclass => subclass.account_class_id === selectedClassId
    );
  }, [accountSubclasses, selectedClassId]);

  // Filter types based on selected subclass
  const filteredTypes = useMemo(() => {
    if (!selectedSubclassId) return accountTypes;
    return accountTypes.filter(
      type => type.account_subclass_id === selectedSubclassId
    );
  }, [accountTypes, selectedSubclassId]);

  // Filter subtypes based on selected type
  const filteredSubtypes = useMemo(() => {
    if (!selectedTypeId) return accountSubtypes;
    return accountSubtypes.filter(
      subtype => subtype.account_type_id === selectedTypeId
    );
  }, [accountSubtypes, selectedTypeId]);

  // Handle class change - reset dependent selections
  const handleClassChange = (classId: string) => {
    onClassChange(classId);
    onSubclassChange('');
    onTypeChange('');
    onSubtypeChange('');
  };

  // Handle subclass change - reset dependent selections
  const handleSubclassChange = (subclassId: string) => {
    onSubclassChange(subclassId);
    onTypeChange('');
    onSubtypeChange('');
  };

  // Handle type change - reset dependent selections
  const handleTypeChange = (typeId: string) => {
    onTypeChange(typeId);
    onSubtypeChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Account Class */}
      <div className="space-y-2">
        <Label htmlFor="account-class">Account Class</Label>
        <Select
          value={selectedClassId}
          onValueChange={handleClassChange}
          disabled={disabled}
        >
          <SelectTrigger id="account-class">
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
      </div>

      {/* Account Subclass */}
      <div className="space-y-2">
        <Label htmlFor="account-subclass">Account Subclass</Label>
        <Select
          value={selectedSubclassId}
          onValueChange={handleSubclassChange}
          disabled={disabled || !selectedClassId}
        >
          <SelectTrigger id="account-subclass">
            <SelectValue placeholder="Select subclass" />
          </SelectTrigger>
          <SelectContent>
            {filteredSubclasses.map(subclass => (
              <SelectItem key={subclass.id} value={subclass.id}>
                {subclass.code} - {subclass.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Type */}
      <div className="space-y-2">
        <Label htmlFor="account-type">Account Type</Label>
        <Select
          value={selectedTypeId}
          onValueChange={handleTypeChange}
          disabled={disabled || !selectedSubclassId}
        >
          <SelectTrigger id="account-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {filteredTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.code} - {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account Subtype */}
      <div className="space-y-2">
        <Label htmlFor="account-subtype">Account Subtype</Label>
        <Select
          value={selectedSubtypeId}
          onValueChange={onSubtypeChange}
          disabled={disabled || !selectedTypeId}
        >
          <SelectTrigger id="account-subtype">
            <SelectValue placeholder="Select subtype" />
          </SelectTrigger>
          <SelectContent>
            {filteredSubtypes.map(subtype => (
              <SelectItem key={subtype.id} value={subtype.id}>
                {subtype.code} - {subtype.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
