import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`py-8 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto select-none ${className}`}
    >
      <AlertCircle className="w-8 h-8 text-negative stroke-[1.5] mb-3" />
      <h3 className="text-card-title text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-normal">
        {message}
      </p>
      {onRetry && (
        <Button variant="default" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};
