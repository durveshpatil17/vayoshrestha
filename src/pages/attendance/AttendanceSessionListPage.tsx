import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Building2, Users, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react';

export const AttendanceSessionListPage: React.FC = () => {
  const { user, activeCentreId } = useAuthStore();
  const data = mockStore.getData();

  const [tab, setTab] = useState<'today' | 'pending' | 'completed'>('today');
  const [centreFilter, setCentreFilter] = useState<string>(
    user?.role === 'CC' || user?.role === 'VF' ? (activeCentreId || 'all') : 'all'
  );

  const todayStr = '2026-10-27';

  // Filter sessions based on scope and tabs
  const sessions = useMemo(() => {
    return data.sessions.filter((s) => {
      // Centre scope
      if (user?.role === 'CC' || user?.role === 'VF') {
        if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(s.centreId)) {
          return false;
        }
      }
      if (centreFilter !== 'all' && s.centreId !== centreFilter) {
        return false;
      }

      if (tab === 'today') {
        return s.date === todayStr;
      } else if (tab === 'pending') {
        // Pending = past or today session without attendance recorded
        return s.date <= todayStr && !s.attendanceRecorded;
      } else {
        return s.attendanceRecorded;
      }
    });
  }, [data.sessions, user, centreFilter, tab, todayStr]);

  const assignedCentres = useMemo(() => {
    if (user?.role === 'CC' || user?.role === 'VF') {
      return data.centres.filter((c) => user.assignedCentres?.includes(c.id));
    }
    return data.centres;
  }, [data.centres, user]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Attendance Management"
        description="Mark and review senior attendance across Ekta Hub programme sessions (FR-19 – FR-22)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Attendance' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/attendance/corrections">
              <Button variant="outline" size="sm">
                Corrections Queue
              </Button>
            </Link>
            <Link to="/attendance/history">
              <Button variant="outline" size="sm">
                Attendance History
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter and Tab Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-bg-base p-4 rounded border border-border-hairline">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('today')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              tab === 'today'
                ? 'bg-accent text-white'
                : 'bg-bg-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            Today's Sessions ({data.sessions.filter((s) => s.date === todayStr).length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              tab === 'pending'
                ? 'bg-accent text-white'
                : 'bg-bg-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            Pending Attendance
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              tab === 'completed'
                ? 'bg-accent text-white'
                : 'bg-bg-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            Recorded Sessions
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted font-medium">Ekta Hub:</span>
          <select
            value={centreFilter}
            onChange={(e) => setCentreFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Accessible Hubs</option>
            {assignedCentres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions Grid / List */}
      {sessions.length === 0 ? (
        <div className="bg-bg-base border border-border-hairline rounded p-12 text-center space-y-3">
          <Clock className="w-10 h-10 text-text-muted/60 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-text-primary">No sessions found in this view</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            {tab === 'pending'
              ? 'Great job! All past and current sessions for your selected hub have attendance marked.'
              : 'There are no sessions scheduled matching your active hub and tab filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-base font-semibold text-text-primary line-clamp-1">
                    {session.programmeTitle}
                  </h4>
                  {session.attendanceRecorded ? (
                    <StatusChip label="Recorded" variant="active" />
                  ) : (
                    <StatusChip label="Needs Attendance" variant="warning" />
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{session.centreName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{session.date} • {session.startTime} - {session.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>
                      {session.confirmedCount} registered • Capacity: {session.capacity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border-hairline flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {session.walkInCount > 0 && `${session.walkInCount} walk-ins`}
                </span>
                <Link to={`/attendance/session/${session.id}`}>
                  <Button
                    variant={session.attendanceRecorded ? 'outline' : 'primary'}
                    size="sm"
                    className="text-xs"
                  >
                    {session.attendanceRecorded ? 'Review Roster' : 'Mark Attendance'}
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
