// features/chart-of-accounts/components/business-types/business-type-actions.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import type { BusinessType } from '../../lib/types';

interface BusinessTypeActionsProps {
  businessType: BusinessType;
  onEdit: (businessType: BusinessType) => void;
  onDelete: (businessType: BusinessType) => void;
  onView?: (businessType: BusinessType) => void;
  disabled?: boolean;
}

export function BusinessTypeActions({
  businessType,
  onEdit,
  onDelete,
  onView,
  disabled = false,
}: BusinessTypeActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <>
            <DropdownMenuItem onClick={() => onView(businessType)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => onEdit(businessType)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(businessType)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
