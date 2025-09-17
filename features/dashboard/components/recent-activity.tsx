// features/dashboard/components/recent-activity.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityItem } from '../lib/types';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'tax':
        return 'bg-chart-1';
      case 'document':
        return 'bg-chart-2';
      case 'appointment':
        return 'bg-chart-3';
      default:
        return 'bg-chart-4';
    }
  };

  return (
    <Card className="bg-gradient-to-t from-foreground/5 to-card dark:bg-card shadow-xs border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 text-sm">
              <div
                className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}
              ></div>
              <span>{activity.description}</span>
              <span className="text-muted-foreground ml-auto">
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
