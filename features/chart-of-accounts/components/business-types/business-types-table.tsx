// features/chart-of-accounts/components/business-types/business-types-table.tsx

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
import { ArrowUpDown, Plus, Search } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import {
  BUSINESS_TYPE_SORT_OPTIONS,
  BUSINESS_TYPE_STATUS_OPTIONS,
} from '../../lib/constants';
import type { BusinessType, BusinessTypeFilters } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';
import { BusinessTypeActions } from './business-type-actions';

interface BusinessTypesTableProps {
  data?: BusinessType[];
  isLoading?: boolean;
  filters: BusinessTypeFilters;
  onFiltersChange: (filters: Partial<BusinessTypeFilters>) => void;
  onEdit: (businessType: BusinessType) => void;
  onDelete: (businessType: BusinessType) => void;
  onView?: (businessType: BusinessType) => void;
  onCreate: () => void;
}

export function BusinessTypesTable({
  data = [],
  isLoading = false,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  onView,
  onCreate,
}: BusinessTypesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update search filter when debounced term changes
  React.useEffect(() => {
    onFiltersChange({ search: debouncedSearchTerm || undefined });
  }, [debouncedSearchTerm, onFiltersChange]);

  // Client-side filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply status filter
    if (filters.is_active !== undefined) {
      filtered = filtered.filter(item => item.is_active === filters.is_active);
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'name';
    const sortOrder = filters.sort_order || 'asc';

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [data, filters.is_active, filters.sort_by, filters.sort_order]);

  const handleSort = (field: 'name' | 'created_at') => {
    const newSortOrder =
      filters.sort_by === field && filters.sort_order === 'asc'
        ? 'desc'
        : 'asc';
    onFiltersChange({ sort_by: field, sort_order: newSortOrder });
  };

  const getStatusFilterValue = () => {
    if (filters.is_active === true) return 'active';
    if (filters.is_active === false) return 'inactive';
    return 'all';
  };

  const handleStatusFilterChange = (value: string) => {
    const isActive = value === 'all' ? undefined : value === 'active';
    onFiltersChange({ is_active: isActive });
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[300px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[80px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex flex-row items-center justify-center">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search business types..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>

          <Select
            value={getStatusFilterValue()}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPE_STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Business Type
        </Button>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <Select
          value={filters.sort_by || 'name'}
          onValueChange={value =>
            onFiltersChange({ sort_by: value as 'name' | 'created_at' })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPE_SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSort(filters.sort_by || 'name')}
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
                className={`cursor-pointer hover:bg-muted/50 pl-3 ${filters.sort_by === 'name' ? 'bg-muted' : ''}`}
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  {filters.sort_by === 'name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Hint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className={`cursor-pointer hover:bg-muted/50 ${filters.sort_by === 'created_at' ? 'bg-muted' : ''}`}
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  Created
                  {filters.sort_by === 'created_at' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[70px] pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletonRows()
            ) : filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No business types found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map(businessType => (
                <TableRow key={businessType.id}>
                  <TableCell className="font-medium pl-3">
                    {businessType.name}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {businessType.description || '-'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {businessType.hint || '-'}
                  </TableCell>
                  <TableCell>
                    <CoaStatusBadge isActive={businessType.is_active} />
                  </TableCell>
                  <TableCell>
                    {new Date(businessType.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <BusinessTypeActions
                      businessType={businessType}
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
