import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type MessageStripType = 'informative' | 'positive' | 'critical' | 'negative';

export interface MessageStripProps {
  type?: MessageStripType;
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const MessageStrip: React.FC<MessageStripProps> = ({
  type = 'informative',
  children,
  title,
  action,
  onClose,
  className = '',
}) => {
  const configs = {
    informative: {
      bg: 'bg-informative-tint',
      border: 'border-accent/20',
      iconColor: 'text-accent',
      icon: Info,
    },
    positive: {
      bg: 'bg-positive-tint',
      border: 'border-positive/20',
      iconColor: 'text-positive',
      icon: CheckCircle2,
    },
    critical: {
      bg: 'bg-critical-tint',
      border: 'border-critical/30',
      iconColor: 'text-critical',
      icon: AlertTriangle,
    },
    negative: {
      bg: 'bg-negative-tint',
      border: 'border-negative/20',
      iconColor: 'text-negative',
      icon: AlertCircle,
    },
  };

  const current = configs[type];
  const IconComponent = current.icon;

  return (
    <div
      role="status"
      className={`rounded-control border ${current.border} ${current.bg} px-3.5 py-2.5 flex items-start gap-3 text-sm text-text transition-all ${className}`}
    >
      <IconComponent className={`w-5 h-5 ${current.iconColor} stroke-[1.5] shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && <span className="font-semibold text-text mr-2">{title}</span>}
        <span className="font-normal text-text leading-relaxed">{children}</span>
      </div>
      {action && <div className="shrink-0 ml-2">{action}</div>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="text-text-secondary hover:text-text p-0.5 rounded-control transition-colors shrink-0 ml-1"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      )}
    </div>
  );
};

