import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Users,
  Clock,
  PhoneCall,
  Pill,
  HeartPulse,
  UserCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const chapterId = user?.chapterId || user?.assignedCentres?.[0] || 'HUB-BLR';
  const chapter = data.chapters.find((c) => c.id === chapterId) || data.chapters[0];

  const chapterSeniors = data.seniorCitizens.filter((s) => s.chapterId === chapter.id);
  const chapterSos = data.sosEvents.filter((e) => e.chapterId === chapter.id);
  const openSos = chapterSos.filter(
    (e) => e.status === 'TRIGGERED' || e.status === 'ACKNOWLEDGED' || e.status === 'RESPONDED'
  );

  const chapterFlags = data.healthFlags.filter((f) => f.chapterId === chapter.id);
  const openFlags = chapterFlags.filter((f) => f.status === 'NEW' || f.status === 'CALL_ASSIGNED');

  const chapterCalls = data.wellnessCallTasks.filter((c) => c.chapterId === chapter.id);
  const pendingCalls = chapterCalls.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS');

  const roster = chapter.onDutyRoster || [];

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Critical Alert Banner if Open SOS in this chapter */}
      {openSos.length > 0 && (
        <div className="bg-danger text-white rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-danger-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide uppercase block">
                Chapter Emergency: {openSos.length} Active SOS
              </span>
              <p className="text-xs text-white/90 mt-0.5">
                Senior emergency alert in {chapter.name}. Acknowledge or assign immediately.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos')}
            className="bg-white text-danger hover:bg-white/90 font-bold border-transparent text-xs"
          >
            Go to SOS Board
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`${chapter.name} · Chapter Operations`}
          description={`Hub Code: ${chapter.code} · ${chapter.city}, ${chapter.state} · Local senior registry, daily reminders, and welfare calls.`}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/onboarding/new')}
            className="text-xs"
          >
            Assisted Onboarding
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/health/flags')}
            className="text-xs gap-1.5 bg-accent"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Work Anomaly Calls ({openFlags.length})
          </Button>
        </div>
      </div>

      {/* 4 Key Chapter Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Chapter Registry</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {chapterSeniors.length}
          </div>
          <span className="text-[10px] text-accent">Active in {chapter.code}</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Today's Reminders</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {Math.round(chapterSeniors.length * 0.85)}
          </div>
          <span className="text-[10px] text-success">84% Confirmed Taken</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Pending Welfare Calls</span>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              openFlags.length > 0 ? 'text-warning' : 'text-text-primary'
            }`}
          >
            {openFlags.length}
          </div>
          <span className="text-[10px] text-text-muted">High BP or Glucose</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Stalled Onboardings</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {Math.floor(chapterSeniors.length * 0.08)}
          </div>
          <span className="text-[10px] text-text-muted">Drop-offs in bot flow</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-Duty Emergency Roster (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-border-hairline rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-hairline pb-3">
            <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              Chapter On-Duty Emergency Roster
            </h3>
            <span className="text-xs text-text-muted">24/7 Escalation Contact List</span>
          </div>

          <div className="space-y-3">
            {roster.length === 0 ? (
              <div className="p-4 bg-surface-subtle border border-border-hairline rounded text-xs text-text-muted">
                No active staff roster assigned. Default escalation routes to Regional Admin.
              </div>
            ) : (
              roster.map((person) => (
                <div
                  key={person.userId}
                  className="p-3 bg-surface-subtle border border-border-hairline rounded flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{person.userName}</span>
                      {person.isPrimaryResponder && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-accent text-white rounded font-bold uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-text-muted">
                      Shift: {person.shift} · Role: {person.role}
                    </span>
                  </div>
                  <span className="font-mono text-text-primary font-medium">
                    {person.onCallPhone}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Chapter Actions (Right 1 col) */}
        <div className="space-y-4">
          <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
            <h3 className="font-serif font-bold text-sm text-text-primary">Chapter Operations</h3>

            <div className="space-y-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/seniors')}
                className="w-full justify-between"
              >
                <span>Senior Registry ({chapterSeniors.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/schedules')}
                className="w-full justify-between"
              >
                <span>Medication Schedules</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/calls')}
                className="w-full justify-between"
              >
                <span>Call Task Assignments</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/onboarding')}
                className="w-full justify-between"
              >
                <span>Onboarding Funnel</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
