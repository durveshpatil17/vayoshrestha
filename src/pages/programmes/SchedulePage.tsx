import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Clock, Building2 } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeCentreId } = useAuthStore();
  const data = mockStore.getData();

  const [selectedHub, setSelectedHub] = useState<string>('ALL');

  const filteredSessions = data.sessions.filter((s) => {
    if (user?.role === 'CC' || user?.role === 'VF') {
      if (!user.assignedCentres.includes(s.centreId)) return false;
    }
    if (selectedHub !== 'ALL' && s.centreId !== selectedHub) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Programme Schedule"
        description="Unified chronological calendar of all sessions, yoga circles, and health camps across Ekta Hubs."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Schedule' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/programmes')}
          >
            Manage Programmes
          </Button>
        }
      />

      {/* Filter Strip */}
      <div className="flex items-center justify-between p-3 bg-bg-subtle border border-border-hairline rounded text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-primary">Filter Hub:</span>
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="h-8 px-2.5 rounded bg-bg-base border border-border-hairline text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Available Ekta Hubs</option>
            {data.centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-text-muted font-mono">{filteredSessions.length} total sessions</span>
      </div>

      {/* Sessions Grid Timeline */}
      <div className="space-y-4">
        {filteredSessions.slice(0, 15).map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(`/sessions/${s.id}`)}
            className="p-4 bg-bg-base border border-border-hairline rounded hover:border-accent hover:shadow-xs cursor-pointer transition-all flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 text-center border-r border-border-hairline pr-4">
                <span className="text-[10px] text-text-muted uppercase font-bold block">DATE</span>
                <span className="font-mono text-xs font-bold text-accent">{s.date.slice(5)}</span>
              </div>

              <div>
                <h4 className="font-serif text-sm font-bold text-text-primary mb-0.5">
                  {s.programmeTitle}
                </h4>
                <div className="flex items-center gap-3 text-text-muted text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-accent" /> {s.startTime} - {s.endTime} IST
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-accent" /> {s.centreName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-text-muted block">Enrolment</span>
                <span className="font-mono font-bold text-text-primary">
                  {s.confirmedCount} / {s.capacity}
                </span>
              </div>
              <StatusChip
                label={s.attendanceRecorded ? 'Recorded' : 'Scheduled'}
                variant={s.attendanceRecorded ? 'active' : 'pending'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
