import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  noPadding = false,
  padding,
  children,
  className = '',
  ...props
}) => {
  const hasHeader = Boolean(title || subtitle || action);

  let paddingClass = 'p-6';
  if (noPadding || padding === 'none') {
    paddingClass = '';
  } else if (padding === 'sm') {
    paddingClass = 'p-3';
  } else if (padding === 'md') {
    paddingClass = 'p-5';
  } else if (padding === 'lg') {
    paddingClass = 'p-8';
  }

  return (
    <div
      className={`bg-surface border border-border rounded-container transition-colors ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base leading-6 font-semibold text-text truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-secondary mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={paddingClass}>{children}</div>
    </div>
  );
};
