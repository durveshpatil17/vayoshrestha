import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getFieldQueue, processSyncQueue } from '@/domain/field/offlineQueue';
import { Button } from '@/components/ui/Button';
import {
  UserPlus,
  Clock,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Wifi,
  WifiOff,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const FieldHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [language, setLanguage] = useState<'English' | 'Marathi' | 'Hindi' | 'Kannada'>('Marathi');
  const [queue, setQueue] = useState(getFieldQueue());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_simulated_offline') === 'true';
  });
  const [todayTasks, setTodayTasks] = useState([
    {
      id: 'task-1',
      peerName: 'Kamala Devi Joshi',
      area: 'Shivajinagar, Pune',
      type: 'Routine Wellness Check',
      time: '10:30 AM',
      done: false,
    },
    {
      id: 'task-2',
      peerName: 'Ramdas Vishnu Kelkar',
      area: 'Ghole Road, Pune',
      type: 'Consent 2 WhatsApp Follow-up',
      time: '02:00 PM',
      done: false,
    },
    {
      id: 'task-3',
      peerName: 'Shalini Prabhakar',
      area: 'Model Colony, Pune',
      type: 'New Peer Onboarding Visit',
      time: '04:15 PM',
      done: true,
    },
  ]);

  useEffect(() => {
    setQueue(getFieldQueue());
  }, []);

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const syncedTodayCount = queue.filter((q) => q.status === 'synced').length + 8; // seeded baseline

  const toggleTask = (id: string) => {
    setTodayTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-4">
      {/* Network / Offline Banner */}
      <div
        className={`p-3 rounded-lg border flex items-center justify-between text-sm ${
          isSimulatedOffline
            ? 'bg-critical-tint/50 border-critical/30 text-critical'
            : pendingCount > 0
            ? 'bg-critical-tint/50 border-critical/30 text-critical'
            : 'bg-positive-tint/50 border-positive/30 text-positive'
        }`}
      >
        <div className="flex items-center gap-2">
          {isSimulatedOffline ? (
            <WifiOff className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Wifi className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="font-medium">
            {isSimulatedOffline
              ? 'Offline mode active (activities queued)'
              : pendingCount > 0
              ? `${pendingCount} item(s) waiting to sync`
              : 'Network active · Cloud synchronized'}
          </span>
        </div>
        <Link
          to="/field/sync"
          className="text-xs font-semibold underline hover:opacity-80"
        >
          View queue
        </Link>
      </div>

      {/* Primary Action Button (Add a peer) >= 48px touch target */}
      <Button
        variant="primary"
        size="lg"
        className="w-full h-14 text-base font-semibold flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-lg"
        onClick={() => navigate('/field/onboard')}
      >
        <UserPlus className="w-5 h-5" />
        <span>Add a Peer (Onboarding)</span>
      </Button>

      {/* Language Selector Ribbon */}
      <div className="flex items-center justify-between p-2.5 bg-bg-subtle rounded-lg border border-border-hairline text-xs">
        <span className="text-text-muted font-medium">Script Language:</span>
        <div className="flex items-center gap-1">
          {(['English', 'Marathi', 'Hindi', 'Kannada'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                language === lang
                  ? 'bg-accent text-white font-semibold'
                  : 'text-text-secondary hover:text-text-primary bg-bg-surface border border-border-hairline'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Counters (Clean Enterprise Cards) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg text-center">
          <div className="text-2xl font-semibold text-accent tabular-nums">14</div>
          <div className="text-[11px] text-text-muted leading-tight mt-0.5">Peers Onboarded</div>
        </div>
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg text-center">
          <div className="text-2xl font-semibold text-text-primary tabular-nums">{syncedTodayCount}</div>
          <div className="text-[11px] text-text-muted leading-tight mt-0.5">Visits Synced</div>
        </div>
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg text-center">
          <div className="text-2xl font-semibold text-critical tabular-nums">{pendingCount}</div>
          <div className="text-[11px] text-text-muted leading-tight mt-0.5">Waiting Queue</div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-accent" />
            Today's Visits & Follow-ups
          </h2>
          <span className="text-[11px] text-text-muted">Pune Ekta Hub</span>
        </div>

        <div className="space-y-2">
          {todayTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                t.done
                  ? 'bg-bg-subtle/50 border-border-hairline opacity-70'
                  : 'bg-bg-surface border-border hover:border-accent'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="mt-1 w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <div>
                  <div
                    className={`font-medium text-sm text-text-primary ${
                      t.done ? 'line-through text-text-muted' : ''
                    }`}
                  >
                    {t.peerName}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {t.type} · {t.area}
                  </div>
                </div>
              </div>
              <span className="text-xs tabular-nums text-text-muted font-medium">
                {t.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Field Associate Training Ribbon */}
      <Link
        to="/field/learn"
        className="block p-3 rounded-lg border border-border-hairline bg-accent-tint/40 hover:bg-accent-tint/60 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            <div>
              <div className="text-xs font-semibold text-text-primary">Associate Training Modules</div>
              <div className="text-[11px] text-text-muted">DPDP Consent rules & Cyber-scam awareness</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-accent" />
        </div>
      </Link>

      {/* Simulated SOS-style "Call my coordinator" */}
      <div className="pt-2">
        <a
          href="tel:9822011223"
          className="w-full h-12 flex items-center justify-center gap-2 border border-border-strong rounded-lg bg-bg-surface hover:bg-bg-subtle text-text-primary font-medium text-sm transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-accent" />
          <span>Call Coordinator (Sunita Patil · Ekta Hub)</span>
        </a>
        <p className="text-[10px] text-text-muted text-center mt-1">
          For emergency support, hub inquiries, or peer dispute escalation.
        </p>
      </div>
    </div>
  );
};
