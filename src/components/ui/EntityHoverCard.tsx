import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, User, ShieldAlert, HeartPulse, Ticket, FileText, Package, Users } from 'lucide-react';
import { EntityType } from '@/services/tasks';

export interface EntityHoverCardProps {
  entityType: EntityType;
  entityId: string;
  title: string;
  subtitle?: string;
  status?: string;
  statusVariant?: 'positive' | 'negative' | 'critical' | 'informative' | 'neutral';
  facts?: Array<{ label: string; value: string }>;
  detailUrl?: string;
  children: React.ReactNode;
  className?: string;
}

export const EntityHoverCard: React.FC<EntityHoverCardProps> = ({
  entityType,
  entityId,
  title,
  subtitle,
  status,
  statusVariant = 'neutral',
  facts = [],
  detailUrl,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 250);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'senior':
        return <User className="w-4 h-4 text-accent stroke-[1.5]" />;
      case 'case':
        return <ShieldAlert className="w-4 h-4 text-critical stroke-[1.5]" />;
      case 'referral':
        return <HeartPulse className="w-4 h-4 text-informative stroke-[1.5]" />;
      case 'voucher':
        return <Ticket className="w-4 h-4 text-positive stroke-[1.5]" />;
      case 'intake':
        return <FileText className="w-4 h-4 text-accent stroke-[1.5]" />;
      case 'pack':
        return <Package className="w-4 h-4 text-positive stroke-[1.5]" />;
      case 'roster':
        return <Users className="w-4 h-4 text-accent stroke-[1.5]" />;
      default:
        return <FileText className="w-4 h-4 text-text-secondary stroke-[1.5]" />;
    }
  };

  const getStatusBadgeStyle = () => {
    switch (statusVariant) {
      case 'positive':
        return 'bg-positive/10 text-positive border-positive/20';
      case 'negative':
        return 'bg-negative/10 text-negative border-negative/20';
      case 'critical':
        return 'bg-critical/10 text-critical border-critical/20';
      case 'informative':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-surface-subtle text-text-secondary border-border';
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <div className="cursor-pointer">{children}</div>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 left-0 top-full mt-1.5 w-72 bg-surface border border-border rounded-container p-3 text-left transition-opacity"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-control bg-surface-subtle border border-border-subtle">
                {getEntityIcon()}
              </div>
              <div className="min-w-0">
                <div className="text-caption font-semibold text-text truncate">{title}</div>
                <div className="text-caption text-text-muted tabular-nums">{entityId}</div>
              </div>
            </div>

            {status && (
              <span
                className={`text-caption font-semibold px-2 py-0.5 rounded-control border ${getStatusBadgeStyle()}`}
              >
                {status}
              </span>
            )}
          </div>

          {subtitle && (
            <div className="text-caption text-text-secondary mt-2">{subtitle}</div>
          )}

          {/* Key Facts */}
          {facts.length > 0 && (
            <div className="mt-2.5 space-y-1.5 pt-2 border-t border-border-subtle">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex items-center justify-between text-caption">
                  <span className="text-text-muted">{fact.label}</span>
                  <span className="font-semibold text-text tabular-nums">{fact.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Link */}
          {detailUrl && (
            <div className="mt-3 pt-2 border-t border-border-subtle flex justify-end">
              <Link
                to={detailUrl}
                className="inline-flex items-center gap-1 text-caption font-semibold text-accent hover:underline"
              >
                <span>View details</span>
                <ExternalLink className="w-3 h-3 stroke-[1.5]" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
