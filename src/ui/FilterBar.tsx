import React from 'react';
import { FilterBar as BaseFilterBar, FilterBarProps, FilterConfig, FilterOption } from '@/components/data/FilterBar';

export type { FilterBarProps, FilterConfig, FilterOption };

export const FilterBar: React.FC<FilterBarProps> = (props) => {
  return <BaseFilterBar {...props} />;
};
