// features/chart-of-accounts/components/industry-types/industry-type-actions.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { IndustryType } from '../../lib/types';

interface IndustryTypeActionsProps {
  industryType: IndustryType;
  onEdit: (industryType: IndustryType) => void;
  onDelete: (industryType: IndustryType) => void;
  onView?: (industryType: IndustryType) => void;
}

export function IndustryTypeActions({
  industryType,
  onEdit,
  onDelete,
  onView,
}: IndustryTypeActionsProps) {
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
          <DropdownMenuItem onClick={() => onView(industryType)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(industryType)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(industryType)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
