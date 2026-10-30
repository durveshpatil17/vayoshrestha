import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  WORKSPACES,
  getPermittedWorkspaces,
  WorkspaceDefinition,
  WorkspaceApp,
} from '@/navigation/workspaces';
import { Search, ChevronRight, ExternalLink, LayoutGrid, Check } from 'lucide-react';

export const AppFinderPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [selectedWs, setSelectedWs] = useState<string>('all');

  const permitted = getPermittedWorkspaces(user?.role || 'RA');

  // Filter workspaces and apps
  const filteredWorkspaces = permitted
    .filter((ws) => selectedWs === 'all' || ws.id === selectedWs)
    .map((ws) => {
      const apps = ws.apps.filter((app) => {
        if (app.requiredRoles && !app.requiredRoles.includes(user?.role || 'RA')) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          ws.name.toLowerCase().includes(q)
        );
      });
      return { ...ws, apps };
    })
    .filter((ws) => ws.apps.length > 0);

  const totalAppsCount = filteredWorkspaces.reduce((acc, ws) => acc + ws.apps.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-container p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-container bg-accent-tint text-accent border border-accent/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text">App Finder</h1>
            <p className="text-xs text-text-secondary">
              Browse all permitted applications across {permitted.length} workspaces in the ecosystem
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5 stroke-[1.5]" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-9 pr-3 rounded-control bg-page border border-border text-xs text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Filter Tabs by Workspace */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedWs('all')}
          className={`h-7 px-3 rounded-control text-xs whitespace-nowrap transition-colors ${
            selectedWs === 'all'
              ? 'bg-accent text-white font-semibold'
              : 'bg-surface border border-border text-text-secondary hover:text-text'
          }`}
        >
          All Workspaces
        </button>
        {permitted.map((ws) => (
          <button
            key={ws.id}
            type="button"
            onClick={() => setSelectedWs(ws.id)}
            className={`h-7 px-3 rounded-control text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedWs === ws.id
                ? 'bg-accent text-white font-semibold'
                : 'bg-surface border border-border text-text-secondary hover:text-text'
            }`}
          >
            <ws.icon className="w-3 h-3 stroke-[1.5]" />
            <span>{ws.name}</span>
          </button>
        ))}
      </div>

      {/* Workspaces & Apps Grid */}
      <div className="space-y-8">
        {filteredWorkspaces.map((ws) => (
          <div key={ws.id} className="space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center gap-2">
                <ws.icon className="w-4 h-4 text-accent stroke-[1.5]" />
                <h2 className="text-sm font-semibold text-text">
                  {ws.name}
                </h2>
                <span className="text-xs text-text-secondary">({ws.apps.length} apps)</span>
              </div>
              <Link
                to={`/w/${ws.id}`}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Workspace overview</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ws.apps.map((app) => (
                <Link
                  key={app.id}
                  to={app.path}
                  className="bg-surface border border-border hover:border-accent rounded-container p-4 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-control bg-surface-subtle text-text group-hover:text-accent group-hover:bg-accent-tint transition-colors border border-border shrink-0">
                      <app.icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
                    <span>{app.group}</span>
                    <span className="text-accent group-hover:underline">Launch app</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredWorkspaces.length === 0 && (
          <div className="bg-surface border border-border rounded-container p-12 text-center">
            <p className="text-sm text-text-secondary">No applications match your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
