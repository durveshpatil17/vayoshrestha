import React from 'react';
import { BarChart2, Table } from 'lucide-react';

export interface ChartTableToggleProps {
  view: 'chart' | 'table';
  onChange: (view: 'chart' | 'table') => void;
  className?: string;
}

export const ChartTableToggle: React.FC<ChartTableToggleProps> = ({
  view,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="group"
      aria-label="View toggle"
      className={`inline-flex items-center rounded-control border border-border bg-surface-subtle p-0.5 select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange('chart')}
        className={`h-7 px-2.5 rounded-control text-xs font-semibold flex items-center gap-1.5 transition-colors ${
          view === 'chart'
            ? 'bg-surface text-accent shadow-sm'
            : 'text-text-secondary hover:text-text'
        }`}
      >
        <BarChart2 className="w-3.5 h-3.5 stroke-[1.5]" />
        <span>Chart</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('table')}
        className={`h-7 px-2.5 rounded-control text-xs font-semibold flex items-center gap-1.5 transition-colors ${
          view === 'table'
            ? 'bg-surface text-accent shadow-sm'
            : 'text-text-secondary hover:text-text'
        }`}
      >
        <Table className="w-3.5 h-3.5 stroke-[1.5]" />
        <span>View as table</span>
      </button>
    </div>
  );
};
