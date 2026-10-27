import React, { useState } from 'react';
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
  X,
} from 'lucide-react';
import { maskPhoneNumber } from '@/domain/masking';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeCentreId, setActiveCentre, switchPersona, logout, textSize, setTextSize } =
    useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [centreMenuOpen, setCentreMenuOpen] = useState(false);

  const allCentres = mockStore.getData().centres;
  const seniorCitizens = mockStore.getData().seniorCitizens;

  // Filter available centres: CC & VF only see assigned centres; others see all
  const availableCentres =
    user?.assignedCentres && user.assignedCentres.length > 0 && (user.role === 'CC' || user.role === 'VF')
      ? allCentres.filter((c) => user.assignedCentres.includes(c.id))
      : allCentres;

  const currentCentre = allCentres.find((c) => c.id === activeCentreId) || availableCentres[0];

  // Search filtering (respects scope)
  const searchResults = searchQuery.trim().length >= 2
    ? seniorCitizens
        .filter((s) => {
          if (user?.role === 'CC' || user?.role === 'VF') {
            if (!user.assignedCentres.includes(s.centreId)) return false;
          }
          const q = searchQuery.toLowerCase();
          return (
            s.fullName.toLowerCase().includes(q) ||
            s.membershipId.toLowerCase().includes(q) ||
            s.phone.includes(q)
          );
        })
        .slice(0, 5)
    : [];

  return (
    <header className="h-14 bg-bg-base border-b border-border-hairline px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left: Centre Switcher & Brand */}
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

        {/* Centre Switcher */}
        {availableCentres.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setCentreMenuOpen(!centreMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-border-hairline bg-bg-subtle text-xs font-medium text-text-primary hover:bg-bg-active transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>{currentCentre?.name || 'All Ekta Hubs'}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {centreMenuOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-bg-base border border-border-hairline rounded shadow-lg z-50 py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-hairline">
                  Assigned Ekta Hubs
                </div>
                {availableCentres.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCentre(c.id);
                      setCentreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-bg-subtle ${
                      c.id === activeCentreId ? 'font-semibold text-accent bg-accent-tint/30' : 'text-text-primary'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-text-muted">{c.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center: Global Member Search */}
      <div className="flex-1 max-w-md mx-6 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search member by name, ID (e.g. VV-PUN-26-00001), or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full h-9 pl-9 pr-8 rounded bg-bg-subtle border border-border-hairline text-xs text-text-primary placeholder:text-text-disabled focus:bg-bg-base focus:border-accent focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-bg-base border border-border-hairline rounded shadow-lg z-50 py-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-hairline">
              Matching Members ({searchResults.length})
            </div>
            {searchResults.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                  navigate(`/members/${m.id}`);
                }}
                className="w-full text-left px-3 py-2.5 text-xs hover:bg-bg-subtle flex items-center justify-between border-b border-border-hairline last:border-none"
              >
                <div>
                  <div className="font-semibold text-text-primary">{m.fullName}</div>
                  <div className="text-[11px] text-text-muted font-mono">{m.membershipId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-text-muted block">
                    {user?.role === 'VF' ? maskPhoneNumber(m.phone) : m.phone}
                  </span>
                  <span className="text-[10px] text-accent">{m.centreId}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Text Scaler, Notifications, Help, User Menu */}
      <div className="flex items-center gap-3">
        {/* Senior / Accessibility Text Scaler */}
        <div className="flex items-center bg-bg-subtle border border-border-hairline rounded p-0.5" title="Adjust text scale for elder accessibility">
          <Type className="w-3.5 h-3.5 text-text-muted ml-1.5 mr-1" />
          <button
            onClick={() => setTextSize('normal')}
            className={`px-1.5 py-0.5 text-[11px] rounded ${textSize === 'normal' ? 'bg-bg-base text-accent font-semibold shadow-xs' : 'text-text-muted hover:text-text-primary'}`}
          >
            A
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-1.5 py-0.5 text-xs rounded ${textSize === 'large' ? 'bg-bg-base text-accent font-semibold shadow-xs' : 'text-text-muted hover:text-text-primary'}`}
          >
            A+
          </button>
          <button
            onClick={() => setTextSize('xlarge')}
            className={`px-1.5 py-0.5 text-sm rounded ${textSize === 'xlarge' ? 'bg-bg-base text-accent font-semibold shadow-xs' : 'text-text-muted hover:text-text-primary'}`}
          >
            A++
          </button>
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded text-text-muted hover:text-text-primary hover:bg-bg-subtle relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-warning absolute top-1.5 right-1.5" />
        </button>

        {/* Help */}
        <button
          onClick={() => navigate('/help')}
          className="p-2 rounded text-text-muted hover:text-text-primary hover:bg-bg-subtle"
          title="Help & FAQs"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-border-hairline mx-1" />

        {/* User Persona & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-bg-subtle transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center font-semibold text-xs overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user?.role || 'U'
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-text-primary leading-none">{user?.fullName}</div>
              <div className="text-[10px] text-text-muted leading-tight mt-0.5 font-mono">{user?.role} · {ROLES[user?.role || 'SA']?.name}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-bg-base border border-border-hairline rounded shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-border-hairline">
                <div className="text-xs font-bold text-text-primary">{user?.fullName}</div>
                <div className="text-[11px] text-text-muted truncate">{user?.email || user?.phone}</div>
                <div className="text-[10px] text-accent font-semibold mt-0.5 uppercase tracking-wider">{ROLES[user?.role || 'SA']?.name}</div>
              </div>

              {/* Persona Switcher for Prototype Evaluation */}
              <div className="py-1 border-b border-border-hairline">
                <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  Switch Role Persona (Prototype Demo)
                </div>
                {(['PM', 'NM', 'CC', 'VF', 'SA', 'SP', 'CT', 'CD', 'SC', 'FM'] as RoleCode[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchPersona(r);
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-bg-subtle ${
                      user?.role === r ? 'font-bold text-accent bg-accent-tint/30' : 'text-text-primary'
                    }`}
                  >
                    <span>{ROLES[r].name}</span>
                    <span className="font-mono text-[10px] text-text-muted">{r}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/account');
                }}
                className="w-full text-left px-3 py-2 text-xs text-text-primary hover:bg-bg-subtle flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-text-muted" />
                <span>My Account & Security</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger-bg/50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-danger" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
