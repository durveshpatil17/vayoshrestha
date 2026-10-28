import React from 'react';
import { AlertUrgent16Filled } from '@fluentui/react-icons';
import { Button } from './Button';

export interface SosAlertItem {
  id: string;
  seniorName: string;
  chapter: string;
  elapsedSeconds: number;
}

export interface FlashbarProps {
  alerts: SosAlertItem[];
  onAcknowledge: (id: string) => void;
  onViewCase: (id: string) => void;
  className?: string;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const Flashbar: React.FC<FlashbarProps> = ({
  alerts,
  onAcknowledge,
  onViewCase,
  className = '',
}) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const activeAlert = alerts[0];
  const count = alerts.length;

  return (
    <div
      role="alert"
      className={`w-full bg-negative-tint border-b border-negative px-6 py-2 flex items-center justify-between gap-4 transition-all duration-dur ease-in-out ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-5 h-5 rounded-full bg-negative text-white flex items-center justify-center shrink-0">
          <AlertUrgent16Filled className="w-3.5 h-3.5 text-white" />
        </span>
        <div className="text-sm text-text font-medium truncate">
          {count > 1 ? (
            <span className="tabular-nums">
              <span className="font-semibold text-negative">{count} SOS alerts</span> need acknowledgement
              (most recent: {activeAlert.seniorName}, {activeAlert.chapter} ·{' '}
              <span className="tabular-nums font-mono text-negative">{formatElapsed(activeAlert.elapsedSeconds)}</span> ago)
            </span>
          ) : (
            <span>
              <span className="font-semibold text-negative">Critical SOS:</span> SOS from{' '}
              <span className="font-semibold text-text">{activeAlert.seniorName}</span>, {activeAlert.chapter} ·{' '}
              <span className="tabular-nums font-mono text-negative font-medium">
                {formatElapsed(activeAlert.elapsedSeconds)}
              </span>{' '}
              ago
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewCase(activeAlert.id)}
        >
          View case
        </Button>
        <Button
          variant="destructive-confirm"
          size="sm"
          onClick={() => onAcknowledge(activeAlert.id)}
        >
          Acknowledge
        </Button>
      </div>
    </div>
  );
};

