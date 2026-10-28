import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Ribbon } from './Ribbon';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import { backgroundJobs } from '@/mock/backgroundJobs';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, textSize, logout } = useAuthStore();
  const [idleWarning, setIdleWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  // Background worker lifecycle
  useEffect(() => {
    backgroundJobs.start();
    return () => backgroundJobs.stop();
  }, []);

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
      ? 'senior-text-xlarge'
      : textSize === 'large'
      ? 'senior-text-large'
      : '';

  return (
    <div className={`min-h-screen bg-canvas flex flex-col ${textSizeClass}`}>
      {/* 1. Prototype Watermark Ribbon */}
      <Ribbon />

      {/* 2. Top Application Bar */}
      <TopBar />

      {/* 3. Main Body: Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-canvas p-8">
          <div className="max-w-[1280px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Simulated Idle Timeout Warning Dialog (Enforcement Rule 8) */}
      {idleWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-card shadow-dialog max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-card bg-critical-tint text-critical flex items-center justify-center mx-auto mb-4 border border-critical">
              <Clock className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Session Inactivity Warning
            </h3>
            <p className="text-sm text-text-secondary mb-6">
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
                Sign Out Now
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIdleWarning(false);
                  setSecondsRemaining(60);
                }}
              >
                Continue Working
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
