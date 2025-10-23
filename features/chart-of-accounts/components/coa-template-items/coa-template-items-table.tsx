// features/chart-of-accounts/components/coa-template-items/coa-template-items-table.tsx

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
import { ArrowUpDown, Search } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import { COA_TEMPLATE_ITEM_SORT_OPTIONS } from '../../lib/constants';
import type { CoaTemplateItem, CoaTemplateItemFilters } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';

interface CoaTemplateItemsTableProps {
  data?: CoaTemplateItem[];
  isLoading?: boolean;
  filters: CoaTemplateItemFilters;
  onFiltersChange: (filters: Partial<CoaTemplateItemFilters>) => void;
}

export function CoaTemplateItemsTable({
  data = [],
  isLoading = false,
  filters,
  onFiltersChange,
}: CoaTemplateItemsTableProps) {
  const [searchValue, setSearchValue] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 300);

  // Update filters when debounced search changes
  React.useEffect(() => {
    onFiltersChange({ search: debouncedSearch });
  }, [debouncedSearch, onFiltersChange]);

  // Client-side sorting and filtering
  const sortedAndFilteredData = useMemo(() => {
    let filteredData = [...data];

    // Apply client-side filtering
    if (filters.is_active !== undefined) {
      filteredData = filteredData.filter(
        item => item.is_active === filters.is_active
      );
    }

    if (filters.normal_balance) {
      filteredData = filteredData.filter(
        item => item.normal_balance === filters.normal_balance
      );
    }

    // Apply client-side sorting
    filteredData.sort((a, b) => {
      const sortBy = filters.sort_by || 'template_name';
      const sortOrder = filters.sort_order || 'asc';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any;

      switch (sortBy) {
        case 'template_name':
          aValue = a.template?.template_name?.toLowerCase() || '';
          bValue = b.template?.template_name?.toLowerCase() || '';
          break;
        case 'account_code':
          aValue = a.account_code;
          bValue = b.account_code;
          break;
        case 'account_name':
          aValue = a.account_name.toLowerCase();
          bValue = b.account_name.toLowerCase();
          break;
        case 'sort_order':
          aValue = a.sort_order;
          bValue = b.sort_order;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.template?.template_name?.toLowerCase() || '';
          bValue = b.template?.template_name?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredData;
  }, [
    data,
    filters.is_active,
    filters.normal_balance,
    filters.sort_by,
    filters.sort_order,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({ sort_by: value as CoaTemplateItemFilters['sort_by'] });
  };

  const handleStatusFilterChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ is_active: undefined });
    } else {
      onFiltersChange({ is_active: value === 'active' });
    }
  };

  const toggleSortOrder = () => {
    onFiltersChange({
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    });
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-40" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex flex-row items-center justify-center">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search template items..."
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.normal_balance || 'all'}
            onValueChange={value =>
              onFiltersChange({
                normal_balance:
                  value === 'all' ? undefined : (value as 'debit' | 'credit'),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Balance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Balance</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <Select
          value={filters.sort_by || 'template_name'}
          onValueChange={handleSortByChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {COA_TEMPLATE_ITEM_SORT_OPTIONS.map(option => (
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
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 pl-3 ${filters.sort_by === 'template_name' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('template_name')}
              >
                <div className="flex items-center gap-2">
                  Template Name
                  {filters.sort_by === 'template_name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${filters.sort_by === 'account_code' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('account_code')}
              >
                <div className="flex items-center gap-2">
                  Account Code
                  {filters.sort_by === 'account_code' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${filters.sort_by === 'account_name' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('account_name')}
              >
                <div className="flex items-center gap-2">
                  Account Name
                  {filters.sort_by === 'account_name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Account Hierarchy</TableHead>
              <TableHead>Normal Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${filters.sort_by === 'created_at' ? 'bg-muted' : ''}`}
                onClick={() => handleSortByChange('created_at')}
              >
                <div className="flex items-center gap-2">
                  Created
                  {filters.sort_by === 'created_at' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
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
                  No template items found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredData.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium pl-3">
                    {item.template?.template_name || 'Unknown Template'}
                  </TableCell>
                  <TableCell className="font-mono">
                    {item.account_code}
                  </TableCell>
                  <TableCell>{item.account_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {item.account_subtype?.account_type?.account_subclass
                          ?.account_class?.name || 'Unknown Class'}
                      </div>
                      <div className="text-muted-foreground">
                        {item.account_subtype?.account_type?.account_subclass
                          ?.name || 'Unknown Subclass'}{' '}
                        →
                        {item.account_subtype?.account_type?.name ||
                          'Unknown Type'}{' '}
                        →{item.account_subtype?.name || 'Unknown Subtype'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{item.normal_balance}</span>
                  </TableCell>
                  <TableCell>
                    <CoaStatusBadge isActive={item.is_active} />
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
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
