import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { RoleCode, ROLES } from '@/permissions/matrix';
import {
  Bell,
  HelpCircle,
  Search,
  Building2,
  ChevronDown,
  User,
  LogOut,
  AlertTriangle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CommandPalette } from '@/components/ui/CommandPalette';

export const ShellBar: React.FC = () => {
  const navigate = useNavigate();
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

  const chapters = mockStore.getData().chapters;

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

  return (
    <>
      <header
        role="banner"
        className="h-13 bg-surface border-b border-border px-6 flex items-center justify-between gap-4 select-none shrink-0 z-30"
      >
        {/* Left: Brand + Scope Switcher */}
        <div className="flex items-center gap-6 min-w-0">
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-baseline gap-2 shrink-0 group"
          >
            <span className="text-base font-semibold text-text group-hover:text-accent transition-colors">
              Vayoshreshtha
            </span>
            <span className="text-xs text-text-secondary font-normal">
              Vayoh Vikas
            </span>
          </div>

          {/* Scope Switcher Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setScopeMenuOpen(!scopeMenuOpen)}
              className="h-8 px-2.5 rounded-control bg-surface-subtle border border-border text-xs text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-4 h-4 text-text-secondary stroke-[1.5]" />
              <span className="font-semibold text-text max-w-36 truncate">
                {activeChapter ? activeChapter.name : 'All chapters'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
            </button>

            {scopeMenuOpen && (
              <div className="absolute left-0 top-9 w-60 bg-surface border border-border rounded-control shadow-overlay py-1 z-40 animate-in fade-in-0 duration-150">
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
        </div>

        {/* Center: Global Search Bar with Ctrl K hint */}
        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-8 px-3 rounded-control bg-page border border-border hover:border-accent text-xs text-text-secondary flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-text-secondary stroke-[1.5]" />
              <span>Search seniors, emergency alerts, chapters...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded-control bg-surface border border-border text-xs text-text-secondary tabular-nums">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: SOS status chip, alerts, help, user profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* SOS Status Chip */}
          <button
            type="button"
            onClick={() => navigate('/sos')}
            className={`h-8 px-3 rounded-control text-xs flex items-center gap-2 transition-colors ${
              openSosCount > 0
                ? 'bg-negative text-white font-semibold hover:opacity-95'
                : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:text-text'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 stroke-[1.5] ${openSosCount > 0 ? 'text-white' : 'text-text-secondary'}`}
            />
            <span className="tabular-nums">
              {openSosCount > 0 ? `${openSosCount} open SOS` : 'No open emergencies'}
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
            <span className="hidden lg:inline">Alerts</span>
          </button>

          {/* Help Link */}
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text-secondary hover:text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
            title="Operational manuals and SOPs"
          >
            <HelpCircle className="w-4 h-4 stroke-[1.5]" />
            <span className="hidden lg:inline">Help</span>
          </button>

          {/* User Account Menu with Role Switcher & Chime Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="h-8 px-2.5 rounded-control bg-surface border border-border flex items-center gap-2 hover:bg-surface-hover transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-surface-subtle text-text-secondary border border-border flex items-center justify-center text-xs font-semibold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-semibold text-text block truncate max-w-32">
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
