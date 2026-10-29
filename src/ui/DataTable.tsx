import React from 'react';
import { DataTable as BaseDataTable, DataTableProps, Column } from '@/components/data/DataTable';
import { IllustratedMessage } from './IllustratedMessage';

export type { Column, DataTableProps };

export function DataTable<T extends Record<string, any>>({
  emptyState,
  ...props
}: DataTableProps<T>) {
  const defaultEmptyState = (
    <IllustratedMessage
      title="No records found"
      description="No items match your filter criteria. Try adjusting your search query or reset active filters."
    />
  );

  return (
    <BaseDataTable
      {...props}
      emptyState={emptyState || defaultEmptyState}
    />
  );
}
