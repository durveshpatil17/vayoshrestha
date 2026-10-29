import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipProvider } from './Tooltip';

export interface KpiTileProps {
  label?: string;
  title?: string;
  value: string | number;
  unitOrTarget?: string;
  unit?: string;
  statusLine?: string;
  status?: 'positive' | 'negative' | 'critical' | 'neutral' | 'informative' | 'warning';
  icon?: React.ReactNode;
  delta?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  definition?: string;
  className?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label,
  title,
  value,
  unitOrTarget,
  unit,
  statusLine,
  status,
  icon,
  delta,
  definition,
  className = '',
}) => {
  const displayLabel = title || label || '';
  const displayUnit = unitOrTarget || unit;

  return (
    <div
      className={`bg-surface border border-border rounded-container p-5 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-text-secondary truncate">{displayLabel}</span>
        {definition && (
          <TooltipProvider>
            <Tooltip content={definition}>
              <button
                type="button"
                className="text-text-secondary hover:text-text focus:outline-none rounded-control p-0.5"
                aria-label={`Metric definition: ${displayLabel}`}
              >
                <Info className="w-4 h-4 stroke-[1.5]" />
              </button>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="my-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text tabular-nums">{value}</span>
        {displayUnit && (
          <span className="text-xs text-text-secondary font-normal tabular-nums">{displayUnit}</span>
        )}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        {statusLine && (
          <span
            className={`truncate ${
              status === 'positive'
                ? 'text-positive'
                : status === 'negative'
                ? 'text-negative'
                : status === 'critical'
                ? 'text-critical'
                : 'text-text-secondary'
            }`}
          >
            {statusLine}
          </span>
        )}
        {delta && (
          <span
            className={`tabular-nums font-semibold shrink-0 ${
              delta.trend === 'up'
                ? 'text-positive'
                : delta.trend === 'down'
                ? 'text-negative'
                : 'text-text-secondary'
            }`}
          >
            {delta.trend === 'up' ? '↑' : delta.trend === 'down' ? '↓' : '→'} {Math.abs(delta.value)}%
          </span>
        )}
      </div>
    </div>
  );
};
