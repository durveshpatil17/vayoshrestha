import React from 'react';
import {
  CheckmarkCircle16Regular,
  Warning16Regular,
  ErrorCircle16Regular,
  Clock16Regular,
  Info16Regular,
} from '@fluentui/react-icons';

export type StatusIndicatorType =
  | 'positive'
  | 'critical'
  | 'negative'
  | 'neutral'
  | 'information';

export interface StatusIndicatorProps {
  type: StatusIndicatorType;
  label: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  label,
  className = '',
}) => {
  const configs: Record<
    StatusIndicatorType,
    { icon: React.ReactNode; colorClass: string }
  > = {
    positive: {
      icon: <CheckmarkCircle16Regular className="shrink-0 text-positive" />,
      colorClass: 'text-positive',
    },
    critical: {
      icon: <Warning16Regular className="shrink-0 text-critical" />,
      colorClass: 'text-critical',
    },
    negative: {
      icon: <ErrorCircle16Regular className="shrink-0 text-negative" />,
      colorClass: 'text-negative',
    },
    neutral: {
      icon: <Clock16Regular className="shrink-0 text-neutral" />,
      colorClass: 'text-neutral',
    },
    information: {
      icon: <Info16Regular className="shrink-0 text-information" />,
      colorClass: 'text-information',
    },
  };

  const config = configs[type] || configs.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${config.colorClass} ${className}`}
    >
      {config.icon}
      <span>{label}</span>
    </span>
  );
};

