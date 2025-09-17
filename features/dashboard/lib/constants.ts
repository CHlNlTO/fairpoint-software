// features/dashboard/lib/constants.ts

import type { ActivityItem, FinancialMetric } from './types';

export const DEFAULT_FINANCIAL_METRICS: FinancialMetric[] = [
  {
    title: 'Total Income',
    value: '₱840,456.00',
    trend: 'up',
    percentage: '+0%',
    description: 'Total revenue for the current period',
  },
  {
    title: 'Total Expense',
    value: '₱428,765.00',
    trend: 'down',
    percentage: '-0%',
    description: 'Total expenses for the current period',
  },
  {
    title: 'Current Tax Computation',
    value: '₱47,236.48',
    trend: 'up',
    percentage: '+0%',
    description: 'Current tax computation',
    badge: '1701Q',
  },
  {
    title: 'Upcoming Tax Deadline',
    value: 'November 15, 2025',
    trend: 'down',
    percentage: '+0%',
    description: 'Upcoming tax deadline',
  },
];

export const DEFAULT_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    description: 'Tax return submitted for 2025',
    timestamp: '2 days ago',
    type: 'tax',
  },
  {
    id: '2',
    description: 'Document uploaded: 1701Q Form',
    timestamp: '1 week ago',
    type: 'document',
  },
  {
    id: '3',
    description: 'Appointment scheduled for tax review',
    timestamp: '2 weeks ago',
    type: 'appointment',
  },
];
