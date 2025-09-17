// features/dashboard/components/dashboard-overview.tsx

'use client';

import type { User } from '@/lib/types';
import {
  DEFAULT_FINANCIAL_METRICS,
  DEFAULT_RECENT_ACTIVITY,
} from '../lib/constants';
import { FinancialMetrics } from './financial-metrics';
import { RecentActivity } from './recent-activity';

interface DashboardOverviewProps {
  user: User;
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  return (
    <main className="space-y-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold">
          Welcome back, {user.firstName || user.email.split('@')[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your tax and accounting needs
        </p>
      </div>

      <FinancialMetrics metrics={DEFAULT_FINANCIAL_METRICS} />

      <RecentActivity activities={DEFAULT_RECENT_ACTIVITY} />
    </main>
  );
}
