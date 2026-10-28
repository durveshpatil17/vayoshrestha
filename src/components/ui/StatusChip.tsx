import React from 'react';

export type StatusChipVariant =
  | 'neutral'
  | 'accent'
  | 'positive'
  | 'critical'
  | 'negative'
  | 'critical-sos'
  | string;

export interface StatusChipProps {
  label: React.ReactNode;
  variant?: StatusChipVariant;
  status?: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant,
  status,
  className = '',
}) => {
  const raw = (status || variant || 'neutral').toLowerCase();

  let normalized = raw;
  if (['active', 'approved', 'success', 'resolved'].includes(raw)) {
    normalized = 'positive';
  } else if (['pending', 'in-progress', 'warning', 'needs call'].includes(raw)) {
    normalized = 'critical';
  } else if (['sos', 'sos-critical', 'critical-sos'].includes(raw)) {
    normalized = 'critical-sos';
  } else if (['danger', 'rejected', 'failed', 'unacknowledged', 'negative'].includes(raw)) {
    normalized = 'negative';
  } else if (['info', 'registered', 'accent', 'informative'].includes(raw)) {
    normalized = 'accent';
  }

  const variantStyles: Record<string, string> = {
    neutral: 'bg-surface-subtle text-text-secondary border border-border',
    accent: 'bg-accent-tint text-accent border border-accent/20',
    positive: 'bg-positive-tint text-positive border border-positive/20',
    critical: 'bg-critical-tint text-critical border border-critical/20',
    negative: 'bg-negative-tint text-negative border border-negative/20',
    'critical-sos': 'bg-negative text-text-on-accent border border-negative font-semibold',
  };

  const style = variantStyles[normalized] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-chip text-xs font-semibold ${style} ${className}`}
    >
      {label}
    </span>
  );
};
