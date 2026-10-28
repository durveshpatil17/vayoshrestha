import React from 'react';
import { Info16Regular } from '@fluentui/react-icons';
import { Tooltip, TooltipProvider } from './Tooltip';

export interface KpiTileProps {
  label: string;
  value: string | number;
  unitOrTarget?: string;
  delta?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  definition?: string;
  sparklineData?: number[];
  className?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label,
  value,
  unitOrTarget,
  delta,
  definition,
  sparklineData,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-border rounded-card p-4 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-label truncate">{label}</span>
        {definition && (
          <TooltipProvider>
            <Tooltip content={definition}>
              <button
                type="button"
                className="text-text-tertiary hover:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent rounded p-0.5"
                aria-label={`Metric definition: ${label}`}
              >
                <Info16Regular className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="my-2 flex items-baseline gap-2">
        <span className="text-kpi-value text-text">{value}</span>
        {unitOrTarget && (
          <span className="text-xs text-text-secondary font-normal">
            {unitOrTarget}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-subtle mt-1">
        {delta ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-chip text-[11px] font-medium tabular-nums ${
                delta.trend === 'up'
                  ? 'bg-positive-tint text-positive'
                  : delta.trend === 'down'
                  ? 'bg-critical-tint text-critical'
                  : 'bg-neutral-tint text-neutral'
              }`}
            >
              {delta.trend === 'up' && '▲ +'}
              {delta.trend === 'down' && '▼ '}
              {delta.value}%
            </span>
            <span className="text-caption text-text-secondary">
              {delta.label || 'vs last period'}
            </span>
          </div>
        ) : (
          <div />
        )}

        {sparklineData && sparklineData.length > 1 && (
          <div className="w-16 h-6 flex items-end gap-0.5" aria-hidden="true">
            {sparklineData.map((val, idx) => {
              const max = Math.max(...sparklineData);
              const min = Math.min(...sparklineData);
              const range = max - min || 1;
              const heightPct = Math.max(15, Math.round(((val - min) / range) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 bg-accent/70 rounded-t-xs"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

