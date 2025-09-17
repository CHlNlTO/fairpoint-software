// features/dashboard/lib/types.ts

export interface FinancialMetric {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  percentage: string;
  description: string;
  badge?: string;
}

export interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  type: 'tax' | 'document' | 'appointment' | 'general';
}

export interface DashboardData {
  metrics: FinancialMetric[];
  recentActivity: ActivityItem[];
  user: {
    firstName?: string;
    email: string;
  };
}
