import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  className,
  accentColor = '#3B82F6',
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Accent bar at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                <span>{trendValue}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-configured metric cards for specific use cases
export function AgentStatusCard({ 
  activeAgents, 
  totalAgents,
  trend 
}: { 
  activeAgents: number; 
  totalAgents: number;
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}) {
  return (
    <MetricCard
      title="Active Agents"
      value={`${activeAgents}/${totalAgents}`}
      description="agents online"
      trend={trend?.direction}
      trendValue={trend?.value}
      accentColor="#10B981"
    />
  );
}

export function TaskCompletionCard({
  completed,
  total,
  trend,
}: {
  completed: number;
  total: number;
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <MetricCard
      title="Task Completion"
      value={`${percentage}%`}
      description={`${completed} of ${total} tasks`}
      trend={trend?.direction}
      trendValue={trend?.value}
      accentColor="#8B5CF6"
    />
  );
}

export function BMADPhaseCard({
  currentPhase,
  totalPhases,
  phaseName,
}: {
  currentPhase: number;
  totalPhases: number;
  phaseName: string;
}) {
  return (
    <MetricCard
      title="BMAD Phase"
      value={`${currentPhase}/${totalPhases}`}
      description={phaseName}
      accentColor="#F59E0B"
    />
  );
}

export function CostTrackerCard({
  todayCost,
  budget,
  currency = '$',
}: {
  todayCost: number;
  budget: number;
  currency?: string;
}) {
  const percentage = budget > 0 ? Math.round((todayCost / budget) * 100) : 0;
  const trend = percentage > 80 ? 'down' : percentage > 50 ? 'neutral' : 'up';
  
  return (
    <MetricCard
      title="Today's Cost"
      value={`${currency}${todayCost.toFixed(2)}`}
      description={`${percentage}% of ${currency}${budget} budget`}
      trend={trend}
      trendValue={`${percentage}% used`}
      accentColor={percentage > 80 ? '#EF4444' : percentage > 50 ? '#F59E0B' : '#10B981'}
    />
  );
}

// Grid layout for multiple metrics
interface MetricsGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ 
  children, 
  className,
  columns = 4 
}: MetricsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(`grid gap-4 ${gridCols[columns]}`, className)}>
      {children}
    </div>
  );
}
