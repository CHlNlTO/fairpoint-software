// features/dashboard/index.ts

// Components
export { DashboardOverview } from './components/dashboard-overview';
export { FinancialMetrics } from './components/financial-metrics';
export { RecentActivity } from './components/recent-activity';

// Types
export type { ActivityItem, DashboardData, FinancialMetric } from './lib/types';

// Constants
export {
  DEFAULT_FINANCIAL_METRICS,
  DEFAULT_RECENT_ACTIVITY,
} from './lib/constants';
