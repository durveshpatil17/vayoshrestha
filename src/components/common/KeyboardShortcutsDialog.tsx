import React, { useEffect } from 'react';
import { X, Command, Navigation, Sliders, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  icon: React.FC<{ className?: string }>;
  shortcuts: ShortcutItem[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Navigation shortcuts',
    icon: Navigation,
    shortcuts: [
      { keys: ['G', 'H'], description: 'Go to home launchpad' },
      { keys: ['G', 'I'], description: 'Go to task inbox' },
      { keys: ['G', 'S'], description: 'Go to emergency SOS board' },
      { keys: ['G', 'M'], description: 'Go to my work queue' },
      { keys: ['G', 'A'], description: 'Go to all applications directory' },
    ],
  },
  {
    title: 'System shortcuts',
    icon: Command,
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette and global search' },
      { keys: ['Ctrl', 'Shift', 'D'], description: 'Open CSR demo director drawer' },
      { keys: ['?'], description: 'Open keyboard shortcuts reference' },
      { keys: ['Esc'], description: 'Close active modal, popover, or drawer' },
    ],
  },
  {
    title: 'Operational actions',
    icon: Sliders,
    shortcuts: [
      { keys: ['Alt', 'N'], description: 'Register new senior' },
      { keys: ['Alt', 'S'], description: 'Trigger emergency SOS drill' },
      { keys: ['Alt', 'B'], description: 'Broadcast announcement' },
    ],
  },
];

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface border border-border rounded-container shadow-overlay overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-accent-tint text-accent flex items-center justify-center">
              <Keyboard className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 id="keyboard-shortcuts-title" className="text-sm font-semibold text-text">
                Keyboard shortcuts
              </h2>
              <span className="text-xs text-text-secondary">System-wide accelerator keys</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-secondary hover:text-text hover:bg-surface-subtle"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-96 overflow-y-auto text-xs">
          {SHORTCUT_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-text">
                <section.icon className="w-3.5 h-3.5 text-accent stroke-[1.5]" />
                <span>{section.title}</span>
              </div>
              <div className="bg-surface-subtle border border-border rounded-control divide-y divide-border-subtle">
                {section.shortcuts.map((sc, sIdx) => (
                  <div key={sIdx} className="px-3 py-2 flex items-center justify-between">
                    <span className="text-text-secondary">{sc.description}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs text-text font-semibold tabular-nums"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-surface-subtle flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Press <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-xs font-semibold tabular-nums">?</kbd> anytime to open this guide
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

