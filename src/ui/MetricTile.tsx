import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';

export interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  statusLine?: string;
  status?: 'positive' | 'negative' | 'critical' | 'informative' | 'neutral';
  statusIcon?: React.ReactNode;
  definition?: string;
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  unit,
  statusLine,
  status = 'neutral',
  statusIcon,
  definition,
  className = '',
}) => {
  const statusColors = {
    positive: 'text-positive',
    negative: 'text-negative',
    critical: 'text-critical',
    informative: 'text-accent',
    neutral: 'text-text-secondary',
  };

  return (
    <div
      className={`bg-surface border border-border rounded-container p-5 flex flex-col justify-between transition-colors ${className}`}
    >
      {/* Header: Label (14px secondary) + optional definition tooltip */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text-secondary font-normal truncate">
          {label}
        </span>
        {definition && (
          <TooltipProvider>
            <Tooltip content={definition}>
              <button
                type="button"
                className="text-text-secondary hover:text-text focus:outline-none p-0.5 rounded-control"
                aria-label={`Definition for ${label}`}
              >
                <Info className="w-4 h-4 stroke-[1.5]" />
              </button>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Metric Figure (28/600) + Unit (14px) */}
      <div className="my-3 flex items-baseline gap-2">
        <span className="text-[28px] leading-[36px] font-semibold text-text tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-text-secondary font-normal tabular-nums">
            {unit}
          </span>
        )}
      </div>

      {/* Status Line: Icon + text */}
      <div className="pt-2 border-t border-border flex items-center gap-1.5 text-xs">
        {statusIcon}
        <span className={`truncate ${statusColors[status]}`}>
          {statusLine || 'Normal status'}
        </span>
      </div>
    </div>
  );
};
