// features/chart-of-accounts/components/coa-templates/coa-template-actions.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { CoaTemplate } from '../../lib/types';

interface CoaTemplateActionsProps {
  coaTemplate: CoaTemplate;
  onEdit: (coaTemplate: CoaTemplate) => void;
  onDelete: (coaTemplate: CoaTemplate) => void;
  onView?: (coaTemplate: CoaTemplate) => void;
}

export function CoaTemplateActions({
  coaTemplate,
  onEdit,
  onDelete,
  onView,
}: CoaTemplateActionsProps) {
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
          <DropdownMenuItem onClick={() => onView(coaTemplate)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(coaTemplate)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(coaTemplate)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
