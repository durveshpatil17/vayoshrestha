import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getFieldQueue, processSyncQueue } from '@/domain/field/offlineQueue';
import {
  Home,
  UserPlus,
  Clock,
  RefreshCw,
  User,
  Wifi,
  WifiOff,
  Sun,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

export const FieldLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_high_contrast') === 'true';
  });

  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_large_text') === 'true';
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_simulated_offline') === 'true';
  });

  const [queueCount, setQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const queue = getFieldQueue();
    const pending = queue.filter((q) => q.status === 'pending');
    setQueueCount(pending.length);
  }, [location.pathname]);

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    localStorage.setItem('vayoshrestha_field_high_contrast', String(next));
  };

  const handleQuickSync = async () => {
    if (isSimulatedOffline) return;
    setIsSyncing(true);
    try {
      await processSyncQueue(user?.id);
      const queue = getFieldQueue();
      setQueueCount(queue.filter((q) => q.status === 'pending').length);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-bg-base flex flex-col justify-between selection:bg-accent-tint ${
        isHighContrast ? 'contrast-more' : ''
      }`}
    >
      {/* 480px Centered Mobile Frame on Desktop */}
      <div
        className={`w-full max-w-[480px] min-h-screen mx-auto bg-bg-surface flex flex-col border-x border-border-hairline  relative ${
          isLargeText ? 'text-[20px] leading-relaxed' : 'text-[16px] leading-normal'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-bg-surface border-b border-border-hairline px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent text-white flex items-center justify-center font-semibold text-base">
              V
            </div>
            <div>
              <div className="font-semibold text-text-primary text-sm leading-tight flex items-center gap-1.5">
                Vayoshreshtha Field
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent-tint text-accent">
                  SF
                </span>
              </div>
              <div className="text-[11px] text-text-muted truncate max-w-[180px]">
                {user?.fullName || 'Senior Field Associate'} · Pune Hub
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline / Online Badge */}
            <button
              type="button"
              onClick={handleQuickSync}
              disabled={isSimulatedOffline || isSyncing}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                isSimulatedOffline
                  ? 'bg-critical-tint text-critical border-critical/30'
                  : queueCount > 0
                  ? 'bg-critical-tint text-critical border-critical/30'
                  : 'bg-positive-tint text-positive border-positive/30'
              }`}
              title={isSimulatedOffline ? 'Simulated Offline Mode' : 'Click to sync'}
            >
              {isSimulatedOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline</span>
                </>
              ) : queueCount > 0 ? (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{queueCount} Queued</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online</span>
                </>
              )}
            </button>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`p-1.5 rounded border text-text-secondary hover:text-text-primary ${
                isHighContrast
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-subtle border-border-hairline'
              }`}
              title="Toggle High Contrast (>=7:1)"
              aria-label="Toggle High Contrast"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Scrollable View Area */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          <Outlet context={{ isHighContrast, isLargeText, setIsLargeText }} />
        </main>

        {/* Fixed Bottom Navigation (Min 48px touch targets) */}
        <nav
          className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-bg-surface border-t border-border-hairline z-30 flex items-center justify-around h-16 px-1"
          aria-label="Field Associate Navigation"
        >
          <NavLink
            to="/field"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Home</span>
          </NavLink>

          <NavLink
            to="/field/onboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <UserPlus className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Add Peer</span>
          </NavLink>

          <NavLink
            to="/field/activity"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Activity</span>
          </NavLink>

          <NavLink
            to="/field/sync"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 transition-colors relative ${
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <div className="relative">
              <RefreshCw className="w-5 h-5 mb-0.5" />
              {queueCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-critical text-white text-[9px] font-semibold">
                  {queueCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">Sync</span>
          </NavLink>

          <NavLink
            to="/field/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full min-h-[48px] px-1 transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
