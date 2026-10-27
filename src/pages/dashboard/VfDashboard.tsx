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
  UserPlus,
  PhoneCall,
  Clock,
  Shield,
} from 'lucide-react';

export const VfDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const userCentre = user?.assignedCentres[0] || 'HUB-PUN';
  const assignedSessions = data.sessions.filter((s) => s.centreId === userCentre).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Staff & Volunteer Workdesk"
        description="Daily session rosters, assisted elder registrations, and welfare follow-up outreach."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My Day' }]}
        primaryAction={
          <Button
            variant="primary"
            size="md"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => navigate('/members/new')}
          >
            Assisted Senior Registration
          </Button>
        }
      />

      {/* Masked Data Notice Banner */}
      <div className="p-3 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>Field Staff Mode: Senior contact numbers are masked (••••••3421). Click 'Reveal' to record an audited reason.</span>
        </div>
        <StatusChip label="Masked Access" variant="neutral" />
      </div>

      {/* Today's Priority Action Cards */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-text-primary mb-3">
          Today's Assigned Sessions (Mark Attendance)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedSessions.map((s) => (
            <div key={s.id} className="p-5 bg-bg-base border border-border-hairline rounded shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-accent font-semibold">{s.centreName}</span>
                  <StatusChip
                    label={s.attendanceRecorded ? 'Recorded' : 'Roll Call Pending'}
                    variant={s.attendanceRecorded ? 'active' : 'pending'}
                  />
                </div>
                <h4 className="font-serif text-base font-semibold text-text-primary mb-1">
                  {s.programmeTitle}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{s.startTime} - {s.endTime} IST · Capacity {s.capacity}</span>
                </div>
                <p className="text-xs text-text-muted mb-4">
                  {s.confirmedCount} registered seniors expected today.
                </p>
              </div>

              <Button
                variant={s.attendanceRecorded ? 'secondary' : 'primary'}
                size="md"
                className="w-full"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => navigate(`/attendance/session/${s.id}`)}
              >
                {s.attendanceRecorded ? 'Review Roster' : 'Open Attendance Roll'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Welfare Follow-Ups for Today */}
      <div className="p-5 bg-bg-base border border-border-hairline rounded">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-hairline">
          <div>
            <h3 className="font-serif text-base font-semibold text-text-primary">
              Assigned Elder Welfare Follow-ups
            </h3>
            <p className="text-xs text-text-muted">Inquire about wellbeing or missed sessions.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/follow-ups')}>
            View All Tasks
          </Button>
        </div>

        <div className="divide-y divide-border-hairline text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-text-primary">Shanta Devi Patel (Age 72)</div>
              <div className="text-text-muted">Absent for 3 consecutive yoga sessions · Reason: Knee stiffness inquiry</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<PhoneCall className="w-3.5 h-3.5" />}
              onClick={() => navigate('/follow-ups')}
            >
              Call Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
