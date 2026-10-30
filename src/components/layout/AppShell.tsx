import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Ribbon } from './Ribbon';
import { ShellBar } from '@/ui/ShellBar';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { useAuthStore } from '@/store/authStore';
import { backgroundJobs } from '@/mock/backgroundJobs';
import { findWorkspaceForPath, WORKSPACES } from '@/navigation/workspaces';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, textSize, logout, addRecentVisit } = useAuthStore();
  const [idleWarning, setIdleWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  // Background worker lifecycle
  useEffect(() => {
    backgroundJobs.start();
    return () => backgroundJobs.stop();
  }, []);

  // Track recent visits automatically
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/login') || path.startsWith('/session')) return;

    const wsId = findWorkspaceForPath(path);
    const ws = wsId ? WORKSPACES[wsId] : null;
    const app = ws?.apps.find((a) => a.path === path);
    const title = app?.name || (ws ? `${ws.name} Workspace` : path);
    const category = ws?.name || 'General';

    addRecentVisit({ title, path, category });
  }, [location.pathname, addRecentVisit]);

  // Auth gate
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const textSizeClass =
    textSize === 'xlarge'
      ? 'density-large larger-text'
      : textSize === 'large'
      ? 'density-large'
      : '';

  return (
    <div className={`h-screen max-h-screen overflow-hidden bg-page flex flex-col ${textSizeClass}`}>
      {/* 1. SAP Fiori 52px Shell Bar on top */}
      <ShellBar />

      {/* 2. Prototype Notice Ribbon pinned directly underneath Shell Bar */}
      <Ribbon />

      {/* 3. Auto-computed Breadcrumb Bar */}
      <Breadcrumbs />

      {/* 4. Main Body: Side Navigation + Only Scrollable Region */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 min-h-0 overflow-y-auto bg-page p-8 scroll-pt-28">
          <div className="max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Session Inactivity Warning Dialog */}
      {idleWarning && (
        <div className="fixed inset-0 bg-text/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-container shadow-overlay max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-container bg-critical-tint text-critical flex items-center justify-center mx-auto mb-4 border border-critical/30">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-semibold text-text mb-2">
              Session inactivity warning
            </h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Due to institutional security protocols, your session will automatically lock in{' '}
              <strong className="text-negative tabular-nums font-semibold">{secondsRemaining}s</strong>. Do you wish to stay signed in?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIdleWarning(false);
                  logout();
                  navigate('/session-expired');
                }}
              >
                Sign out now
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIdleWarning(false);
                  setSecondsRemaining(60);
                }}
              >
                Continue working
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
