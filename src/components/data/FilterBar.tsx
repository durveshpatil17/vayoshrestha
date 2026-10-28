import React, { useState } from 'react';
import {
  Search16Regular,
  Dismiss12Regular,
  ChevronDown16Regular,
  Filter16Regular,
} from '@fluentui/react-icons';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/DropdownMenu';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id?: string;
  key?: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (val: string) => void;
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  actionsRight?: React.ReactNode;
  savedViews?: string[];
  currentView?: string;
  onSelectView?: (view: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  onResetFilters,
  hasActiveFilters = false,
  actionsRight,
  savedViews = ['Standard', 'Needs Attention', 'Recently Updated'],
  currentView = 'Standard',
  onSelectView,
}) => {
  const [activeView, setActiveView] = useState(currentView);

  const activeFilters = filters.filter((f) => f.value && f.value !== 'ALL');

  return (
    <div className="bg-surface border border-border rounded-card p-3 mb-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side: Saved Views + Search + Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Saved Views Dropdown (Fiori style) */}
          <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-8 px-2.5 bg-surface-subtle border border-border rounded-control text-xs font-medium text-text flex items-center gap-1.5 hover:bg-surface-hover transition-colors"
              >
                <span className="text-text-secondary">View:</span>
                <span className="font-semibold text-text">{activeView}</span>
                <ChevronDown16Regular className="text-text-tertiary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {savedViews.map((view) => (
                <DropdownMenuItem
                  key={view}
                  onClick={() => {
                    setActiveView(view);
                    onSelectView?.(view);
                  }}
                >
                  {view} {view === activeView ? '✓' : ''}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert('Save current view as custom view')}>
                Save View As...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>

          {/* Global Search Input */}
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <span className="absolute left-2.5 top-2 text-text-tertiary pointer-events-none">
              <Search16Regular />
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-8 pl-8 pr-7 rounded-control bg-surface border border-border text-sm text-text placeholder:text-text-disabled focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-tint transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-text-tertiary hover:text-text p-0.5 rounded"
                aria-label="Clear search"
              >
                <Dismiss12Regular />
              </button>
            )}
          </div>

          {/* Property Filters (Dropdowns) */}
          {filters.map((f) => (
            <select
              key={f.id || f.key || f.label}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text focus:outline-none focus:border-accent hover:border-border-strong transition-colors cursor-pointer"
            >
              <option value="ALL">All {f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Reset Filters CTA */}
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-negative hover:underline font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Right Actions Slot */}
        {actionsRight && (
          <div className="flex items-center gap-2 shrink-0">{actionsRight}</div>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border-subtle text-xs">
          <span className="text-text-secondary text-[11px] font-medium mr-1 flex items-center gap-1">
            <Filter16Regular className="w-3 h-3 text-text-tertiary" /> Active Filters:
          </span>
          {activeFilters.map((f) => {
            const selectedOpt = f.options.find((o) => o.value === f.value);
            return (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 bg-surface-subtle text-text border border-border text-xs px-2 py-0.5 rounded-chip"
              >
                <span className="text-text-secondary">{f.label}:</span>
                <span className="font-medium">{selectedOpt ? selectedOpt.label : f.value}</span>
                <button
                  type="button"
                  onClick={() => f.onChange('ALL')}
                  className="text-text-tertiary hover:text-text p-0.5 rounded"
                  aria-label={`Remove filter ${f.label}`}
                >
                  <Dismiss12Regular />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
