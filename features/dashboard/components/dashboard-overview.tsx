// features/dashboard/components/dashboard-overview.tsx

'use client';

import type { User } from '@/lib/types';
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="mb-6">
          <h1 className="text-lg font-bold">
            Welcome back, {user.firstName || user.email.split('@')[0]}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your tax and accounting needs
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <FinancialMetrics metrics={DEFAULT_FINANCIAL_METRICS} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
        >
          <RecentActivity activities={DEFAULT_RECENT_ACTIVITY} />
        </motion.div>
      </div>
    </main>
  );
}
