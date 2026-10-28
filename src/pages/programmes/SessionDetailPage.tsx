import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, CheckCircle, Calendar, Plus, UserPlus } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';

export const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const session = data.programmeSessions.find((s) => s.id === id) || data.programmeSessions[0];

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h2>Session not found</h2>
        <Link to="/schedule">Back to schedule</Link>
      </div>
    );
  }

  const attendance = (data.attendanceRecords || []).filter((a) => a.sessionId === session.id);
  const dateObj = new Date(session.dateTime);

  const canMark = user?.role === 'CM' || user?.role === 'VF' || user?.role === 'CT' || user?.role === 'SA' || user?.role === 'NM';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/schedule" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Schedule
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{session.title}</span>
      </div>

      <PageHeader
        title={session.title}
        subtitle={`${session.programmeName} • ${session.chapterName}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusChip
              label={session.attendanceStatus.replace('_', ' ')}
              status={session.attendanceStatus === 'Completed' ? 'active' : 'info'}
            />
            {canMark && (
              <Link to={`/attendance/session/${session.id}`}>
                <Button variant="primary" icon={<CheckCircle size={16} />}>
                  Mark attendance
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Session logistics & venue">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Date & Time</span>
                <span className="font-semibold text-[var(--text)]">
                  {dateObj.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                </span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Duration</span>
                <span className="font-semibold text-[var(--text)]">{session.durationMinutes} minutes</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Location & Room</span>
                <span className="font-semibold text-[var(--text)]">{session.location}</span>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Lead facilitator</span>
                <span className="font-semibold text-[var(--text)]">{session.instructorName}</span>
              </div>
            </div>
          </Card>

          <Card title={`Enrolled participants (${attendance.length || session.enrolledCount})`}>
            <div className="divide-y divide-[var(--border-subtle)] text-sm">
              {[
                { id: 'SEN-001', name: 'Kamala Devi', status: 'Present' },
                { id: 'SEN-002', name: 'Ramesh Kulkarni', status: 'Present' },
                { id: 'SEN-003', name: 'Shantaram Deshpande', status: 'Absent' },
                { id: 'SEN-004', name: 'Sulabha Joshi', status: 'Walk_in' },
              ].map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[var(--text)]">{p.name}</span>
                    <span className="text-xs text-[var(--text-secondary)] ml-2 tabular-nums">({p.id})</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      p.status === 'Present'
                        ? 'bg-[var(--positive-tint)] text-[var(--positive)]'
                        : p.status === 'Walk_in'
                        ? 'bg-[var(--surface-selected)] text-[var(--accent)]'
                        : 'bg-[var(--negative-tint)] text-[var(--negative)]'
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Capacity & Attendance lock">
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded bg-[var(--surface-subtle)] text-center">
                <span className="text-xs text-[var(--text-secondary)] block">Total capacity</span>
                <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">{session.capacity}</span>
                <div className="text-xs text-[var(--text-tertiary)] mt-1">
                  {session.capacity - session.enrolledCount} open spots remaining
                </div>
              </div>

              <div className="p-3.5 rounded border border-[var(--border)] text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text)] block mb-1">24-hour Auto-Lock</span>
                Attendance rosters auto-lock 24 hours after completion. Corrections require Maker-Checker NM approval.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
