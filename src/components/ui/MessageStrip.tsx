import React, { useState } from 'react';
import {
  Info16Regular,
  CheckmarkCircle16Regular,
  Warning16Regular,
  ErrorCircle16Regular,
  Dismiss16Regular,
} from '@fluentui/react-icons';

export type MessageStripType = 'information' | 'positive' | 'critical' | 'negative';

export interface MessageStripProps {
  type?: MessageStripType;
  title?: string;
  message: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const MessageStrip: React.FC<MessageStripProps> = ({
  type = 'information',
  title,
  message,
  actionText,
  onAction,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const typeConfigs: Record<
    MessageStripType,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    information: {
      bg: 'bg-information-tint',
      border: 'border-accent/30',
      text: 'text-information',
      icon: <Info16Regular className="shrink-0 text-information mt-0.5" />,
    },
    positive: {
      bg: 'bg-positive-tint',
      border: 'border-positive/30',
      text: 'text-positive',
      icon: <CheckmarkCircle16Regular className="shrink-0 text-positive mt-0.5" />,
    },
    critical: {
      bg: 'bg-critical-tint',
      border: 'border-critical/30',
      text: 'text-critical',
      icon: <Warning16Regular className="shrink-0 text-critical mt-0.5" />,
    },
    negative: {
      bg: 'bg-negative-tint',
      border: 'border-negative/30',
      text: 'text-negative',
      icon: <ErrorCircle16Regular className="shrink-0 text-negative mt-0.5" />,
    },
  };

  const config = typeConfigs[type] || typeConfigs.information;

  return (
    <div
      role="status"
      className={`w-full rounded-control border ${config.border} ${config.bg} p-3 flex items-start gap-2.5 transition-opacity duration-fast ${className}`}
    >
      {config.icon}
      <div className="flex-1 text-sm text-text">
        {title && <span className="font-semibold mr-1.5 text-text">{title}</span>}
        <span className="text-text-secondary">{message}</span>
        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="ml-2 font-medium text-accent hover:underline focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {actionText}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="text-text-tertiary hover:text-text p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-focus-ring"
          aria-label="Dismiss message"
        >
          <Dismiss16Regular />
        </button>
      )}
    </div>
  );
};

