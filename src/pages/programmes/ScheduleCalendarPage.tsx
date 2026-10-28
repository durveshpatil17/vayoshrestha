import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';

export const ScheduleCalendarPage: React.FC = () => {
  const data = mockStore.getData();
  const sessions = data.programmeSessions || [];

  const [selectedHub, setSelectedHub] = useState('ALL');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const filteredSessions = sessions.filter((s) => {
    if (selectedHub !== 'ALL' && s.chapterId !== selectedHub) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule & session calendar"
        subtitle="Weekly and monthly timetable of active elder sessions across Ekta Hubs"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week view
            </Button>
            <Button
              variant={viewMode === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month view
            </Button>
          </div>
        }
      />

      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
        searchPlaceholder="Search schedule..."
        filters={[
          {
            key: 'hub',
            label: 'Ekta Hub',
            value: selectedHub,
            onChange: setSelectedHub,
            options: [
              { label: 'All chapters', value: 'ALL' },
              { label: 'Pune Hub (HUB-PUN)', value: 'HUB-PUN' },
              { label: 'Nashik Hub (HUB-NSK)', value: 'HUB-NSK' },
              { label: 'Bengaluru Hub (HUB-BLR)', value: 'HUB-BLR' },
            ],
          },
        ]}
      />

      <Card title="Current week: 26 Oct – 01 Nov 2026">
        <div className="divide-y divide-[var(--border-subtle)]">
          {filteredSessions.map((sess) => {
            const dateObj = new Date(sess.dateTime);
            const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
            const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={sess.id} className="py-4 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 text-center p-2 rounded bg-[var(--surface-subtle)] border border-[var(--border)] shrink-0">
                    <span className="text-xs font-semibold text-[var(--accent)] block">
                      {dateObj.toLocaleDateString('en-IN', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-semibold text-[var(--text)] tabular-nums block">
                      {dateObj.getDate()}
                    </span>
                  </div>

                  <div>
                    <Link to={`/sessions/${sess.id}`} className="text-base font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                      {sess.title}
                    </Link>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {timeStr} ({sess.durationMinutes} min)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {sess.chapterName} — {sess.location}
                      </span>
                      <span>Facilitator: <strong>{sess.instructorName}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-[var(--text-secondary)] block">Enrolled / Cap</span>
                    <span className="text-sm font-semibold text-[var(--text)] tabular-nums">
                      {sess.enrolledCount} / {sess.capacity}
                    </span>
                  </div>
                  <StatusChip
                    label={sess.attendanceStatus.replace('_', ' ')}
                    status={sess.attendanceStatus === 'Completed' ? 'active' : 'info'}
                  />
                  <Link to={`/sessions/${sess.id}`}>
                    <Button size="sm" variant="outline">Session</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

