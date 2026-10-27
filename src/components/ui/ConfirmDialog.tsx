import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmWord?: string; // If provided, user must type this exact string
  confirmButtonLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmWord,
  confirmButtonLabel = 'Confirm Action',
  isDestructive = true,
  isLoading = false,
}) => {
  const [typedInput, setTypedInput] = useState('');

  if (!isOpen) return null;

  const isConfirmed = confirmWord ? typedInput.trim().toUpperCase() === confirmWord.toUpperCase() : true;

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirm();
    setTypedInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-base border border-border-strong rounded shadow-xl max-w-md w-full p-6 text-left">
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-border-hairline">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDestructive ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-text-primary">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-text-muted mb-4 leading-relaxed">{description}</p>

        {confirmWord && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-text-primary block mb-1">
              To proceed, please type <strong className="font-mono text-danger">{confirmWord}</strong> below:
            </label>
            <Input
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={`Type "${confirmWord}" to confirm`}
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-border-hairline">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            disabled={!isConfirmed || isLoading}
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {confirmButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
