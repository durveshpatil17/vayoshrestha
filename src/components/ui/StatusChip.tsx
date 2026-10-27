import React from 'react';

export type ChipVariant =
  | 'active'
  | 'registered'
  | 'pending'
  | 'opted-out'
  | 'approved'
  | 'rejected'
  | 'in-progress'
  | 'neutral'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';

export interface StatusChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles: Record<ChipVariant, string> = {
    active: 'bg-success-bg text-success border-success/30',
    approved: 'bg-success-bg text-success border-success/30',
    success: 'bg-success-bg text-success border-success/30',
    registered: 'bg-accent-tint text-accent border-accent/30',
    pending: 'bg-warning-bg text-warning border-warning/30',
    'in-progress': 'bg-warning-bg text-warning border-warning/30',
    warning: 'bg-warning-bg text-warning border-warning/30',
    'opted-out': 'bg-bg-subtle text-text-muted border-border-hairline',
    neutral: 'bg-bg-subtle text-text-muted border-border-hairline',
    danger: 'bg-danger-bg text-danger border-danger/30',
    rejected: 'bg-danger-bg text-danger border-danger/30',
    info: 'bg-info-bg text-info border-info/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-tag text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
