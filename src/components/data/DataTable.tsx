import React, { useState } from 'react';
import {
  ChevronLeft16Regular,
  ChevronRight16Regular,
  ArrowSort16Regular,
  ArrowSortUp16Regular,
  ArrowSortDown16Regular,
  MoreHorizontal16Regular,
} from '@fluentui/react-icons';
import { Checkbox } from '../ui/Checkbox';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  rowActions?: (item: T) => React.ReactNode;
  initialPageSize?: number;
  onRowClick?: (item: T) => void;
  bulkActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  selectable = false,
  selectedIds = [],
  onSelectChange,
  isLoading = false,
  emptyState,
  rowActions,
  initialPageSize = 25,
  onRowClick,
  bulkActions,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });
  }, [data, sortKey, sortDirection]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectChange) return;
    if (checked) {
      const allIds = currentRows.map((r) => keyExtractor(r));
      const merged = Array.from(new Set([...selectedIds, ...allIds]));
      onSelectChange(merged);
    } else {
      const currentIds = new Set(currentRows.map((r) => keyExtractor(r)));
      onSelectChange(selectedIds.filter((id) => !currentIds.has(id)));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectChange) return;
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  const allCurrentSelected =
    currentRows.length > 0 && currentRows.every((r) => selectedIds.includes(keyExtractor(r)));

  return (
    <div className="w-full border border-border rounded-card bg-surface overflow-hidden flex flex-col shadow-xs">
      {/* Optional Bulk Actions Bar when rows are selected */}
      {selectable && selectedIds.length > 0 && (
        <div className="h-10 bg-accent-tint border-b border-border px-4 flex items-center justify-between text-sm text-accent animate-in fade-in duration-fast">
          <div className="flex items-center gap-3">
            <span className="font-semibold tabular-nums">
              {selectedIds.length} selected
            </span>
            {bulkActions}
          </div>
          <button
            type="button"
            onClick={() => onSelectChange?.([])}
            className="text-xs font-semibold hover:underline text-accent"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[280px]">
        <table className="w-full text-left border-collapse text-sm">
          {/* Sticky Header: 12px/600 secondary text, surface-subtle, no uppercase */}
          <thead className="bg-surface-subtle border-b border-border sticky top-0 z-10 select-none">
            <tr className="h-9">
              {selectable && (
                <th className="w-10 px-3 text-center">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={allCurrentSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </th>
              )}
              {columns.map((col) => {
                const alignClass =
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-3 py-2 text-label text-text-secondary ${alignClass} ${
                      col.sortable ? 'cursor-pointer hover:bg-surface-hover' : ''
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-text-tertiary">
                          {sortKey === col.key ? (
                            sortDirection === 'asc' ? (
                              <ArrowSortUp16Regular className="text-accent" />
                            ) : (
                              <ArrowSortDown16Regular className="text-accent" />
                            )
                          ) : (
                            <ArrowSort16Regular className="opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {rowActions && (
                <th className="w-20 px-3 py-2 text-right text-label text-text-secondary">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body: 40px row height, hairline bottom border only, no vertical lines, no zebra */}
          <tbody className="divide-y divide-border-subtle">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-text-secondary"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin text-accent"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  {emptyState || (
                    <span className="text-sm text-text-secondary">
                      No records match the selected criteria.
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              currentRows.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(item)}
                    className={`h-10 transition-colors duration-fast ${
                      isSelected
                        ? 'bg-surface-selected'
                        : 'hover:bg-surface-hover'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {selectable && (
                      <td
                        className="px-3 text-center"
                        onClick={(e) => handleSelectRow(id, e)}
                      >
                        <div className="flex items-center justify-center">
                          <Checkbox checked={isSelected} />
                        </div>
                      </td>
                    )}
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right tabular-nums'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';
                      return (
                        <td key={col.key} className={`px-3 py-2 text-text text-sm ${alignClass}`}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td
                        className="px-3 py-2 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {rowActions(item)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="h-11 border-t border-border-subtle bg-surface px-4 flex items-center justify-between text-xs text-text-secondary select-none">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-text font-medium tabular-nums">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong className="text-text font-medium tabular-nums">{Math.min(startIndex + pageSize, totalItems)}</strong> of{' '}
            <strong className="text-text font-medium tabular-nums">{totalItems}</strong> records
          </span>

          <div className="flex items-center gap-1.5 ml-4">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-surface border border-border rounded-control px-2 py-0.5 text-xs text-text focus:outline-none focus:border-accent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page <strong className="text-text font-medium tabular-nums">{currentPage}</strong> of{' '}
            <strong className="text-text font-medium tabular-nums">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-surface-hover text-text disabled:opacity-30 disabled:pointer-events-none"
              title="Previous Page"
            >
              <ChevronLeft16Regular />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-surface-hover text-text disabled:opacity-30 disabled:pointer-events-none"
              title="Next Page"
            >
              <ChevronRight16Regular />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
