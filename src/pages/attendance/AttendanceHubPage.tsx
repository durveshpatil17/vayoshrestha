import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';

export const AttendanceHubPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const sessions = data.programmeSessions || [];

  const pendingAttendance = sessions.filter((s) => s.attendanceStatus === 'Pending_Attendance');
  const recentCompleted = sessions.filter((s) => s.attendanceStatus === 'Completed');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance management"
        subtitle="Record session attendance, manage walk-in elders, and process correction requests"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/attendance/corrections">
              <Button variant="outline">Attendance corrections</Button>
            </Link>
            <Link to="/attendance/history">
              <Button variant="outline">Attendance history</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Sessions needing attendance</span>
          <span className="text-2xl font-semibold text-critical tabular-nums">{pendingAttendance.length || 1}</span>
          <span className="text-xs text-text-secondary block mt-1">Requires volunteer or coordinator sign-off</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Completed sessions this week</span>
          <span className="text-2xl font-semibold text-positive tabular-nums">12</span>
          <span className="text-xs text-text-secondary block mt-1">Rosters safely locked</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Pending correction requests</span>
          <span className="text-2xl font-semibold text-text tabular-nums">2</span>
          <span className="text-xs text-text-secondary block mt-1">Awaiting NM maker-checker review</span>
        </div>
      </div>

      <Card title="Sessions awaiting attendance roster submission">
        <div className="divide-y divide-[var(--border-subtle)]">
          {pendingAttendance.length > 0 ? (
            pendingAttendance.map((sess) => (
              <div key={sess.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text font-sans">{sess.title}</h3>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {sess.programmeName} • Chapter: {sess.chapterName} • Facilitator: {sess.instructorName}
                  </div>
                  <div className="text-xs text-critical font-semibold mt-1 flex items-center gap-1">
                    <Clock size={12} /> Auto-locks in 14 hours 20 mins
                  </div>
                </div>
                <Link to={`/attendance/session/${sess.id}`}>
                  <Button variant="primary" size="sm" icon={<ClipboardCheck size={14} />}>
                    Open roster
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-text-secondary">
              All recent session attendance rosters are fully submitted.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

