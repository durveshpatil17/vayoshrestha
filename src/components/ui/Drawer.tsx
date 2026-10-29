import React, { useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // default 480px
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  width = 'w-[480px]',
  className = '',
}) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-text/40 z-50 transition-opacity duration-dur animate-in fade-in" />
        <RadixDialog.Content
          className={`fixed inset-y-0 right-0 z-50 ${width} max-w-full bg-surface border-l border-border shadow-dialog flex flex-col focus:outline-none animate-in slide-in-from-right duration-dur ease-in-out ${className}`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border-subtle flex items-start justify-between gap-3 shrink-0">
            <div className="min-w-0">
              {title && (
                <RadixDialog.Title className="text-section-title text-text truncate">
                  {title}
                </RadixDialog.Title>
              )}
              {subtitle && (
                <p className="text-caption text-text-secondary mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <RadixDialog.Close asChild>
              <button
                type="button"
                className="text-text-tertiary hover:text-text rounded-control p-1 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </RadixDialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-border-subtle bg-surface-subtle shrink-0 flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

