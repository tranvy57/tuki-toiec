import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className
}: StatsCardProps) => {
  return (
    <div className={cn('bg-white p-6 rounded-lg border border-gray-200', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center text-sm mt-2',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span className={cn(
                'mr-1',
                trend.isPositive ? '↗' : '↘'
              )}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="text-gray-400 ml-4">
          {icon}
        </div>
      </div>
    </div>
  );
};