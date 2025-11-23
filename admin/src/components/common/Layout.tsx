import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'bordered' | 'elevated' | 'ghost';
}

export const Section = ({ children, className, variant = 'default' }: SectionProps) => {
    const variants = {
        default: '',
        bordered: 'border border-gray-200 rounded-lg',
        elevated: 'bg-white shadow-sm border border-gray-100 rounded-lg',
        ghost: 'bg-gray-50 rounded-lg',
    };

    return (
        <section className={cn('p-8', variants[variant], className)}>
            {children}
        </section>
    );
};

interface PanelProps {
    children: ReactNode;
    title?: string;
    description?: string;
    headerActions?: ReactNode;
    className?: string;
    variant?: 'default' | 'card';
}

export const Panel = ({
    children,
    title,
    description,
    headerActions,
    className,
    variant = 'default'
}: PanelProps) => {
    const variants = {
        default: 'space-y-8',
        card: 'bg-white shadow-sm border border-gray-100 rounded-lg p-8 space-y-8',
    };

    return (
        <div className={cn(variants[variant], className)}>
            {(title || description || headerActions) && (
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        {title && (
                            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        )}
                        {description && (
                            <p className="text-sm text-gray-600">{description}</p>
                        )}
                    </div>
                    {headerActions && (
                        <div className="flex items-center gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}
            <div>{children}</div>
        </div>
    );
};