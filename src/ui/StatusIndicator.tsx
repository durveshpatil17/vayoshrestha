import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Info,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export type StatusType =
  | 'success'
  | 'positive'
  | 'error'
  | 'negative'
  | 'warning'
  | 'critical'
  | 'info'
  | 'informative'
  | 'pending'
  | 'in-progress'
  | 'stopped'
  | 'neutral';

export interface StatusIndicatorProps {
  type?: StatusType;
  status?: StatusType;
  label: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  status,
  label,
  className = '',
}) => {
  const currentStatus = status || type || 'neutral';

  const configs: Record<
    string,
    { icon: React.ReactNode; colorClass: string }
  > = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-positive stroke-[1.5]" />,
      colorClass: 'text-positive',
    },
    positive: {
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-positive stroke-[1.5]" />,
      colorClass: 'text-positive',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-negative stroke-[1.5]" />,
      colorClass: 'text-negative',
    },
    negative: {
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-negative stroke-[1.5]" />,
      colorClass: 'text-negative',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-critical stroke-[1.5]" />,
      colorClass: 'text-critical',
    },
    critical: {
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-critical stroke-[1.5]" />,
      colorClass: 'text-critical',
    },
    info: {
      icon: <Info className="w-4 h-4 shrink-0 text-accent stroke-[1.5]" />,
      colorClass: 'text-accent',
    },
    informative: {
      icon: <Info className="w-4 h-4 shrink-0 text-accent stroke-[1.5]" />,
      colorClass: 'text-accent',
    },
    pending: {
      icon: <Clock className="w-4 h-4 shrink-0 text-text-secondary stroke-[1.5]" />,
      colorClass: 'text-text-secondary',
    },
    'in-progress': {
      icon: <RefreshCw className="w-4 h-4 shrink-0 text-accent stroke-[1.5]" />,
      colorClass: 'text-accent',
    },
    stopped: {
      icon: <XCircle className="w-4 h-4 shrink-0 text-text-disabled stroke-[1.5]" />,
      colorClass: 'text-text-disabled',
    },
    neutral: {
      icon: <Clock className="w-4 h-4 shrink-0 text-text-secondary stroke-[1.5]" />,
      colorClass: 'text-text-secondary',
    },
  };

  const current = configs[currentStatus] || configs.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-normal ${current.colorClass} select-none ${className}`}
    >
      {current.icon}
      <span className="text-text">{label}</span>
    </span>
  );
};

