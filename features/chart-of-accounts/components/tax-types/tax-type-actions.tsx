// features/chart-of-accounts/components/tax-types/tax-type-actions.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { TaxType } from '../../lib/types';

interface TaxTypeActionsProps {
  taxType: TaxType;
  onEdit: (taxType: TaxType) => void;
  onDelete: (taxType: TaxType) => void;
  onView?: (taxType: TaxType) => void;
}

export function TaxTypeActions({
  taxType,
  onEdit,
  onDelete,
  onView,
}: TaxTypeActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={() => onView(taxType)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(taxType)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(taxType)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
