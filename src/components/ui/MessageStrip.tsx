import React, { useState } from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';

export type MessageStripType = 'informative' | 'information' | 'positive' | 'critical' | 'negative';

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
  type = 'informative',
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

  const normalized = type === 'information' ? 'informative' : type;

  const typeConfigs: Record<
    string,
    { bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    informative: {
      bg: 'bg-informative-tint',
      border: 'border-informative/30',
      text: 'text-informative',
      icon: <Info className="w-5 h-5 shrink-0 text-informative stroke-[1.5] mt-0.5" />,
    },
    positive: {
      bg: 'bg-positive-tint',
      border: 'border-positive/30',
      text: 'text-positive',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-positive stroke-[1.5] mt-0.5" />,
    },
    critical: {
      bg: 'bg-critical-tint',
      border: 'border-critical/30',
      text: 'text-critical',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-critical stroke-[1.5] mt-0.5" />,
    },
    negative: {
      bg: 'bg-negative-tint',
      border: 'border-negative/30',
      text: 'text-negative',
      icon: <AlertCircle className="w-5 h-5 shrink-0 text-negative stroke-[1.5] mt-0.5" />,
    },
  };

  const config = typeConfigs[normalized] || typeConfigs.informative;

  return (
    <div
      role="status"
      className={`w-full rounded-control border ${config.border} ${config.bg} p-3.5 flex items-start gap-3 transition-opacity ${className}`}
    >
      {config.icon}
      <div className="flex-1 text-sm text-text leading-relaxed">
        {title && <span className="font-semibold mr-1.5 text-text">{title}</span>}
        <span className="text-text-secondary">{message}</span>
        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="ml-2 font-semibold text-accent hover:underline focus:outline-none"
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
          className="text-text-secondary hover:text-text p-1 rounded-control focus:outline-none focus:ring-1 focus:ring-focus-ring"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      )}
    </div>
  );
};
