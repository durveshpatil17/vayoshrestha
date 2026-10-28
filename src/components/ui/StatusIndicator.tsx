import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Info,
} from 'lucide-react';

export type StatusIndicatorType =
  | 'positive'
  | 'critical'
  | 'negative'
  | 'neutral'
  | 'informative'
  | 'information';

export interface StatusIndicatorProps {
  type?: StatusIndicatorType;
  status?: StatusIndicatorType;
  label: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  status,
  label,
  className = '',
}) => {
  const effectiveType = status || type || 'neutral';
  const normalized = effectiveType === 'information' ? 'informative' : effectiveType;

  const configs: Record<
    string,
    { icon: React.ReactNode; colorClass: string }
  > = {
    positive: {
      icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-positive stroke-[1.5]" />,
      colorClass: 'text-positive',
    },
    critical: {
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-critical stroke-[1.5]" />,
      colorClass: 'text-critical',
    },
    negative: {
      icon: <AlertCircle className="w-5 h-5 shrink-0 text-negative stroke-[1.5]" />,
      colorClass: 'text-negative',
    },
    neutral: {
      icon: <Clock className="w-5 h-5 shrink-0 text-text-secondary stroke-[1.5]" />,
      colorClass: 'text-text-secondary',
    },
    informative: {
      icon: <Info className="w-5 h-5 shrink-0 text-informative stroke-[1.5]" />,
      colorClass: 'text-informative',
    },
  };

  const current = configs[normalized] || configs.neutral;

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-normal ${current.colorClass} ${className}`}
    >
      {current.icon}
      <span>{label}</span>
    </span>
  );
};
