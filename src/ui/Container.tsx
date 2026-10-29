import React from 'react';

export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  header?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  header,
  title,
  subtitle,
  actions,
  footer,
  noPadding = false,
  padding,
  children,
  className = '',
  ...props
}) => {
  const hasHeader = Boolean(header || title || subtitle || actions);

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
            {header || (
              <>
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
              </>
            )}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={paddingClass}>{children}</div>

      {footer && (
        <div className="px-6 py-3 border-t border-border bg-surface-subtle rounded-b-container flex items-center justify-between gap-3 text-xs text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
};

