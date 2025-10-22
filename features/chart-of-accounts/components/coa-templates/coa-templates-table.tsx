// features/chart-of-accounts/components/coa-templates/coa-templates-table.tsx

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
import { ArrowUpDown, Plus, Search, Star } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import {
  COA_TEMPLATE_DEFAULT_OPTIONS,
  COA_TEMPLATE_SORT_OPTIONS,
  COA_TEMPLATE_STATUS_OPTIONS,
} from '../../lib/constants';
import type { CoaTemplate, CoaTemplateFilters } from '../../lib/types';
import { CoaStatusBadge } from '../shared/coa-status-badge';
import { CoaTemplateActions } from './coa-template-actions';

interface CoaTemplatesTableProps {
  data?: CoaTemplate[];
  isLoading?: boolean;
  filters: CoaTemplateFilters;
  onFiltersChange: (filters: Partial<CoaTemplateFilters>) => void;
  onEdit: (coaTemplate: CoaTemplate) => void;
  onDelete: (coaTemplate: CoaTemplate) => void;
  onView?: (coaTemplate: CoaTemplate) => void;
  onCreate: () => void;
}

export function CoaTemplatesTable({
  data = [],
  isLoading = false,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  onView,
  onCreate,
}: CoaTemplatesTableProps) {
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

    // Apply default filter
    if (filters.is_default !== undefined) {
      filtered = filtered.filter(
        item => item.is_default === filters.is_default
      );
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'template_name';
    const sortOrder = filters.sort_order || 'asc';

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'template_name':
          aValue = a.template_name.toLowerCase();
          bValue = b.template_name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.template_name.toLowerCase();
          bValue = b.template_name.toLowerCase();
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
  }, [
    data,
    filters.is_active,
    filters.is_default,
    filters.sort_by,
    filters.sort_order,
  ]);

  const handleSort = (field: 'template_name' | 'created_at') => {
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

  const getDefaultFilterValue = () => {
    if (filters.is_default === true) return 'default';
    if (filters.is_default === false) return 'non-default';
    return 'all';
  };

  const handleDefaultFilterChange = (value: string) => {
    const isDefault = value === 'all' ? undefined : value === 'default';
    onFiltersChange({ is_default: isDefault });
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
          <Skeleton className="h-4 w-[80px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[80px]" />
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
              placeholder="Search templates..."
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
              {COA_TEMPLATE_STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getDefaultFilterValue()}
            onValueChange={handleDefaultFilterChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              {COA_TEMPLATE_DEFAULT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 items-center">
        <Select
          value={filters.sort_by || 'template_name'}
          onValueChange={value =>
            onFiltersChange({
              sort_by: value as 'template_name' | 'created_at',
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {COA_TEMPLATE_SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSort(filters.sort_by || 'template_name')}
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
                onClick={() => handleSort('template_name')}
              >
                <div className="flex items-center gap-2">
                  Template Name
                  {filters.sort_by === 'template_name' && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
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
                  No COA templates found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map(coaTemplate => (
                <TableRow key={coaTemplate.id}>
                  <TableCell className="font-medium pl-3">
                    {coaTemplate.template_name}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {coaTemplate.description || '-'}
                  </TableCell>
                  <TableCell>
                    {coaTemplate.is_default ? (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Star className="h-3 w-3" />
                        Default
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <CoaStatusBadge isActive={coaTemplate.is_active} />
                  </TableCell>
                  <TableCell>
                    {new Date(coaTemplate.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <CoaTemplateActions
                      coaTemplate={coaTemplate}
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
