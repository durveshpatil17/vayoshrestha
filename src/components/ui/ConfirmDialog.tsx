import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Input } from './Input';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  requireMatchText?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  requireMatchText,
  onConfirm,
  isLoading = false,
}) => {
  const [typedMatch, setTypedMatch] = useState('');
  const canConfirm = !requireMatchText || typedMatch.trim() === requireMatchText;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm();
    setTypedMatch('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setTypedMatch('');
        onOpenChange(next);
      }}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>

        {requireMatchText && (
          <div className="space-y-1.5 pt-2">
            <p className="text-xs text-text-secondary">
              Type <strong className="text-text font-semibold">{requireMatchText}</strong> to confirm:
            </p>
            <Input
              value={typedMatch}
              onChange={(e) => setTypedMatch(e.target.value)}
              placeholder={requireMatchText}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle">
          <Button
            variant="default"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'destructive-confirm' : 'primary'}
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
