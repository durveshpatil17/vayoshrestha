import React from 'react';
import { DocumentFolder48Regular } from '@fluentui/react-icons';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-disabled mb-3">
        {icon || <DocumentFolder48Regular className="w-8 h-8" />}
      </div>
      <h3 className="text-card-title text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="default" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
