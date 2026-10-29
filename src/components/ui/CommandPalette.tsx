import React, { useState, useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { Search, User, AlertTriangle, LayoutGrid, X } from 'lucide-react';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Handle Ctrl/Cmd + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const navigationItems = [
    { label: 'Live SOS Board', path: '/sos', category: 'Navigation', icon: <AlertTriangle className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'Seniors Directory', path: '/seniors', category: 'Navigation', icon: <User className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'Assisted Onboarding', path: '/onboarding/new', category: 'Actions', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'Health Schedules & Calls', path: '/health/schedules', category: 'Navigation', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'Pilot Reports & KPIs', path: '/reports/pilot', category: 'Navigation', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'WhatsApp Simulator', path: '/simulator', category: 'Tools', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'System Audit Logs', path: '/admin/audit-logs', category: 'Administration', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
    { label: 'Account & Density Settings', path: '/account', category: 'Preferences', icon: <LayoutGrid className="w-4 h-4 stroke-[1.5]" /> },
  ];

  const filteredItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-text/40 z-50 transition-opacity duration-dur animate-in fade-in" />
        <RadixDialog.Content className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-[560px] bg-surface rounded-card shadow-dialog border border-border z-50 overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-dur">
          <div className="flex items-center px-3.5 border-b border-border-subtle h-11 gap-2.5">
            <Search className="w-4 h-4 text-text-secondary shrink-0 stroke-[1.5]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or jump to page... (e.g. SOS, Seniors)"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-disabled focus:outline-none"
              autoFocus
            />
            <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-subtle border border-border-subtle rounded-chip text-text-tertiary">
              ESC
            </kbd>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-secondary">
                No matching pages or actions found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSelect(item.path)}
                  className="w-full h-8 px-2.5 flex items-center justify-between rounded-control text-sm text-text hover:bg-surface-hover focus:bg-surface-selected focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-text-tertiary">{item.category}</span>
                </button>
              ))
            )}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

