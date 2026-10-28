import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import {
  AlertOctagon,
  Users,
  Clock,
  PhoneCall,
  UserCheck,
  ChevronRight,
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

  const roster = chapter.onDutyRoster || [];
  const stalledCount = Math.floor(chapterSeniors.length * 0.08);

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* 1. Critical Alert Banner if Open SOS in this chapter */}
      {openSos.length > 0 && (
        <div
          role="alert"
          className="bg-negative-tint border border-negative rounded-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-negative"
        >
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-negative shrink-0" strokeWidth={1.5} />
            <div>
              <span className="font-semibold text-sm text-text block">
                Chapter emergency: {openSos.length} active SOS alert(s)
              </span>
              <p className="text-xs text-text-secondary mt-0.5">
                Senior emergency alert in {chapter.name}. Acknowledge or assign immediately.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => navigate('/sos')}
            className="text-xs shrink-0"
          >
            Go to SOS Board
          </Button>
        </div>
      )}

      {/* 2. Page Header */}
      <PageHeader
        title={`${chapter.name} · Chapter Operations`}
        description={`Hub code: ${chapter.code} · ${chapter.city}, ${chapter.state} · Local senior registry, daily reminders, and welfare calls.`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/onboarding/new')}
            >
              Assisted Onboarding
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/health/flags')}
              className="gap-1.5"
            >
              <PhoneCall className="w-4 h-4" strokeWidth={1.5} />
              Work Anomaly Calls ({openFlags.length})
            </Button>
          </div>
        }
      />

      {/* 3. 4 Headline Chapter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Chapter registry"
          value={chapterSeniors.length}
          statusLine={`Active in ${chapter.code}`}
          status="positive"
        />
        <KpiTile
          title="Today's reminders"
          value={Math.round(chapterSeniors.length * 0.85)}
          statusLine="84.0% confirmed taken"
          status="positive"
        />
        <KpiTile
          title="Pending welfare calls"
          value={openFlags.length}
          statusLine={openFlags.length === 0 ? 'All calls completed' : 'High BP or glucose alerts'}
          status={openFlags.length === 0 ? 'positive' : 'critical'}
        />
        <KpiTile
          title="Stalled onboardings"
          value={stalledCount}
          statusLine="Drop-offs in registration flow"
          status="neutral"
        />
      </div>

      {/* 4. Needs Attention (Row list) */}
      <Card
        title="Needs attention"
        subtitle="Operational tasks requiring care manager intervention"
        padding="none"
      >
        <div className="divide-y divide-border">
          {/* Item 1: Open SOS */}
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={openSos.length > 0 ? 'negative' : 'positive'}
                label={openSos.length > 0 ? 'Emergency' : 'Normal'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {openSos.length > 0
                    ? `${openSos.length} open emergency event(s) in chapter ${chapter.code}`
                    : 'No open emergencies in this chapter'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Chapter emergency response queue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Live</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/sos')}
              >
                Inspect Board
              </Button>
            </div>
          </div>

          {/* Item 2: Anomaly Calls */}
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={openFlags.length > 0 ? 'critical' : 'positive'}
                label={openFlags.length > 0 ? 'Pending' : 'Completed'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {openFlags.length > 0
                    ? `${openFlags.length} vital anomaly outreach call(s) pending`
                    : 'All daily anomaly calls completed'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Outreach calls for elevated systolic BP or glucose
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Today</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/flags')}
              >
                Start Calls
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-Duty Emergency Roster (Left 2 cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Chapter on-duty emergency roster"
            subtitle="24/7 escalation contact list for local response coordinators"
            padding="none"
          >
            <div className="divide-y divide-border">
              {roster.length === 0 ? (
                <div className="p-4 text-xs text-text-secondary">
                  No active staff roster assigned. Default escalation routes to Regional Admin.
                </div>
              ) : (
                roster.map((person) => (
                  <div
                    key={person.userId}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-surface-hover transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{person.userName}</span>
                        {person.isPrimaryResponder && (
                          <span className="px-1.5 py-0.5 text-[11px] bg-accent-tint text-accent rounded-chip font-semibold">
                            Primary
                          </span>
                        )}
                      </div>
                      <span className="text-text-secondary">
                        Shift: {person.shift} · Role: {person.role}
                      </span>
                    </div>
                    <span className="tabular-nums text-text font-medium">
                      {person.onCallPhone}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Chapter Operations (Right 1 col) */}
        <div>
          <Card
            title="Chapter operations"
            subtitle="Hub shortcuts"
            padding="md"
          >
            <div className="space-y-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/seniors')}
                className="w-full justify-between"
              >
                <span>Senior Registry ({chapterSeniors.length})</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/schedules')}
                className="w-full justify-between"
              >
                <span>Medication Schedules</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/calls')}
                className="w-full justify-between"
              >
                <span>Call Task Assignments</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/onboarding')}
                className="w-full justify-between"
              >
                <span>Onboarding Funnel</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
