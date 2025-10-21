// features/chart-of-accounts/components/shared/coa-status-badge.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CoaStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function CoaStatusBadge({ isActive, className }: CoaStatusBadgeProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(
        'text-xs font-medium',
        isActive
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        className
      )}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}
