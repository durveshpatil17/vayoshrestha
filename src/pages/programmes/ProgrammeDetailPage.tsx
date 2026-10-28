import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Users, Building2, CheckCircle2, Clock, Star, Plus } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';

export const ProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const programme = data.programmes.find((p) => p.id === id) || data.programmes[0];
  const [activeTab, setActiveTab] = useState<'details' | 'sessions' | 'registrations' | 'attendance' | 'feedback' | 'publish'>('details');
  const [published, setPublished] = useState(programme?.status === 'Active');

  if (!programme) {
    return (
      <div className="p-8 text-center">
        <h2>Programme not found</h2>
        <Link to="/programmes">Back to programmes</Link>
      </div>
    );
  }

  const sessions = (data.programmeSessions || []).filter((s) => s.programmeId === programme.id);
  const feedbackList = (data.feedbackRecords || []).filter((f) => f.programmeId === programme.id);

  const canEdit = user?.role === 'SA' || user?.role === 'NM' || user?.role === 'PM' || user?.role === 'RA';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/programmes" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Programmes
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{programme.name}</span>
      </div>

      <PageHeader
        title={programme.name}
        subtitle={`${programme.category} • Code: ${programme.code} • ${programme.enrolledCount} enrolled elders`}
        actions={
          <div className="flex items-center gap-3">
            <StatusChip label={programme.status} status={programme.status === 'Active' ? 'active' : 'info'} />
            {canEdit && (
              <Link to={`/programmes/${programme.id}/edit`}>
                <Button variant="outline" size="sm" icon={<Edit size={14} />}>
                  Edit
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* 6 Tabs */}
      <div className="border-b border-[var(--border)] flex gap-6 overflow-x-auto">
        {[
          { key: 'details', label: 'Details' },
          { key: 'sessions', label: `Sessions (${sessions.length})` },
          { key: 'registrations', label: `Registrations (${programme.enrolledCount})` },
          { key: 'attendance', label: 'Attendance summary' },
          { key: 'feedback', label: `Feedback summary (${feedbackList.length})` },
          { key: 'publish', label: 'Publication & governance' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title="Programme description & pedagogy">
              <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
                {programme.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[var(--text-secondary)] block">Target elder demographic</span>
                  <span className="text-sm font-semibold text-[var(--text)]">{programme.targetAudience}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">Participating chapters</span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {programme.chapterIds?.join(', ') || 'Pune, Nashik, Bengaluru'}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Key performance indicators">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded bg-[var(--surface-subtle)]">
                  <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">{programme.enrolledCount}</span>
                  <span className="text-xs text-[var(--text-secondary)] block mt-1">Total registered elders</span>
                </div>
                <div className="p-4 rounded bg-[var(--surface-subtle)]">
                  <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">92%</span>
                  <span className="text-xs text-[var(--text-secondary)] block mt-1">Average retention rate</span>
                </div>
                <div className="p-4 rounded bg-[var(--surface-subtle)]">
                  <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">{programme.sessionsCount}</span>
                  <span className="text-xs text-[var(--text-secondary)] block mt-1">Sessions conducted</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Programme governance">
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--text-secondary)] block">Lead Coordinator</span>
                  <span className="text-sm font-semibold text-[var(--text)]">Priya Menon (Programme Manager)</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">Curriculum approval</span>
                  <span className="text-sm font-semibold text-[var(--positive)]">Approved by NGO Management (NM)</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">Created date</span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {new Date(programme.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Sessions */}
      {activeTab === 'sessions' && (
        <Card
          title="Scheduled sessions"
          action={
            <Link to="/schedule">
              <Button size="sm" variant="outline" icon={<Calendar size={14} />}>
                View calendar
              </Button>
            </Link>
          }
        >
          <div className="divide-y divide-[var(--border-subtle)]">
            {sessions.map((sess) => (
              <div key={sess.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/sessions/${sess.id}`} className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                    {sess.title}
                  </Link>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {new Date(sess.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} • {sess.location} • Facilitator: {sess.instructorName}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                    {sess.enrolledCount}/{sess.capacity} enrolled
                  </span>
                  <StatusChip
                    label={sess.attendanceStatus.replace('_', ' ')}
                    status={sess.attendanceStatus === 'Completed' ? 'active' : 'info'}
                  />
                  <Link to={`/sessions/${sess.id}`}>
                    <Button size="sm" variant="outline">View session</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Registrations */}
      {activeTab === 'registrations' && (
        <Card title="Enrolled elders list">
          <div className="divide-y divide-[var(--border-subtle)] text-sm">
            {[
              { id: 'SEN-001', name: 'Kamala Devi', age: 72, chapter: 'Pune Hub', enrolledAt: '12 Aug 2026', attendance: '88%' },
              { id: 'SEN-002', name: 'Ramesh Kulkarni', age: 78, chapter: 'Pune Hub', enrolledAt: '15 Aug 2026', attendance: '94%' },
              { id: 'SEN-003', name: 'Shantaram Deshpande', age: 81, chapter: 'Nashik Hub', enrolledAt: '01 Sep 2026', attendance: '75%' },
              { id: 'SEN-004', name: 'Sulabha Joshi', age: 69, chapter: 'Pune Hub', enrolledAt: '10 Sep 2026', attendance: '100%' },
            ].map((reg) => (
              <div key={reg.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/seniors/${reg.id}`} className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
                    {reg.name} ({reg.age}y)
                  </Link>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    ID: <span className="tabular-nums">{reg.id}</span> • Chapter: {reg.chapter} • Registered: {reg.enrolledAt}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--text-secondary)] block">Attendance</span>
                  <span className="text-sm font-semibold text-[var(--positive)] tabular-nums">{reg.attendance}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Attendance summary */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <Card title="Attendance performance & lock compliance">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Overall presence rate</span>
                <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">91.4%</span>
              </div>
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Walk-in attendees</span>
                <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">14</span>
              </div>
              <div className="p-4 rounded bg-[var(--surface-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] block">Attendance lock SLA compliance</span>
                <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">98.2%</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-[var(--text-secondary)]">Rosters auto-lock 24 hours after session completion.</span>
              <Link to="/attendance/history">
                <Button variant="outline" size="sm">Attendance heatmap</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Feedback summary */}
      {activeTab === 'feedback' && (
        <Card title="Participant elder reviews">
          <div className="space-y-4">
            {feedbackList.length > 0 ? (
              feedbackList.map((fb) => (
                <div key={fb.id} className="p-4 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[var(--text)]">{fb.seniorName || 'Anonymous Elder'}</span>
                    <span className="text-xs text-[var(--positive)] font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {fb.rating} / 5 ({fb.satisfactionCategory})
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{fb.feedbackText}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)] py-4 text-center">
                Average satisfaction across 42 survey responses: <strong>4.8 / 5.0</strong>
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tab 6: Publish */}
      {activeTab === 'publish' && (
        <Card title="Programme publication status">
          <div className="space-y-4 max-w-xl">
            <p className="text-sm text-[var(--text-secondary)]">
              When published, this programme appears in the chapter schedules, field volunteer rosters, and senior citizen portals across all assigned Ekta Hubs.
            </p>
            <div className="flex items-center justify-between p-4 rounded bg-[var(--surface-subtle)] border border-[var(--border)]">
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">Publish to Member Ecosystem</div>
                <div className="text-xs text-[var(--text-secondary)]">Currently: {published ? 'Published (Live)' : 'Draft / Unpublished'}</div>
              </div>
              <Button
                variant={published ? 'destructive' : 'primary'}
                onClick={() => setPublished(!published)}
              >
                {published ? 'Unpublish' : 'Publish live'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

