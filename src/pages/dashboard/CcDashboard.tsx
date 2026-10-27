import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const CcDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeCentreId } = useAuthStore();
  const data = mockStore.getData();

  const currentCentreId = activeCentreId || (user?.assignedCentres[0] || 'HUB-PUN');
  const currentCentre = data.centres.find((c) => c.id === currentCentreId) || data.centres[0];

  // Scoped data to coordinator's centre
  const centreMembers = data.seniorCitizens.filter((s) => s.centreId === currentCentreId);
  const centreSessions = data.sessions.filter((s) => s.centreId === currentCentreId);
  const centreEscalations = data.escalations.filter((e) => e.centreId === currentCentreId && e.status !== 'Resolved');
  const pendingCorrections = data.attendanceCorrections.filter((c) => c.centreId === currentCentreId && c.status === 'Pending');

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${currentCentre.name} · Centre Dashboard`}
        description={`Hub Code: ${currentCentre.code} · ${currentCentre.city}, ${currentCentre.state} · Local operations and attendance monitoring.`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: currentCentre.code }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/attendance')}
          >
            Mark Daily Attendance
          </Button>
        }
      />

      {/* 4 Centre Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Registered at Hub</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {centreMembers.length}
          </div>
          <span className="text-[11px] text-accent block mt-1">Elders registered</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Active Elders (30d)</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {centreMembers.filter((s) => s.isActive).length}
          </div>
          <span className="text-[11px] text-success block mt-1">Regular participants</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Scheduled Sessions</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {centreSessions.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Programmes allocated</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Local Health Requests</span>
          <div className="text-2xl font-bold font-serif text-warning tabular-nums">
            {centreEscalations.length}
          </div>
          <span className="text-[11px] text-warning block mt-1">Active case files</span>
        </div>
      </div>

      {/* Two Column Layout: Today's Sessions & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Sessions (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="font-serif text-base font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Active Sessions at {currentCentre.name}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/programmes')}>
              Browse All
            </Button>
          </div>

          <div className="divide-y divide-border-hairline">
            {centreSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-text-primary mb-0.5">{s.programmeTitle}</h4>
                  <div className="flex items-center gap-3 text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {s.date} · {s.startTime} - {s.endTime}
                    </span>
                    <span>Confirmed: {s.confirmedCount} / {s.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusChip
                    label={s.attendanceRecorded ? 'Attendance Recorded' : 'Pending Roll Call'}
                    variant={s.attendanceRecorded ? 'active' : 'pending'}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/attendance/session/${s.id}`)}
                  >
                    Roster
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Centre Tasks */}
        <div className="p-5 bg-bg-subtle border border-border-hairline rounded space-y-3">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            Centre Coordinator Action Items
          </h3>

          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => navigate('/attendance/corrections')}
              className="p-3 rounded bg-bg-base border border-border-hairline hover:border-accent cursor-pointer"
            >
              <div className="flex items-center justify-between font-semibold text-text-primary mb-1">
                <span>Attendance Corrections</span>
                <span className="font-mono text-accent text-[11px]">{pendingCorrections.length} pending</span>
              </div>
              <p className="text-[11px] text-text-muted">Review volunteer mark adjustments</p>
            </div>

            <div
              onClick={() => navigate('/follow-ups')}
              className="p-3 rounded bg-bg-base border border-border-hairline hover:border-accent cursor-pointer"
            >
              <div className="flex items-center justify-between font-semibold text-text-primary mb-1">
                <span>Welfare Follow-up Calls</span>
                <span className="font-mono text-warning text-[11px]">8 due today</span>
              </div>
              <p className="text-[11px] text-text-muted">Contact elders absent for &gt;2 consecutive weeks</p>
            </div>

            <div
              onClick={() => navigate('/members/new')}
              className="p-3 rounded bg-bg-base border border-border-hairline hover:border-accent cursor-pointer"
            >
              <div className="flex items-center justify-between font-semibold text-text-primary mb-1">
                <span>New Walk-in Registration</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </div>
              <p className="text-[11px] text-text-muted">Register an elder visiting the centre today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
