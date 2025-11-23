import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentWrapperProps {
    children: ReactNode;
    spacing?: 'tight' | 'normal' | 'relaxed';
    className?: string;
}

export const ContentWrapper = ({ children, spacing = 'normal', className }: ContentWrapperProps) => {
    const spacingClasses = {
        tight: 'space-y-6',
        normal: 'space-y-8',
        relaxed: 'space-y-12',
    };

    return (
        <div className={cn(spacingClasses[spacing], className)}>
            {children}
        </div>
    );
};

interface FlexContainerProps {
    children: ReactNode;
    direction?: 'row' | 'col';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: boolean;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const FlexContainer = ({
    children,
    direction = 'row',
    align = 'start',
    justify = 'start',
    wrap = false,
    gap = 'md',
    className
}: FlexContainerProps) => {
    const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

    const alignClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    };

    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
    };

    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
    };

    return (
        <div className={cn(
            'flex',
            directionClass,
            alignClasses[align],
            justifyClasses[justify],
            wrap && 'flex-wrap',
            gapClasses[gap],
            className
        )}>
            {children}
        </div>
    );
};

interface GridContainerProps {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const GridContainer = ({ children, cols = 1, gap = 'md', className }: GridContainerProps) => {
    const gridColsClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        12: 'grid-cols-12',
    };

    const gapClasses = {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
    };

    return (
        <div className={cn('grid', gridColsClasses[cols], gapClasses[gap], className)}>
            {children}
        </div>
    );
};