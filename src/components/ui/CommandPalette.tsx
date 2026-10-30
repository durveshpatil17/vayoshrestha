import React, { useState, useEffect, useMemo } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { getPermittedWorkspaces, WorkspaceApp } from '@/navigation/workspaces';
import { RoleCode, ROLES } from '@/permissions/matrix';
import {
  Search,
  User,
  AlertTriangle,
  LayoutGrid,
  Zap,
  Volume2,
  Type,
  Building2,
  FileDown,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'apps' | 'records' | 'actions'>('all');
  const navigate = useNavigate();

  const {
    user,
    textSize,
    setTextSize,
    chimeEnabled,
    toggleChime,
    switchPersona,
    setActiveChapter,
  } = useAuthStore();

  const role = user?.role || 'RA';
  const permittedWorkspaces = useMemo(() => getPermittedWorkspaces(role), [role]);
  const storeData = mockStore.getData();

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

  // 1. Index 100% of apps across permitted workspaces
  const appItems = useMemo(() => {
    const items: {
      id: string;
      title: string;
      description: string;
      path: string;
      category: 'apps';
      workspace: string;
      icon: any;
    }[] = [];

    permittedWorkspaces.forEach((ws) => {
      ws.apps.forEach((app) => {
        if (!app.requiredRoles || app.requiredRoles.includes(role)) {
          items.push({
            id: `app-${app.id}`,
            title: app.name,
            description: `${ws.name} · ${app.description}`,
            path: app.path,
            category: 'apps',
            workspace: ws.name,
            icon: app.icon,
          });
        }
      });
    });

    return items;
  }, [permittedWorkspaces, role]);

  // 2. Recent records (Seniors, Cases, Chapters)
  const recordItems = useMemo(() => {
    const seniors = storeData.seniorCitizens.slice(0, 10).map((s) => ({
      id: `senior-${s.id}`,
      title: s.fullName,
      description: `Senior ID: ${s.id} · Age ${s.age || '60+'} · ${s.phone || s.phoneNumber || 'Contact registered'}`,
      path: `/seniors/${s.id}`,
      category: 'records' as const,
      workspace: 'Seniors',
      icon: User,
    }));

    const cases = storeData.sosEvents.slice(0, 5).map((c) => ({
      id: `case-${c.id}`,
      title: `Emergency Case ${c.id}`,
      description: `Status: ${c.status} · Senior: ${c.seniorId}`,
      path: `/sos/cases`,
      category: 'records' as const,
      workspace: 'Emergency',
      icon: AlertTriangle,
    }));

    const chapters = storeData.chapters.slice(0, 5).map((ch) => ({
      id: `chap-${ch.id}`,
      title: ch.name,
      description: `Chapter (Ekta Hub) · Region ${ch.regionId}`,
      path: `/admin/chapters`,
      category: 'records' as const,
      workspace: 'Administration',
      icon: Building2,
    }));

    return [...seniors, ...cases, ...chapters];
  }, [storeData]);

  // 3. Executable actions
  const actionItems = useMemo(() => {
    return [
      {
        id: 'action-drill',
        title: 'Trigger disaster emergency drill',
        description: 'Simulate life-safety alert response protocol',
        action: () => navigate('/sos/cases?tab=drills'),
        category: 'actions' as const,
        workspace: 'Emergency',
        icon: AlertTriangle,
      },
      {
        id: 'action-onboard',
        title: 'New senior intake wizard',
        description: 'Register and onboard a senior citizen member',
        action: () => navigate('/onboarding'),
        category: 'actions' as const,
        workspace: 'Seniors',
        icon: User,
      },
      {
        id: 'action-export',
        title: 'Run verified impact pack export',
        description: 'Generate tamper-evident SHA-256 telemetry summary',
        action: () => navigate('/telemetry/packs'),
        category: 'actions' as const,
        workspace: 'Insights',
        icon: FileDown,
      },
      {
        id: 'action-text-size',
        title: `Toggle text size (current: ${textSize})`,
        description: 'Cycle interface density between normal, large, and xlarge',
        action: () => {
          const next = textSize === 'normal' ? 'large' : textSize === 'large' ? 'xlarge' : 'normal';
          setTextSize(next);
        },
        category: 'actions' as const,
        workspace: 'Preferences',
        icon: Type,
      },
      {
        id: 'action-chime',
        title: `Toggle SOS audio chime (${chimeEnabled ? 'Enabled' : 'Muted'})`,
        description: 'Turn life-safety alert chime sound on or off',
        action: () => toggleChime(),
        category: 'actions' as const,
        workspace: 'Preferences',
        icon: Volume2,
      },
      {
        id: 'action-switch-chapter',
        title: 'Switch active chapter scope',
        description: 'Filter operational view to another Ekta Hub',
        action: () => {
          const nextChap = storeData.chapters[1] || storeData.chapters[0];
          if (nextChap) setActiveChapter(nextChap.id);
        },
        category: 'actions' as const,
        workspace: 'Administration',
        icon: Building2,
      },
      {
        id: 'action-switch-persona',
        title: 'Switch user persona',
        description: 'Rotate testing persona (e.g. to Programme Manager or Field Associate)',
        action: () => {
          const nextRole: RoleCode = role === 'RA' ? 'PM' : role === 'PM' ? 'CM' : 'RA';
          switchPersona(nextRole);
        },
        category: 'actions' as const,
        workspace: 'Administration',
        icon: Shield,
      },
    ];
  }, [navigate, textSize, setTextSize, chimeEnabled, toggleChime, storeData.chapters, setActiveChapter, role, switchPersona]);

  // Combined searchable index
  const allItems = useMemo(() => {
    return [
      ...actionItems,
      ...appItems,
      ...recordItems,
    ];
  }, [actionItems, appItems, recordItems]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.workspace.toLowerCase().includes(q)
      );
    });
  }, [allItems, activeCategory, query]);

  const handleSelect = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onOpenChange(false);
    setQuery('');
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-text/40 z-50 transition-opacity animate-in fade-in" />
        <RadixDialog.Content className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-xl bg-surface rounded-container shadow-overlay border border-border z-50 overflow-hidden focus:outline-none animate-in fade-in zoom-in-95">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-border h-12 gap-3">
            <Search className="w-4 h-4 text-text-secondary shrink-0 stroke-[1.5]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps, seniors, cases, or actions... (Ctrl+K)"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary focus:outline-none"
              autoFocus
            />
            <kbd className="px-1.5 py-0.5 text-xs bg-surface-subtle border border-border rounded-control text-text-secondary">
              ESC
            </kbd>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-border-subtle bg-surface-subtle flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-control transition-colors ${
                activeCategory === 'all'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('actions')}
              className={`px-2.5 py-1 rounded-control transition-colors ${
                activeCategory === 'actions'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Actions ({actionItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('apps')}
              className={`px-2.5 py-1 rounded-control transition-colors ${
                activeCategory === 'apps'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Apps ({appItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('records')}
              className={`px-2.5 py-1 rounded-control transition-colors ${
                activeCategory === 'records'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Records ({recordItems.length})
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-secondary">
                No matching apps, records, or actions found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full p-2 flex items-center justify-between rounded-control text-left hover:bg-surface-hover focus:bg-surface-selected focus:outline-none transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-control bg-surface-subtle text-accent border border-border shrink-0">
                      <item.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-text group-hover:text-accent transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-text-secondary truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-text-secondary px-2 py-0.5 rounded-full bg-surface-subtle border border-border">
                      {item.workspace}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))
            )}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
