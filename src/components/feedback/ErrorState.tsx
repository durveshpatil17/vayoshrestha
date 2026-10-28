import React from 'react';
import { ErrorCircle24Regular } from '@fluentui/react-icons';
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
      <div className="w-10 h-10 rounded-full bg-negative-tint border border-negative/20 flex items-center justify-center text-negative mb-3">
        <ErrorCircle24Regular className="w-6 h-6" />
      </div>
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
