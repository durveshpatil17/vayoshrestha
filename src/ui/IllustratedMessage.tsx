import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface IllustratedMessageProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const IllustratedMessage: React.FC<IllustratedMessageProps> = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto select-none ${className}`}
    >
      <div className="text-text-secondary mb-3 flex items-center justify-center">
        {icon || <FolderOpen className="w-10 h-10 stroke-[1.5]" />}
      </div>
      <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-normal">
        {description}
      </p>
      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button variant="default" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

