import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg'; // sm = 480px (confirm), md = 640px (forms), lg = 800px
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  className = '',
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'max-w-[480px]',
    md: 'max-w-[640px]',
    lg: 'max-w-[800px]',
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-text/40 z-50 backdrop-filter-none transition-opacity duration-dur animate-in fade-in" />
        <RadixDialog.Content
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeClasses[size]} bg-surface rounded-card shadow-dialog border border-border z-50 p-6 focus:outline-none animate-in fade-in zoom-in-95 duration-dur ${className}`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              {title && (
                <RadixDialog.Title className="text-section-title text-text">
                  {title}
                </RadixDialog.Title>
              )}
              {description && (
                <RadixDialog.Description className="text-caption text-text-secondary mt-1">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <button
                type="button"
                className="text-text-tertiary hover:text-text rounded-control p-1 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </RadixDialog.Close>
          </div>

          <div>{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

