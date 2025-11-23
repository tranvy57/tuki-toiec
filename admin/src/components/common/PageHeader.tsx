import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, children, className }: PageHeaderProps) => {
  return (
    <header className={cn('flex items-center justify-between pb-8 mb-2', className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
};