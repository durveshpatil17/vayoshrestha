import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  findWorkspaceForPath,
  getPermittedWorkspaces,
  getPrimaryWorkspaces,
  WORKSPACES,
  WorkspaceId,
} from '@/navigation/workspaces';
import {
  Home,
  Inbox,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Sparkles,
  BookOpen,
  User,
  HeartPulse,
  Radio,
  FileText,
  Building2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [isRail, setIsRail] = useState(false);
  const [workExpanded, setWorkExpanded] = useState(true);
  const [monitorExpanded, setMonitorExpanded] = useState(true);
  const [configureExpanded, setConfigureExpanded] = useState(false);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);

  if (!user) return null;

  // Senior Citizen (SC) streamlined personal dashboard sidebar
  if (user.role === 'SC') {
    return (
      <aside
        data-testid="side-nav"
        aria-label="Sidebar"
        className={`${isRail ? 'w-14' : 'w-60'} bg-surface border-r border-border shrink-0 select-none flex flex-col justify-between overflow-hidden transition-all duration-200`}
      >
        <div className="p-2 space-y-1 overflow-y-auto">
          <NavLink
            to="/"
            end
            data-nav-pinned="true"
            className={({ isActive }) =>
              `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
            title="My Home"
          >
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <Home className="w-4 h-4 stroke-[1.5] shrink-0" />
              {!isRail && <span>Home</span>}
            </div>
            {!isRail && (
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
            )}
          </NavLink>
          <NavLink
            to="/inbox"
            data-nav-pinned="true"
            className={({ isActive }) =>
              `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
            title="My work"
          >
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <Inbox className="w-4 h-4 stroke-[1.5] shrink-0" />
              {!isRail && <span>My work</span>}
            </div>
            {!isRail && (
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
            )}
          </NavLink>

          <div data-nav-group="work" className="pt-2 space-y-0.5">
            {!isRail && (
              <div className="px-3 py-1 text-xs font-semibold text-text-secondary">
                My services
              </div>
            )}
            <NavLink
              to="/me/programmes"
              className={({ isActive }) =>
                `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                  isActive ? 'bg-surface-selected text-accent font-semibold' : 'text-text hover:bg-surface-hover'
                }`
              }
              title="Programmes"
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <Calendar className="w-4 h-4 stroke-[1.5] shrink-0" />
                {!isRail && <span>Programmes</span>}
              </div>
              {!isRail && (
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
              )}
            </NavLink>
            <NavLink
              to="/me/health"
              className={({ isActive }) =>
                `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                  isActive ? 'bg-surface-selected text-accent font-semibold' : 'text-text hover:bg-surface-hover'
                }`
              }
              title="Care & Vitals"
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <HeartPulse className="w-4 h-4 stroke-[1.5] shrink-0" />
                {!isRail && <span>Care & Vitals</span>}
              </div>
              {!isRail && (
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
              )}
            </NavLink>
            <NavLink
              to="/me/learning"
              className={({ isActive }) =>
                `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                  isActive ? 'bg-surface-selected text-accent font-semibold' : 'text-text hover:bg-surface-hover'
                }`
              }
              title="Learning"
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <BookOpen className="w-4 h-4 stroke-[1.5] shrink-0" />
                {!isRail && <span>Learning</span>}
              </div>
              {!isRail && (
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
              )}
            </NavLink>
            <NavLink
              to="/me/profile"
              className={({ isActive }) =>
                `group flex items-center justify-between gap-2 px-3 py-2 rounded-control text-xs transition-colors ${
                  isActive ? 'bg-surface-selected text-accent font-semibold' : 'text-text hover:bg-surface-hover'
                }`
              }
              title="My Profile"
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <User className="w-4 h-4 stroke-[1.5] shrink-0" />
                {!isRail && <span>My Profile</span>}
              </div>
              {!isRail && (
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
              )}
            </NavLink>
          </div>
        </div>

        <div className="p-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={() => setIsRail(!isRail)}
            className="w-full flex items-center justify-center p-1.5 rounded-control text-text-secondary hover:text-text hover:bg-surface-hover text-xs"
            title={isRail ? 'Expand sidebar' : 'Collapse to rail'}
          >
            {isRail ? <PanelLeftOpen className="w-4 h-4 stroke-[1.5]" /> : <PanelLeftClose className="w-4 h-4 stroke-[1.5]" />}
          </button>
        </div>
      </aside>
    );
  }

  // Permitted workspaces for current user role
  const permitted = getPermittedWorkspaces(user.role);
  const primaryList = getPrimaryWorkspaces(user.role);

  // Identify active workspace from current path
  const detectedWsId = findWorkspaceForPath(location.pathname);
  let activeWs = permitted.find((w) => w.id === detectedWsId);

  // If path doesn't map to a permitted workspace, fallback to first primary permitted workspace
  if (!activeWs) {
    activeWs = primaryList[0] || permitted[0] || WORKSPACES.seniors;
  }

  // Split apps into Work, Monitor, and Configure strictly
  const permittedApps = activeWs.apps.filter(
    (app) => !app.requiredRoles || app.requiredRoles.includes(user.role)
  );

  const workApps = permittedApps.filter((a) => a.group === 'work');
  const monitorApps = permittedApps.filter((a) => a.group === 'monitor');
  const configureApps = permittedApps.filter((a) => a.group === 'configure');

  return (
    <aside
      data-testid="side-nav"
      aria-label="Sidebar"
      className={`${
        isRail ? 'w-14' : 'w-60'
      } bg-surface border-r border-border shrink-0 select-none flex flex-col justify-between overflow-hidden transition-all duration-200`}
    >
      <div className="p-2 space-y-1 overflow-y-auto">
        {/* Pinned Home and My work links (present on every workspace) */}
        <div className="space-y-0.5 pb-2 border-b border-border-subtle">
          <NavLink
            to="/"
            end
            data-nav-pinned="true"
            className={({ isActive }) =>
              `group flex items-center justify-between gap-2 px-3 py-1.5 rounded-control text-xs transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
            title="Home"
          >
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <Home className="w-4 h-4 stroke-[1.5] shrink-0" />
              {!isRail && <span>Home</span>}
            </div>
            {!isRail && (
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
            )}
          </NavLink>
          <NavLink
            to="/inbox"
            data-nav-pinned="true"
            className={({ isActive }) =>
              `group flex items-center justify-between gap-2 px-3 py-1.5 rounded-control text-xs transition-colors ${
                isActive
                  ? 'bg-surface-selected text-accent font-semibold'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
              }`
            }
            title="My work"
          >
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <Inbox className="w-4 h-4 stroke-[1.5] shrink-0" />
              {!isRail && <span>My work</span>}
            </div>
            {!isRail && (
              <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
            )}
          </NavLink>
        </div>

        {/* Workspace Title Header with Switcher Expansion Arrow */}
        {!isRail && (
          <div className="space-y-1 pt-1 pb-1">
            <button
              type="button"
              onClick={() => setWorkspaceSwitcherOpen(!workspaceSwitcherOpen)}
              className="w-full px-3 py-1.5 flex items-center justify-between group rounded-control hover:bg-surface-hover transition-colors text-left"
              title="Change workspace options"
              aria-expanded={workspaceSwitcherOpen}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-text truncate">
                  {activeWs.name}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-secondary group-hover:text-accent transition-transform duration-150 ${
                    workspaceSwitcherOpen ? 'rotate-180 text-accent' : ''
                  }`}
                />
              </div>
              <span className="text-xs text-text-secondary tabular-nums shrink-0">
                {permittedApps.length} apps
              </span>
            </button>

            {/* Expanded Workspace Options Dropdown */}
            {workspaceSwitcherOpen && (
              <div className="px-1.5 py-1.5 bg-surface-subtle/50 rounded-control border border-border-subtle space-y-0.5 animate-in fade-in-0 duration-150">
                <div className="px-2 py-0.5 text-xs font-semibold text-text-secondary">
                  Workspaces
                </div>
                {permitted.map((ws) => (
                  <NavLink
                    key={ws.id}
                    to={`/w/${ws.id}`}
                    onClick={() => setWorkspaceSwitcherOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2 py-1 rounded-control text-xs transition-colors group ${
                        activeWs?.id === ws.id
                          ? 'bg-accent-tint text-accent font-semibold'
                          : 'text-text hover:bg-surface-hover'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <ws.icon className="w-3.5 h-3.5 text-accent stroke-[1.5] shrink-0" />
                      <span className="truncate">{ws.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1. Work Group */}
        {workApps.length > 0 && (
          <div data-nav-group="work" className="space-y-0.5">
            {!isRail ? (
              <button
                type="button"
                aria-expanded={workExpanded}
                onClick={() => setWorkExpanded(!workExpanded)}
                className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold text-text-secondary hover:text-text rounded-control hover:bg-surface-hover transition-colors group"
              >
                <span>Work</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-150 ${
                    workExpanded ? '' : '-rotate-90'
                  }`}
                />
              </button>
            ) : null}
            {workExpanded &&
              workApps.map((app) => (
                <NavLink
                  key={app.id}
                  to={app.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-2 px-3 py-1.5 rounded-control text-xs transition-colors ${
                      isActive
                        ? 'bg-surface-selected text-accent font-semibold'
                        : 'text-text hover:bg-surface-hover'
                    }`
                  }
                  title={app.name}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <app.icon className="w-4 h-4 stroke-[1.5] shrink-0" />
                    {!isRail && <span className="truncate">{app.name}</span>}
                  </div>
                  {!isRail && (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
                  )}
                </NavLink>
              ))}
          </div>
        )}

        {/* 2. Monitor Group */}
        {monitorApps.length > 0 && (
          <div data-nav-group="monitor" className="pt-2 space-y-0.5">
            {!isRail ? (
              <button
                type="button"
                aria-expanded={monitorExpanded}
                onClick={() => setMonitorExpanded(!monitorExpanded)}
                className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold text-text-secondary hover:text-text rounded-control hover:bg-surface-hover transition-colors group"
              >
                <span>Monitor</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-150 ${
                    monitorExpanded ? '' : '-rotate-90'
                  }`}
                />
              </button>
            ) : null}
            {monitorExpanded &&
              monitorApps.map((app) => (
                <NavLink
                  key={app.id}
                  to={app.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-2 px-3 py-1.5 rounded-control text-xs transition-colors ${
                      isActive
                        ? 'bg-surface-selected text-accent font-semibold'
                        : 'text-text hover:bg-surface-hover'
                    }`
                  }
                  title={app.name}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <app.icon className="w-4 h-4 stroke-[1.5] shrink-0" />
                    {!isRail && <span className="truncate">{app.name}</span>}
                  </div>
                  {!isRail && (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
                  )}
                </NavLink>
              ))}
          </div>
        )}

        {/* 3. Configure Group (Collapsed by default) */}
        {configureApps.length > 0 && (
          <div data-nav-group="configure" className="pt-2 space-y-0.5">
            {!isRail ? (
              <button
                type="button"
                aria-expanded={configureExpanded}
                onClick={() => setConfigureExpanded(!configureExpanded)}
                className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold text-text-secondary hover:text-text rounded-control hover:bg-surface-hover transition-colors group"
              >
                <span>Configure</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-150 ${
                    configureExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : null}

            {/* When collapsed, items do not render */}
            {configureExpanded &&
              configureApps.map((app) => (
                <NavLink
                  key={app.id}
                  to={app.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-2 px-3 py-1.5 rounded-control text-xs transition-colors ${
                      isActive
                        ? 'bg-surface-selected text-accent font-semibold'
                        : 'text-text hover:bg-surface-hover'
                    }`
                  }
                  title={app.name}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <app.icon className="w-4 h-4 stroke-[1.5] shrink-0" />
                    {!isRail && <span className="truncate">{app.name}</span>}
                  </div>
                  {!isRail && (
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0" />
                  )}
                </NavLink>
              ))}
          </div>
        )}
      </div>

      {/* Rail Collapse Toggle Button */}
      <div className="p-2 border-t border-border-subtle shrink-0">
        <button
          type="button"
          onClick={() => setIsRail(!isRail)}
          className="w-full flex items-center justify-center p-1.5 rounded-control text-text-secondary hover:text-text hover:bg-surface-hover text-xs transition-colors"
          title={isRail ? 'Expand sidebar' : 'Collapse to rail'}
        >
          {isRail ? (
            <PanelLeftOpen className="w-4 h-4 stroke-[1.5]" />
          ) : (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <PanelLeftClose className="w-4 h-4 stroke-[1.5]" />
              <span>Collapse sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
