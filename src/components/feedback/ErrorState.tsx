import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'A temporary error occurred while retrieving this record. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-danger/30 rounded bg-danger-bg/40 max-w-lg mx-auto my-8">
      <AlertCircle className="w-8 h-8 text-danger mb-3" />
      <h3 className="font-serif text-base font-semibold text-danger mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
