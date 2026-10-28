import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  noPadding = false,
  children,
  className = '',
  ...props
}) => {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <div
      className={`bg-surface border border-border rounded-card shadow-xs transition-colors duration-fast ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-card-title text-text truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-caption text-text-secondary mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
