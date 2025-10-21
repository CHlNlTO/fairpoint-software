// features/chart-of-accounts/components/account-subtypes/account-subtypes-table.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { ArrowUpDown, Plus, Search } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import { useAccountSubtypes } from '../../hooks/use-account-subtypes';
import { useAccountTypes } from '../../hooks/use-account-types';
import { useCoaFilters } from '../../hooks/use-coa-filters';
import {
  ACCOUNT_SUBTYPE_SORT_OPTIONS,
  ACCOUNT_SUBTYPE_STATUS_OPTIONS,
  ACCOUNT_SUBTYPE_SYSTEM_OPTIONS,
} from '../../lib/constants';
import type { AccountSubtype, AccountSubtypeFilters } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';
import { AccountSubtypeActions } from './account-subtype-actions';

interface AccountSubtypesTableProps {
  onEdit: (accountSubtype: AccountSubtype) => void;
  onDelete: (accountSubtype: AccountSubtype) => void;
  onView: (accountSubtype: AccountSubtype) => void;
  onCreate: () => void;
}

export function AccountSubtypesTable({
  onEdit,
  onDelete,
  onView,
  onCreate,
}: AccountSubtypesTableProps) {
  const { filters, updateFilters } = useCoaFilters<AccountSubtypeFilters>();
  const {
    data: accountSubtypes,
    isLoading,
    isError,
  } = useAccountSubtypes(filters);
  const { data: accountTypes, isLoading: isLoadingTypes } = useAccountTypes();

  const [searchValue, setSearchValue] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 300);

  React.useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  const sortedAndFilteredData = useMemo(() => {
    let filteredData = [...(accountSubtypes || [])];

    if (filters.is_active !== undefined) {
      filteredData = filteredData.filter(
        item => item.is_active === filters.is_active
      );
    }

    if (filters.account_type_id) {
      filteredData = filteredData.filter(
        item => item.account_type_id === filters.account_type_id
      );
    }

    if (filters.is_system_defined !== undefined) {
      filteredData = filteredData.filter(
        item => item.is_system_defined === filters.is_system_defined
      );
    }

    filteredData.sort((a, b) => {
      const sortBy = filters.sort_by || 'code';
      const sortOrder = filters.sort_order || 'asc';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any;

      switch (sortBy) {
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.code;
          bValue = b.code;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredData;
  }, [
    accountSubtypes,
    filters.is_active,
    filters.account_type_id,
    filters.is_system_defined,
    filters.sort_by,
    filters.sort_order,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSortByChange = (value: string) => {
    updateFilters({ sort_by: value as AccountSubtypeFilters['sort_by'] });
  };

  const handleStatusFilterChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ is_active: undefined });
    } else {
      updateFilters({ is_active: value === 'active' });
    }
  };

  const handleSystemDefinedFilterChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ is_system_defined: undefined });
    } else {
      updateFilters({ is_system_defined: value === 'system' });
    }
  };

  const handleAccountTypeFilterChange = (value: string) => {
    updateFilters({ account_type_id: value === 'all' ? undefined : value });
  };

  const toggleSortOrder = () => {
    updateFilters({
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    });
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-6 w-16" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell className="pl-3 pr-4">
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ));
  };

  if (isError) {
    return <div>Error loading account subtypes.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex flex-row items-center justify-center">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search account subtypes..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>

          <Select
            value={
              filters.is_active === undefined
                ? 'all'
                : filters.is_active
                  ? 'active'
                  : 'inactive'
            }
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_SUBTYPE_STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              filters.is_system_defined === undefined
                ? 'all'
                : filters.is_system_defined
                  ? 'system'
                  : 'user'
            }
            onValueChange={handleSystemDefinedFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_SUBTYPE_SYSTEM_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.account_type_id || 'all'}
            onValueChange={handleAccountTypeFilterChange}
            disabled={isLoadingTypes}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Account Types</SelectItem>
              {accountTypes?.map(accountType => (
                <SelectItem key={accountType.id} value={accountType.id}>
                  {accountType.name} ({accountType.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Account Subtype
        </Button>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <Select
          value={filters.sort_by || 'code'}
          onValueChange={handleSortByChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_SUBTYPE_SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 pl-3 pr-4 ${filters.sort_by === 'code' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('code')}
              >
                <div className="flex items-center gap-2">
                  Code
                  {filters.sort_by === 'code' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 pl-3 pr-4 ${filters.sort_by === 'name' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  {filters.sort_by === 'name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="pl-3 pr-4">Account Type</TableHead>
              <TableHead className="pl-3 pr-4">Status</TableHead>
              <TableHead className="pl-3 pr-4">Type</TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 pl-3 pr-4 ${filters.sort_by === 'created_at' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('created_at')}
              >
                <div className="flex items-center gap-2">
                  Created
                  {filters.sort_by === 'created_at' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[70px] pl-3 pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : sortedAndFilteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No account subtypes found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredData.map(accountSubtype => (
                <TableRow key={accountSubtype.id}>
                  <TableCell className="font-medium pl-3 pr-4">
                    {accountSubtype.code}
                  </TableCell>
                  <TableCell className="font-medium pl-3 pr-4">
                    {accountSubtype.name}
                  </TableCell>
                  <TableCell className="pl-3 pr-4">
                    {accountSubtype.account_type?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="pl-3 pr-4">
                    <CoaStatusBadge isActive={accountSubtype.is_active} />
                  </TableCell>
                  <TableCell className="pl-3 pr-4">
                    <Badge
                      variant={
                        accountSubtype.is_system_defined
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {accountSubtype.is_system_defined ? 'System' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell className="pl-3 pr-4">
                    {new Date(accountSubtype.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pl-3 pr-4">
                    <AccountSubtypeActions
                      accountSubtype={accountSubtype}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onView={onView}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
