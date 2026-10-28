import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import {
  CheckmarkCircle16Regular,
  Warning16Regular,
  ErrorCircle16Regular,
  Info16Regular,
  Dismiss12Regular,
} from '@fluentui/react-icons';

export type ToastType = 'positive' | 'critical' | 'negative' | 'information';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  undoLabel?: string;
  onUndo?: () => void;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${nextId.current++}`;
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType = 'information') => {
    switch (type) {
      case 'positive':
        return <CheckmarkCircle16Regular className="text-positive shrink-0" />;
      case 'critical':
        return <Warning16Regular className="text-critical shrink-0" />;
      case 'negative':
        return <ErrorCircle16Regular className="text-negative shrink-0" />;
      case 'information':
      default:
        return <Info16Regular className="text-accent shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="down">
        {children}

        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            duration={toast.duration || 5000}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
            className="bg-surface border border-border rounded-control shadow-menu px-4 py-2.5 flex items-center gap-3 text-sm text-text data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-bottom duration-dur"
          >
            {getIcon(toast.type)}
            <RadixToast.Description className="flex-1 text-sm text-text font-normal">
              {toast.message}
            </RadixToast.Description>

            {toast.onUndo && (
              <RadixToast.Action asChild altText={toast.undoLabel || 'Undo'}>
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="text-xs font-semibold text-accent hover:underline focus:outline-none"
                >
                  {toast.undoLabel || 'Undo'}
                </button>
              </RadixToast.Action>
            )}

            <RadixToast.Close asChild>
              <button
                type="button"
                className="text-text-tertiary hover:text-text p-0.5 rounded focus:outline-none"
                aria-label="Close notification"
              >
                <Dismiss12Regular />
              </button>
            </RadixToast.Close>
          </RadixToast.Root>
        ))}

        <RadixToast.Viewport className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-auto max-w-md z-50 pointer-events-none [&>*]:pointer-events-auto" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};

