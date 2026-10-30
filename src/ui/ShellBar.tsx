import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { RoleCode, ROLES } from '@/permissions/matrix';
import {
  Bell,
  HelpCircle,
  Search,
  Building2,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  AlertTriangle,
  Volume2,
  VolumeX,
  LayoutGrid,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { CommandPalette } from '@/components/ui/CommandPalette';
import {
  getPrimaryWorkspaces,
  getPermittedWorkspaces,
  findWorkspaceForPath,
  WorkspaceDefinition,
} from '@/navigation/workspaces';

export const ShellBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    activeChapterId,
    setActiveChapter,
    switchPersona,
    logout,
    chimeEnabled,
    toggleChime,
    openSosCount,
    setOpenSosCount,
  } = useAuthStore();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false);
  const [workspacesMenuOpen, setWorkspacesMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [hoveredWsId, setHoveredWsId] = useState<string | null>(null);

  const chapters = mockStore.getData().chapters;
  const role = user?.role || 'RA';

  const primaryWorkspaces = getPrimaryWorkspaces(role);
  const permittedWorkspaces = getPermittedWorkspaces(role);
  const currentWorkspaceId = findWorkspaceForPath(location.pathname);
  const effectiveHoveredWsId =
    hoveredWsId ||
    currentWorkspaceId ||
    (permittedWorkspaces[0] ? permittedWorkspaces[0].id : null);
  const activeFlyoutWs =
    permittedWorkspaces.find((w) => w.id === effectiveHoveredWsId) || permittedWorkspaces[0];

  // Real-time SOS count monitoring
  useEffect(() => {
    const updateCount = () => {
      const active = mockStore
        .getData()
        .sosEvents.filter((e) => e.status === 'Triggered' || e.status === 'Acknowledged');
      setOpenSosCount(active.length);
    };

    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, [setOpenSosCount]);

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const quickCreateActions = [
    { label: 'Register senior', path: '/onboarding', roleFilter: ['RA', 'PM', 'CM', 'VF', 'CT', 'SA'] },
    { label: 'Trigger emergency SOS', path: '/sos', roleFilter: ['RA', 'PM', 'CM', 'VF', 'CT', 'CD', 'SP', 'SA'] },
    { label: 'Create programme', path: '/programmes/new', roleFilter: ['PM', 'CM', 'VF', 'RA', 'SA'] },
    { label: 'Issue support voucher', path: '/vouchers/issue', roleFilter: ['CM', 'PM', 'RA', 'SA'] },
    { label: 'Broadcast announcement', path: '/communication/announcements/new', roleFilter: ['CM', 'PM', 'RA', 'SA'] },
    { label: 'Record complaint', path: '/complaints/new', roleFilter: ['RA', 'PM', 'CM', 'VF', 'CT', 'CD', 'SP', 'SA'] },
  ].filter((action) => action.roleFilter.includes(role));

  return (
    <>
      <header
        role="banner"
        className="h-13 bg-surface border-b border-border px-4 lg:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-30"
      >
        {/* Left: Brand + Workspaces Menu + Quick Create */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-baseline gap-2 shrink-0 group mr-1"
          >
            <span className="text-base font-semibold text-text group-hover:text-accent transition-colors">
              Vayoshrestha
            </span>
            <span className="text-xs text-text-secondary font-normal hidden sm:inline">
              Vayoh Vikas
            </span>
          </div>

          {/* Workspaces Popover Button */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setWorkspacesMenuOpen(!workspacesMenuOpen);
                setCreateMenuOpen(false);
                setScopeMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-control border text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                workspacesMenuOpen
                  ? 'bg-accent-tint text-accent border-accent/40 font-semibold'
                  : 'bg-surface border-border text-text hover:bg-surface-hover'
              }`}
              title="All workspaces and applications"
              aria-label="All workspaces"
            >
              <LayoutGrid className="w-4 h-4 stroke-[1.5] text-accent" />
              <span className="font-semibold text-xs">Workspaces</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
            </button>

            {workspacesMenuOpen && (
              <div className="absolute left-0 top-9 flex bg-surface border border-border rounded-control shadow-overlay z-40 animate-in fade-in-0 duration-150 overflow-hidden">
                {/* Left Column: Workspaces list with expansion arrows on hover */}
                <div className="w-64 p-2 border-r border-border-subtle flex flex-col justify-between shrink-0">
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-text-secondary border-b border-border-subtle mb-1 flex items-center justify-between">
                      <span>Permitted Workspaces ({permittedWorkspaces.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setWorkspacesMenuOpen(false);
                          navigate('/apps');
                        }}
                        className="text-accent hover:underline text-xs flex items-center gap-1"
                      >
                        <span>App Finder</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-1">
                      {permittedWorkspaces.map((ws) => (
                        <button
                          key={ws.id}
                          type="button"
                          onMouseEnter={() => setHoveredWsId(ws.id)}
                          onClick={() => {
                            setWorkspacesMenuOpen(false);
                            navigate(`/w/${ws.id}`);
                          }}
                          className={`w-full text-left p-2 rounded-control hover:bg-surface-hover flex items-center justify-between gap-2 transition-colors group ${
                            effectiveHoveredWsId === ws.id ? 'bg-accent-tint text-accent' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div className="p-1.5 rounded-control bg-surface-subtle text-accent mt-0.5 border border-border shrink-0">
                              <ws.icon className="w-3.5 h-3.5 stroke-[1.5]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-text truncate">
                                {ws.name}
                              </div>
                              <div className="text-xs text-text-secondary line-clamp-1">
                                {ws.purpose}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-all ${
                              effectiveHoveredWsId === ws.id
                                ? 'opacity-100 text-accent translate-x-0.5'
                                : 'opacity-0 group-hover:opacity-100 text-text-secondary group-hover:translate-x-0.5'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Hovered Workspace Options & Applications Flyout */}
                {activeFlyoutWs && (
                  <div className="w-72 p-3 bg-surface-subtle/30 flex flex-col justify-between max-h-96 overflow-y-auto shrink-0 animate-in fade-in-0 duration-100">
                    <div className="space-y-3">
                      <div className="pb-2 border-b border-border-subtle flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-text">
                            {activeFlyoutWs.name} Apps
                          </div>
                          <div className="text-xs text-text-secondary">
                            {activeFlyoutWs.apps.length} available applications
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkspacesMenuOpen(false);
                            navigate(`/w/${activeFlyoutWs.id}`);
                          }}
                          className="text-xs text-accent font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <span>Overview</span>
                          <ChevronRight className="w-3 h-3 stroke-[1.5]" />
                        </button>
                      </div>

                      {/* App options list */}
                      <div className="space-y-1">
                        {activeFlyoutWs.apps.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setWorkspacesMenuOpen(false);
                              navigate(app.path);
                            }}
                            className="w-full text-left p-2 rounded-control hover:bg-surface border border-transparent hover:border-border transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <app.icon className="w-3.5 h-3.5 text-accent stroke-[1.5] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-text truncate">
                                  {app.name}
                                </div>
                                <div className="text-xs text-text-secondary truncate">
                                  {app.description}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-accent transition-all shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border-subtle mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWorkspacesMenuOpen(false);
                          navigate(`/w/${activeFlyoutWs.id}`);
                        }}
                        className="w-full h-8 rounded-control bg-accent text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-accent-hover transition-colors"
                      >
                        <span>Launch {activeFlyoutWs.name} Workspace</span>
                        <ChevronRight className="w-3 h-3 stroke-[2]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Create Action Button */}
          {quickCreateActions.length > 0 && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(!createMenuOpen);
                  setWorkspacesMenuOpen(false);
                  setScopeMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className={`h-8 px-2.5 rounded-control border text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  createMenuOpen
                    ? 'bg-accent text-white border-accent font-semibold'
                    : 'bg-surface border-border text-text hover:bg-surface-hover'
                }`}
                aria-label="Create new item"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2]" />
                <span className="font-semibold text-xs">Create</span>
              </button>

              {createMenuOpen && (
                <div className="absolute left-0 top-9 w-56 bg-surface border border-border rounded-control shadow-overlay py-1 z-40 animate-in fade-in-0 duration-150">
                  <div className="px-3 py-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle">
                    Quick actions
                  </div>
                  {quickCreateActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCreateMenuOpen(false);
                        navigate(action.path);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-text hover:bg-surface-hover flex items-center justify-between"
                    >
                      <span>{action.label}</span>
                      <ChevronDown className="w-3 h-3 text-text-secondary -rotate-90 stroke-[1.5]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ultra-wide quick tabs on 2xl displays (>= 1536px, max 3) */}
          <div className="hidden 2xl:flex items-center gap-1 pl-2 border-l border-border">
            {primaryWorkspaces.slice(0, 3).map((ws) => {
              const isActive = currentWorkspaceId === ws.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => navigate(`/w/${ws.id}`)}
                  className={`h-8 px-2.5 rounded-control text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-accent-tint text-accent font-semibold border border-accent/30'
                      : 'text-text-secondary hover:text-text hover:bg-surface-hover'
                  }`}
                >
                  <ws.icon className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span className="truncate max-w-24">{ws.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Global Search Bar with Ctrl K hint */}
        <div className="flex-1 max-w-md mx-4 min-w-0 hidden sm:block">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-8 px-3 rounded-control bg-page border border-border hover:border-accent text-xs text-text-secondary flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Search className="w-4 h-4 text-text-secondary stroke-[1.5] shrink-0" />
              <span className="truncate">Search seniors, emergency alerts, apps...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded-control bg-surface border border-border text-xs text-text-secondary tabular-nums shrink-0 ml-2">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Scope Switcher + SOS status chip + Alerts + Help + User profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Scope Switcher Dropdown */}
          <div className="relative shrink-0 hidden md:block">
            <button
              type="button"
              onClick={() => {
                setScopeMenuOpen(!scopeMenuOpen);
                setWorkspacesMenuOpen(false);
                setCreateMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-control border text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                scopeMenuOpen
                  ? 'bg-accent-tint text-accent border-accent/40 font-semibold'
                  : 'bg-surface border-border text-text hover:bg-surface-hover'
              }`}
              title="Assigned Chapter (Ekta Hub)"
            >
              <Building2 className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
              <span className="font-semibold text-text max-w-32 truncate">
                {activeChapter ? activeChapter.name : 'All chapters'}
              </span>
              <ChevronDown className="w-3 h-3 text-text-secondary stroke-[1.5]" />
            </button>

            {scopeMenuOpen && (
              <div className="absolute right-0 top-9 w-64 bg-surface border border-border rounded-control shadow-overlay py-1 z-40 animate-in fade-in-0 duration-150">
                <div className="px-3 py-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle">
                  Assigned Chapter (Ekta Hub)
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {chapters.map((chap) => (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => {
                        setActiveChapter(chap.id);
                        setScopeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-surface-hover ${
                        activeChapterId === chap.id
                          ? 'text-accent font-semibold bg-accent-tint'
                          : 'text-text'
                      }`}
                    >
                      <span className="truncate">{chap.name}</span>
                      <span className="text-text-secondary text-xs tabular-nums">
                        {chap.regionId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* SOS Status Chip */}
          <button
            type="button"
            onClick={() => navigate('/sos')}
            className={`h-8 px-2.5 lg:px-3 rounded-control text-xs flex items-center gap-2 transition-colors ${
              openSosCount > 0
                ? 'bg-negative text-white font-semibold hover:opacity-95'
                : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:text-text'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 stroke-[1.5] ${openSosCount > 0 ? 'text-white' : 'text-text-secondary'}`}
            />
            <span className="tabular-nums">
              {openSosCount > 0 ? `${openSosCount} open SOS` : '0 open SOS'}
            </span>
          </button>

          {/* Notifications Link */}
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text-secondary hover:text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline">Alerts</span>
          </button>

          {/* Help Link */}
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text-secondary hover:text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
            title="Operational manuals and SOPs"
          >
            <HelpCircle className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden xl:inline">Help</span>
          </button>

          {/* User Account Menu with Role Switcher & Chime Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setWorkspacesMenuOpen(false);
                setCreateMenuOpen(false);
                setScopeMenuOpen(false);
              }}
              className="h-8 px-2.5 rounded-control bg-surface border border-border flex items-center gap-2 hover:bg-surface-hover transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center text-xs font-semibold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-semibold text-text block truncate max-w-28">
                  {user?.fullName}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-9 w-64 bg-surface border border-border rounded-control shadow-overlay py-1 z-40 animate-in fade-in-0 duration-150">
                <div className="px-3 py-2 border-b border-border-subtle">
                  <div className="font-semibold text-xs text-text">{user?.fullName}</div>
                  <div className="text-xs text-text-secondary">{user?.email}</div>
                  <div className="text-xs text-accent font-semibold mt-0.5">
                    Role: {ROLES[user?.role || 'RA']?.name}
                  </div>
                </div>

                {/* Audio Chime Toggle in User Menu */}
                <div className="px-3 py-2 border-b border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-text">SOS audio chime</span>
                  <button
                    type="button"
                    onClick={toggleChime}
                    className={`h-7 px-2 rounded-control border text-xs flex items-center gap-1.5 transition-colors ${
                      chimeEnabled
                        ? 'bg-accent-tint text-accent border-accent/30 font-semibold'
                        : 'bg-surface text-text-secondary border-border hover:bg-surface-hover'
                    }`}
                  >
                    {chimeEnabled ? <Volume2 className="w-3.5 h-3.5 stroke-[1.5]" /> : <VolumeX className="w-3.5 h-3.5 stroke-[1.5]" />}
                    <span>{chimeEnabled ? 'Enabled' : 'Muted'}</span>
                  </button>
                </div>

                {/* Persona Switcher for Prototype Testing */}
                <div className="px-3 py-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle">
                  Switch persona:
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {(['SA', 'NM', 'RA', 'PM', 'CM', 'VF', 'CT', 'CD', 'SP', 'SC', 'FM', 'SF'] as RoleCode[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchPersona(r);
                        setUserMenuOpen(false);
                        if (r === 'SF') navigate('/field');
                        else if (r === 'SC') navigate('/me');
                        else if (r === 'FM') navigate('/family');
                        else navigate('/');
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-surface-hover ${
                        user?.role === r ? 'text-accent font-semibold bg-accent-tint' : 'text-text'
                      }`}
                    >
                      <span>{ROLES[r].name}</span>
                      <span className="text-xs text-text-secondary">{r}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-border-subtle pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/account');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Account settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/about');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>About Vayoshrestha</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-negative hover:bg-negative-tint flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
};
