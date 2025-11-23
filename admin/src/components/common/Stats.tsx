import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsGridProps {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const StatsGrid = ({ children, cols = 4, gap = 'md', className }: StatsGridProps) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    };

    const gapSizes = {
        sm: 'gap-6',
        md: 'gap-8',
        lg: 'gap-10',
    };

    return (
        <div className={cn('grid', gridCols[cols], gapSizes[gap], className)}>
            {children}
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string }>;
    trend?: {
        value: string;
        isPositive?: boolean;
    };
    className?: string;
    variant?: 'default' | 'bordered' | 'minimal';
}

export const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    className,
    variant = 'default'
}: StatCardProps) => {
    const variants = {
        default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
        bordered: 'border-2 border-gray-200 hover:border-blue-300 transition-colors',
        minimal: 'hover:bg-gray-50 transition-colors',
    };

    return (
        <div className={cn('p-8 rounded-lg', variants[variant], className)}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-3">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className="flex-shrink-0 ml-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                )}
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <span
                        className={cn(
                            'text-sm font-medium',
                            trend.isPositive ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {trend.value}
                    </span>
                </div>
            )}
        </div>
    );
};