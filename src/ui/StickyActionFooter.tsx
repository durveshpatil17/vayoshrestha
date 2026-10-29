import React from 'react';
import { Button } from '@/components/ui/Button';

export interface StickyActionFooterProps {
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isPrimaryDisabled?: boolean;
  isPrimaryLoading?: boolean;
  leftContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const StickyActionFooter: React.FC<StickyActionFooterProps> = ({
  primaryActionLabel = 'Save changes',
  onPrimaryAction,
  secondaryActionLabel = 'Cancel',
  onSecondaryAction,
  isPrimaryDisabled = false,
  isPrimaryLoading = false,
  leftContent,
  children,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Actions footer"
      className={`sticky bottom-0 z-20 bg-surface border-t border-border px-8 py-3.5 flex items-center justify-between gap-4 -mx-8 -mb-8 mt-8 shadow-overlay ${className}`}
    >
      <div className="min-w-0 text-xs text-text-secondary">
        {leftContent}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {children ? (
          children
        ) : (
          <>
            {onSecondaryAction && (
              <Button
                variant="outline"
                size="md"
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>
            )}
            {onPrimaryAction && (
              <Button
                variant="primary"
                size="md"
                onClick={onPrimaryAction}
                disabled={isPrimaryDisabled || isPrimaryLoading}
              >
                {primaryActionLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
