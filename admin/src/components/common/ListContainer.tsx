import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ListContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export const ListContainer = ({
  children,
  className,
  title,
  description,
  actions
}: ListContainerProps) => {
  return (
    <section className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {(title || description || actions) && (
        <header className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </header>
      )}
      <div className="p-6">
        {children}
      </div>
    </section>
  );
};