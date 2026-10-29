import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface FlashbarItem {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  header?: string;
  content: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

export interface FlashbarProps {
  items: FlashbarItem[];
  className?: string;
}

export const Flashbar: React.FC<FlashbarProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  const typeConfigs = {
    success: {
      bg: 'bg-positive-tint',
      border: 'border-positive/30',
      icon: <CheckCircle2 className="w-5 h-5 text-positive stroke-[1.5] shrink-0" />,
    },
    error: {
      bg: 'bg-negative-tint',
      border: 'border-negative/30',
      icon: <AlertCircle className="w-5 h-5 text-negative stroke-[1.5] shrink-0" />,
    },
    warning: {
      bg: 'bg-critical-tint',
      border: 'border-critical/30',
      icon: <AlertTriangle className="w-5 h-5 text-critical stroke-[1.5] shrink-0" />,
    },
    info: {
      bg: 'bg-informative-tint',
      border: 'border-accent/30',
      icon: <Info className="w-5 h-5 text-accent stroke-[1.5] shrink-0" />,
    },
  };

  return (
    <div role="region" aria-label="Notifications" className={`space-y-2 mb-4 ${className}`}>
      {items.map((item) => {
        const config = typeConfigs[item.type || 'info'];

        return (
          <div
            key={item.id}
            role="status"
            className={`border rounded-control p-3.5 flex items-start gap-3 select-none ${config.bg} ${config.border}`}
          >
            {config.icon}

            <div className="flex-1 min-w-0 text-sm text-text">
              {item.header && (
                <div className="font-semibold text-text mb-0.5">
                  {item.header}
                </div>
              )}
              <div className="font-normal text-text leading-relaxed">
                {item.content}
              </div>
            </div>

            {item.action && (
              <div className="shrink-0 ml-3">{item.action}</div>
            )}

            {item.dismissible && item.onDismiss && (
              <button
                type="button"
                onClick={() => item.onDismiss?.(item.id)}
                className="text-text-secondary hover:text-text p-1 rounded-control transition-colors ml-2"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
