import React from 'react';

export interface KeyValueItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  copyable?: boolean;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export const KeyValueList: React.FC<KeyValueListProps> = ({
  items,
  columns = 2,
  className = '',
}) => {
  const colClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <dl className={`grid ${colClass} gap-x-6 gap-y-4 ${className}`}>
      {items.map((item, idx) => (
        <div key={idx} className="min-w-0">
          <dt className="text-xs text-text-secondary font-normal mb-1 flex items-center gap-1.5">
            {item.icon && <span className="text-text-secondary">{item.icon}</span>}
            <span>{item.label}</span>
          </dt>
          <dd className="text-sm font-semibold text-text tabular-nums truncate">
            {item.value ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
};

