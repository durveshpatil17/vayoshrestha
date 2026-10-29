import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  href?: string;
}

export interface DynamicPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  breadcrumb?: BreadcrumbItem[];
  backLink?: { label?: string; to: string };
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  statusIndicator?: React.ReactNode;
  className?: string;
}

export const DynamicPageHeader: React.FC<DynamicPageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  breadcrumb,
  backLink,
  primaryAction,
  secondaryActions,
  statusIndicator,
  className = '',
}) => {
  const navigate = useNavigate();
  const effectiveSubtitle = subtitle || description;
  const effectiveBreadcrumbs = breadcrumbs || breadcrumb;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold for collapsing into sticky state
      setIsScrolled(window.scrollY > 48);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-150 select-none ${
        isScrolled
          ? 'sticky top-0 z-30 bg-surface border-b border-border shadow-overlay px-8 h-14 flex items-center justify-between -mx-8 -mt-8 mb-6'
          : 'pb-4 mb-6 border-b border-border'
      } ${className}`}
    >
      {/* Expanded State */}
      {!isScrolled ? (
        <div className="w-full space-y-2">
          {/* Breadcrumb row & Back link on top */}
          <div className="flex items-center justify-between text-xs text-text-secondary">
            {effectiveBreadcrumbs && effectiveBreadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 flex-wrap">
                {backLink && (
                  <button
                    type="button"
                    onClick={() => navigate(backLink.to)}
                    className="inline-flex items-center gap-1 text-text-secondary hover:text-accent mr-2 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>{backLink.label || 'Back'}</span>
                  </button>
                )}
                {effectiveBreadcrumbs.map((crumb, idx) => {
                  const target = crumb.to || crumb.href;
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-disabled stroke-[1.5]" />}
                      {target ? (
                        <Link to={target} className="hover:text-accent transition-colors">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-text font-semibold">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            ) : backLink ? (
              <button
                type="button"
                onClick={() => navigate(backLink.to)}
                className="inline-flex items-center gap-1 text-text-secondary hover:text-accent font-medium mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>{backLink.label || 'Back'}</span>
              </button>
            ) : null}
          </div>

          {/* Main Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-[28px] leading-[36px] font-semibold text-text truncate">
                  {title}
                </h1>
                {statusIndicator && <div className="shrink-0">{statusIndicator}</div>}
              </div>
              {effectiveSubtitle && (
                <p className="text-sm text-text-secondary mt-0.5 truncate max-w-4xl">
                  {effectiveSubtitle}
                </p>
              )}
            </div>

            {/* Actions cluster */}
            {(primaryAction || secondaryActions) && (
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                {secondaryActions}
                {primaryAction}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Compact Sticky Title Bar (56px) */
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {backLink && (
              <button
                type="button"
                onClick={() => navigate(backLink.to)}
                className="text-text-secondary hover:text-accent p-1 rounded-control transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}
            <h1 className="text-base font-semibold text-text truncate">
              {title}
            </h1>
            {statusIndicator && <div className="shrink-0">{statusIndicator}</div>}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {secondaryActions}
            {primaryAction}
          </div>
        </div>
      )}
    </header>
  );
};
