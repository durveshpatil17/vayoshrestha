import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { RoleCode, ROLES } from '@/permissions/matrix';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  HelpCircle,
  Search,
  Building2,
  ChevronDown,
  User,
  LogOut,
  AlertTriangle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { maskPhoneNumber } from '@/domain/masking';

export const TopBar: React.FC = () => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);

  const chapters = mockStore.getData().chapters;
  const seniorCitizens = mockStore.getData().seniorCitizens;

  // Real-time SOS count monitoring
  useEffect(() => {
    const updateCount = () => {
      const active = mockStore
        .getData()
        .sosEvents.filter((e) => e.status === 'Triggered' || e.status === 'Acknowledged');
      setOpenSosCount(active.length);
      if (active.length > 0) {
        document.title = `(🚨 ${active.length}) Vayoshrestha — Emergency SOS`;
      } else {
        document.title = 'Vayoshrestha — Digital Senior-Care Platform';
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, [setOpenSosCount]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scope switcher filtering
  const availableChapters = chapters.filter((c) => {
    if (!user) return true;
    if (user.role === 'RA') {
      return !user.assignedRegion || c.regionId === user.assignedRegion;
    }
    if (user.role === 'CM' || user.role === 'VF') {
      return user.assignedChapter ? c.id === user.assignedChapter : user.assignedCentres.includes(c.id);
    }
    return true;
  });

  const currentChapter = chapters.find((c) => c.id === activeChapterId) || availableChapters[0] || chapters[0];

  const searchResults = searchQuery.trim()
    ? seniorCitizens
        .filter((s) => {
          if (user?.role === 'CM' || user?.role === 'VF') {
            if (s.chapterId !== activeChapterId) return false;
          }
          const q = searchQuery.toLowerCase();
          return (
            s.fullName.toLowerCase().includes(q) ||
            Boolean(s.phoneNumber && s.phoneNumber.includes(q)) ||
            s.id.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  return (
    <header className="h-[56px] bg-surface border-b border-border px-8 flex items-center justify-between gap-6 z-20 shrink-0 select-none">
      {/* Left: Brand mark + Scope switcher */}
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-base font-semibold text-text tracking-normal">
            Vayoshrestha
          </span>
          <span className="text-xs text-text-secondary font-normal">
            Vayoh Vikas
          </span>
        </div>

        {/* Scope Switcher dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setChapterMenuOpen(!chapterMenuOpen)}
            className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text flex items-center gap-2 hover:bg-surface-hover transition-colors"
          >
            <Building2 className="w-4 h-4 text-text-secondary stroke-[1.5]" />
            <span className="font-semibold text-text max-w-[150px] truncate">
              {currentChapter ? currentChapter.name : 'All Chapters'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
          </button>

          {chapterMenuOpen && (
            <div className="absolute left-0 top-9 w-64 bg-surface border border-border rounded-control shadow-menu py-1 z-30 animate-in fade-in-0 duration-150">
              <div className="px-3 py-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle">
                Assigned Chapters
              </div>
              <div className="max-h-56 overflow-y-auto">
                {availableChapters.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setActiveChapter(ch.id);
                      setChapterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-hover ${
                      ch.id === activeChapterId ? 'text-accent font-semibold bg-surface-selected' : 'text-text'
                    }`}
                  >
                    <span className="truncate">{ch.name}</span>
                    <span className="text-text-secondary font-normal text-[11px]">{ch.city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search (320px with Ctrl K hint) */}
      <div className="relative w-80">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none stroke-[1.5]" />
          <input
            type="text"
            placeholder="Search senior, ID or phone..."
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-14 rounded-control bg-surface border border-border text-xs text-text placeholder:text-text-disabled focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent-tint transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-normal text-text-secondary bg-surface-subtle border border-border rounded pointer-events-none">
            Ctrl K
          </kbd>
        </div>

        {searchOpen && searchQuery.trim() && (
          <div className="absolute left-0 top-9 w-full bg-surface border border-border rounded-control shadow-menu py-1 z-30">
            {searchResults.length === 0 ? (
              <div className="px-3 py-2 text-xs text-text-secondary">
                No matching seniors found.
              </div>
            ) : (
              searchResults.map((senior) => (
                <button
                  key={senior.id}
                  type="button"
                  onClick={() => {
                    navigate(`/seniors/${senior.id}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-text">{senior.fullName}</div>
                    <div className="text-text-secondary text-[11px]">
                      {maskPhoneNumber(senior.phoneNumber)} · {senior.chapterId}
                    </div>
                  </div>
                  <span className="text-[11px] text-accent font-semibold">View</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: SOS chip, notifications, help, user profile */}
      <div className="flex items-center gap-3">
        {/* SOS Status Chip: neutral when 0 open alerts, solid red with count when there are */}
        <button
          type="button"
          onClick={() => navigate('/sos')}
          className={`h-8 px-3 rounded-control text-xs font-semibold flex items-center gap-2 transition-colors ${
            openSosCount > 0
              ? 'bg-negative text-text-on-accent hover:opacity-90'
              : 'bg-surface-subtle text-text-secondary border border-border hover:bg-surface-hover'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 stroke-[1.5] ${openSosCount > 0 ? 'text-white' : 'text-text-secondary'}`} />
          <span>
            {openSosCount > 0 ? `${openSosCount} open SOS` : 'SOS status: Normal'}
          </span>
        </button>

        {/* Chime Toggle */}
        <button
          type="button"
          onClick={toggleChime}
          className={`h-8 px-2.5 rounded-control border border-border text-xs flex items-center gap-1.5 transition-colors ${
            chimeEnabled ? 'bg-surface-selected text-accent border-accent/30' : 'bg-surface text-text-secondary hover:bg-surface-hover'
          }`}
          title={chimeEnabled ? 'SOS audio chime is enabled' : 'SOS audio chime is muted'}
        >
          {chimeEnabled ? <Volume2 className="w-4 h-4 stroke-[1.5]" /> : <VolumeX className="w-4 h-4 stroke-[1.5]" />}
          <span className="hidden sm:inline text-xs">{chimeEnabled ? 'Chime on' : 'Chime off'}</span>
        </button>

        {/* Notifications Link */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text-secondary hover:text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.5]" />
          <span>Alerts</span>
        </button>

        {/* Help Link */}
        <button
          type="button"
          onClick={() => navigate('/help')}
          className="h-8 px-2.5 rounded-control bg-surface border border-border text-xs text-text-secondary hover:text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
          title="Operational manuals and SOPs"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.5]" />
          <span>Help</span>
        </button>

        {/* User Account Menu with Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="h-8 px-2.5 rounded-control bg-surface border border-border flex items-center gap-2 hover:bg-surface-hover transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-surface-subtle text-text-secondary border border-border flex items-center justify-center text-[10px] font-semibold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-xs font-semibold text-text block truncate max-w-[120px]">
                {user?.fullName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-9 w-64 bg-surface border border-border rounded-control shadow-menu py-1 z-30 animate-in fade-in-0 duration-150">
              <div className="px-3 py-2 border-b border-border-subtle">
                <div className="font-semibold text-xs text-text">{user?.fullName}</div>
                <div className="text-[11px] text-text-secondary">{user?.email}</div>
                <div className="text-[11px] text-accent font-semibold mt-0.5">
                  Role: {ROLES[user?.role || 'RA']?.name}
                </div>
              </div>

              {/* Persona Switcher for Prototype Testing */}
              <div className="px-3 py-1.5 text-xs text-text-secondary font-semibold border-b border-border-subtle">
                Switch Role Persona:
              </div>
              {(['SA', 'NM', 'RA', 'PM', 'CM', 'VF', 'CT', 'CD', 'SP', 'SC', 'FM'] as RoleCode[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchPersona(r);
                    setUserMenuOpen(false);
                    navigate('/');
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-surface-hover ${
                    user?.role === r ? 'text-accent font-semibold bg-surface-selected' : 'text-text'
                  }`}
                >
                  <span>{ROLES[r].name}</span>
                  <span className="text-[11px] text-text-secondary">{r}</span>
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
  );
};
