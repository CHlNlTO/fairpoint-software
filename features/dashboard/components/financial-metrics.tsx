// features/dashboard/components/financial-metrics.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { FinancialMetric } from '../lib/types';

interface FinancialMetricsProps {
  metrics: FinancialMetric[];
}

export function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  return (
    <div className="*:data-[slot=card]:from-foreground/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center justify-between gap-2">
              <span>{metric.title}</span>
              {metric.badge && (
                <Badge className="text-white text-xs px-2 py-1">
                  {metric.badge}
                </Badge>
              )}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            {metric.percentage !== '+0%' && metric.percentage !== '-0%' && (
              <CardAction>
                <Badge variant="outline" className="gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.percentage}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          {metric.percentage !== '+0%' && metric.percentage !== '-0%' && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.trend === 'up' ? 'Trending up' : 'Trending down'} this
                period{' '}
                {metric.trend === 'up' ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">{metric.description}</div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
