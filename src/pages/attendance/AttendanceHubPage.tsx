import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';
import { NavTabBar } from '@/ui/NavTabBar';
import { AttendanceCorrectionsPage } from './AttendanceCorrectionsPage';
import { AttendanceHistoryPage } from './AttendanceHistoryPage';

export const AttendanceHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'today';
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const sessions = data.programmeSessions || [];

  const pendingAttendance = sessions.filter((s) => s.attendanceStatus === 'Pending_Attendance');
  const recentCompleted = sessions.filter((s) => s.attendanceStatus === 'Completed');

  const tabs = [
    {
      key: 'today',
      label: 'Session rosters',
      badge: pendingAttendance.length || 1,
      icon: <ClipboardCheck className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'corrections',
      label: 'Corrections',
      badge: 2,
      icon: <RefreshCw className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'history',
      label: 'Attendance history',
      icon: <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance Management Hub"
        description="Record session attendance, manage walk-in elders, and process maker-checker corrections"
      />

      <NavTabBar tabs={tabs} defaultTab="today" />

      {currentTab === 'today' && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Sessions needing attendance</span>
              <span className="text-2xl font-semibold text-critical tabular-nums">{pendingAttendance.length || 1}</span>
              <span className="text-xs text-text-secondary block mt-1">Requires volunteer or coordinator sign-off</span>
            </div>
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Completed sessions this week</span>
              <span className="text-2xl font-semibold text-positive tabular-nums">12</span>
              <span className="text-xs text-text-secondary block mt-1">Rosters safely locked</span>
            </div>
            <div className="p-4 rounded-container bg-surface border border-border">
              <span className="text-xs text-text-secondary block">Pending correction requests</span>
              <span className="text-2xl font-semibold text-text tabular-nums">2</span>
              <span className="text-xs text-text-secondary block mt-1">Awaiting NM maker-checker review</span>
            </div>
          </div>

          <Card title="Sessions awaiting attendance roster submission">
            <div className="divide-y divide-border-subtle">
              {pendingAttendance.length > 0 ? (
                pendingAttendance.map((sess) => (
                  <div key={sess.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-text font-sans">{sess.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-text-secondary mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
                          {sess.dateTime ? new Date(sess.dateTime).toLocaleDateString('en-IN') : 'Scheduled'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
                          {sess.durationMinutes} mins
                        </span>
                        <span>Capacity: {sess.enrolledCount || 0} / {sess.capacity}</span>
                      </div>
                    </div>
                    <Link to={`/attendance/session/${sess.id}`}>
                      <Button variant="primary" size="sm">
                        Record attendance
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-text-secondary">
                  No sessions pending attendance submission.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {currentTab === 'corrections' && <AttendanceCorrectionsPage />}
      {currentTab === 'history' && <AttendanceHistoryPage />}
    </div>
  );
};
