import React from 'react';
import { Search, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
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
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  onResetFilters,
  hasActiveFilters = false,
  actionsRight,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-bg-subtle border border-border-hairline rounded mb-4">
      {/* Search & Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[220px] max-w-xs flex-1">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-7 rounded bg-bg-base border border-border-hairline text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-accent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        {filters.map((f) => (
          <select
            key={f.id}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="h-8 px-2.5 rounded bg-bg-base border border-border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="ALL">All {f.label}</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {/* Clear Filters CTA */}
        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-danger hover:underline font-medium px-2 py-1"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Right Actions Slot (e.g. Export, Add New) */}
      {actionsRight && <div className="flex items-center gap-2 shrink-0">{actionsRight}</div>}
    </div>
  );
};
