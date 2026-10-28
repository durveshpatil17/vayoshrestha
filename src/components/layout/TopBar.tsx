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
  Type,
  Volume2,
  VolumeX,
  AlertTriangle,
  X,
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
    textSize,
    setTextSize,
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

  // Real-time SOS count monitoring & document title update
  useEffect(() => {
    const updateCount = () => {
      const active = mockStore
        .getData()
        .sosEvents.filter((e) => e.status === 'Triggered' || e.status === 'Acknowledged');
      setOpenSosCount(active.length);
      if (active.length > 0) {
        document.title = `(🚨 ${active.length}) Vayoshreshtha — Emergency SOS`;
      } else {
        document.title = 'Vayoshreshtha — Digital Senior-Care Platform';
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, [setOpenSosCount]);

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

  // Debounced search adhering to scope
  const searchResults =
    searchQuery.trim().length >= 2
      ? seniorCitizens
          .filter((s) => {
            if (user?.role === 'CM' || user?.role === 'VF') {
              if (user.assignedChapter && s.chapterId !== user.assignedChapter) return false;
            }
            const q = searchQuery.toLowerCase();
            const memId = (s.memberId || s.membershipId || '').toLowerCase();
            const ph = s.phoneNumber || s.phone || '';
            return (
              s.fullName.toLowerCase().includes(q) ||
              memId.includes(q) ||
              ph.includes(q)
            );
          })
          .slice(0, 5)
      : [];

  return (
    <header className="h-14 bg-bg-base border-b border-border-hairline px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left: Brand & Chapter Scope Switcher */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white font-serif font-bold text-lg">
            V
          </div>
          <div>
            <span className="font-serif font-bold text-base text-text-primary tracking-tight">Vayoshreshtha</span>
            <span className="text-[10px] block text-text-muted font-sans -mt-1">Vayoh Vikas Eldercare</span>
          </div>
        </div>

        {/* Chapter / Hub Switcher */}
        {user?.role !== 'SC' && user?.role !== 'CD' && (
          <div className="relative">
            <button
              onClick={() => setChapterMenuOpen(!chapterMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-text-primary bg-bg-subtle hover:bg-bg-active rounded border border-border-hairline transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>{currentChapter?.name || 'All Chapters'}</span>
              {availableChapters.length > 1 && <ChevronDown className="w-3 h-3 text-text-muted" />}
            </button>

            {chapterMenuOpen && availableChapters.length > 1 && (
              <div className="absolute left-0 mt-1 w-64 bg-white rounded shadow-lg border border-border-hairline py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-hairline">
                  Assigned Chapters ({availableChapters.length})
                </div>
                {availableChapters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChapter(c.id);
                      setChapterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-bg-subtle ${
                      c.id === activeChapterId ? 'font-semibold text-accent bg-accent-tint/30' : 'text-text-primary'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-text-muted">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle: Global Senior Search */}
      <div className="relative flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search seniors by name, phone last 4, or ID..."
            className="w-full bg-bg-subtle border border-border-hairline rounded pl-9 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {searchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded shadow-lg border border-border-hairline py-1 z-50">
            {searchResults.map((senior) => (
              <div
                key={senior.id}
                onClick={() => {
                  navigate(`/seniors/${senior.id}`);
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="px-3 py-2 hover:bg-bg-subtle cursor-pointer border-b border-border-hairline last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-text-primary">{senior.fullName}</span>
                  <span className="text-[10px] font-mono text-text-muted">{senior.memberId || senior.membershipId}</span>
                </div>
                <div className="text-[11px] text-text-muted flex gap-3 mt-0.5">
                  <span>Phone: {user?.role === 'VF' ? maskPhoneNumber(senior.phoneNumber || senior.phone || '') : (senior.phoneNumber || senior.phone || '')}</span>
                  <span>Chapter: {senior.chapterId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: SOS Status Pill, Chime Toggle, Text Scale, Profile */}
      <div className="flex items-center gap-3">
        {/* Real-time SOS Board Quick Pill */}
        <button
          onClick={() => navigate('/sos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
            openSosCount > 0
              ? 'bg-danger text-white animate-pulse'
              : 'bg-bg-subtle text-text-muted hover:text-text-primary border border-border-hairline'
          }`}
          title="Open Live SOS Board"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{openSosCount > 0 ? `🚨 ${openSosCount} Open SOS` : 'SOS Board'}</span>
        </button>

        {/* Chime Audio Toggle */}
        <button
          onClick={toggleChime}
          className={`p-2 rounded text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors ${
            chimeEnabled ? 'text-accent' : ''
          }`}
          title={chimeEnabled ? 'SOS Alert Chime Enabled (Click to Mute)' : 'SOS Alert Chime Muted (Click to Enable)'}
        >
          {chimeEnabled ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4 text-text-muted" />}
        </button>

        {/* Text Scaling for Seniors */}
        {user?.role === 'SC' && (
          <div className="flex items-center border border-border-hairline rounded bg-bg-subtle p-0.5">
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2 py-0.5 text-xs rounded ${textSize === 'normal' ? 'bg-white font-bold text-accent shadow-xs' : 'text-text-muted'}`}
            >
              18px
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2 py-0.5 text-xs rounded ${textSize === 'large' ? 'bg-white font-bold text-accent shadow-xs' : 'text-text-muted'}`}
            >
              20px
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-2 py-0.5 text-xs rounded ${textSize === 'xlarge' ? 'bg-white font-bold text-accent shadow-xs' : 'text-text-muted'}`}
            >
              22px
            </button>
          </div>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-subtle rounded transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {openSosCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />}
        </button>

        {/* Help */}
        <button
          onClick={() => navigate('/help')}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-subtle rounded transition-colors"
          title="Operating Help & SOPs"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border-hairline mx-1" />

        {/* User Account Menu with Role Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded hover:bg-bg-subtle text-left transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent-tint text-accent flex items-center justify-center font-bold text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs font-semibold text-text-primary leading-tight">
                {user?.fullName || 'Guest'}
              </span>
              <span className="block text-[10px] text-text-muted leading-none">
                {ROLES[user?.role || 'SA']?.name || user?.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white rounded shadow-lg border border-border-hairline py-1 z-50">
              <div className="px-3 py-2 border-b border-border-hairline bg-bg-subtle/50">
                <div className="font-semibold text-xs text-text-primary">{user?.fullName}</div>
                <div className="text-[11px] text-text-muted">{user?.email}</div>
                <div className="text-[10px] font-mono text-accent mt-0.5">Role: {user?.role}</div>
              </div>

              {/* Quick Persona Switcher for Evaluation */}
              <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-hairline">
                Prototype Quick Persona Switch
              </div>
              <div className="max-h-48 overflow-y-auto">
                {(['RA', 'CM', 'VF', 'CT', 'NM', 'SA', 'CD', 'SC'] as RoleCode[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchPersona(r);
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-bg-subtle ${
                      user?.role === r ? 'font-semibold text-accent bg-accent-tint/30' : 'text-text-primary'
                    }`}
                  >
                    <span>{ROLES[r].name}</span>
                    <span className="text-[10px] text-text-muted font-mono">{r}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border-hairline mt-1 pt-1">
                <button
                  onClick={() => {
                    navigate('/account');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-text-primary hover:bg-bg-subtle flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-danger-bg flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
