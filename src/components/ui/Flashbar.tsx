import React from 'react';
import { AlertCircle } from 'lucide-react';
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
      className={`w-full bg-negative-tint border-b border-negative px-8 py-3 flex items-center justify-between gap-4 select-none ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <AlertCircle className="w-5 h-5 text-negative shrink-0 stroke-[1.5]" />
        <div className="text-sm text-text font-semibold truncate">
          {count > 1 ? (
            <span className="tabular-nums">
              <span className="font-semibold text-negative">{count} SOS alerts</span> need acknowledgement
              (most recent: {activeAlert.seniorName}, {activeAlert.chapter} ·{' '}
              <span className="tabular-nums text-negative">{formatElapsed(activeAlert.elapsedSeconds)}</span> ago)
            </span>
          ) : (
            <span>
              <span className="font-semibold text-negative">Critical emergency:</span> SOS from{' '}
              <span className="font-semibold text-text">{activeAlert.seniorName}</span>, {activeAlert.chapter} ·{' '}
              <span className="tabular-nums text-negative font-semibold">
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
