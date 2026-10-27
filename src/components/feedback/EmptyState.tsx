import React from 'react';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-strong rounded bg-bg-subtle/50">
      {icon && <div className="text-text-muted mb-3">{icon}</div>}
      {title && <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">{title}</h3>}
      <p className="text-sm text-text-muted max-w-md mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
