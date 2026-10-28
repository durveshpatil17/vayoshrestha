import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  breadcrumb?: BreadcrumbItem[];
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  actions?: React.ReactNode;
  statusBadge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  breadcrumb,
  primaryAction,
  secondaryActions,
  actions,
  statusBadge,
  className = '',
}) => {
  const effectiveCrumbs = breadcrumbs || breadcrumb;
  const effectivePrimaryAction = primaryAction || actions;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`pb-4 mb-6 border-b border-border transition-all duration-150 ${
        isScrolled
          ? 'sticky top-0 z-20 bg-surface/95 backdrop-blur-none border-b border-border shadow-none py-2'
          : 'bg-transparent'
      } ${className}`}
    >
      {/* Breadcrumbs on top (back links live here) */}
      {effectiveCrumbs && effectiveCrumbs.length > 0 && !isScrolled && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-secondary mb-2">
          {effectiveCrumbs.map((crumb, idx) => {
            const targetUrl = crumb.to || crumb.href;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.5} />}
                {targetUrl ? (
                  <Link to={targetUrl} className="hover:text-accent hover:underline transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Row: Title (28/600), Subtitle, Actions right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1
              className={`font-semibold text-text transition-all ${
                isScrolled ? 'text-lg leading-tight' : 'text-[28px] leading-[36px]'
              }`}
            >
              {title}
            </h1>
            {statusBadge && <div className="inline-flex shrink-0">{statusBadge}</div>}
          </div>
          {description && !isScrolled && (
            <p className="text-sm text-text-secondary mt-1 truncate max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {(effectivePrimaryAction || secondaryActions) && (
          <div className="flex items-center gap-3 shrink-0">
            {secondaryActions}
            {effectivePrimaryAction}
          </div>
        )}
      </div>
    </div>
  );
};
