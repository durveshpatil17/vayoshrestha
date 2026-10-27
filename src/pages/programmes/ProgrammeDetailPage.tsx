import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import {
  Calendar,
  Users,
  CheckSquare,
  Clock,
  Star,
  Edit,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const prog = data.programmes.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<'details' | 'sessions' | 'registrations' | 'attendance' | 'feedback' | 'visibility'>('details');
  const [isPublished, setIsPublished] = useState(prog?.status === 'Ongoing');

  if (!prog) {
    return <div className="p-12 text-center text-xs text-text-muted">Programme not found.</div>;
  }

  const sessions = data.sessions.filter((s) => s.programmeId === prog.id);
  const completedSessions = sessions.filter((s) => s.attendanceRecorded);

  const togglePublish = () => {
    setIsPublished(!isPublished);
    mockStore.updateData((draft) => {
      const p = draft.programmes.find((x) => x.id === prog.id);
      if (p) {
        p.status = !isPublished ? 'Ongoing' : 'Draft';
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Programme Manager',
      user?.role || 'PM',
      'UPDATE',
      'Programme',
      prog.id,
      !isPublished ? 'Published programme to senior catalog' : 'Unpublished programme to Draft'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={prog.title}
        description={`Category: ${prog.category} · Eligibility: ${prog.eligibility} · Capacity: ${prog.capacityPerSession} per session.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Programmes', to: '/programmes' },
          { label: prog.title },
        ]}
        statusBadge={
          <StatusChip
            label={isPublished ? 'Published & Active' : 'Draft (Hidden from Seniors)'}
            variant={isPublished ? 'active' : 'neutral'}
          />
        }
        primaryAction={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onClick={togglePublish}
            >
              {isPublished ? 'Unpublish' : 'Publish to Senior Portal'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/programmes/${prog.id}/edit`)}
            >
              Edit Programme
            </Button>
          </div>
        }
      />

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Scheduled Sessions</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {sessions.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Across 6 Ekta Hubs</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Completed Rolls</span>
          <div className="text-2xl font-bold font-serif text-success tabular-nums">
            {completedSessions.length}
          </div>
          <span className="text-[11px] text-success block mt-1">Attendance recorded</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Session Capacity</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {prog.capacityPerSession}
          </div>
          <span className="text-[11px] text-accent block mt-1">Seats / session</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Satisfaction Rating</span>
          <div className="text-2xl font-bold font-serif text-warning tabular-nums">
            4.8 ★
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Based on 124 reviews</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-hairline gap-6 text-xs font-medium overflow-x-auto">
        {[
          { key: 'details', label: 'Curriculum & Rules' },
          { key: 'sessions', label: `Scheduled Sessions (${sessions.length})` },
          { key: 'registrations', label: 'Capacity & Waitlist' },
          { key: 'feedback', label: 'Elder Feedback' },
          { key: 'visibility', label: 'Publish & Visibility (FR-15)' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2.5 border-b-2 -mb-[1px] whitespace-nowrap ${
              activeTab === t.key
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Details */}
      {activeTab === 'details' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4 text-xs">
          <h3 className="font-serif text-base font-semibold text-text-primary">
            Curriculum & Elder Safety Guidelines
          </h3>
          <p className="text-text-muted leading-relaxed max-w-2xl">{prog.description}</p>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-hairline">
            <div>
              <span className="text-text-muted block mb-0.5">Eligibility:</span>
              <span className="font-semibold text-text-primary">{prog.eligibility}</span>
            </div>
            <div>
              <span className="text-text-muted block mb-0.5">Walk-in Policy:</span>
              <span className="font-semibold text-text-primary">
                {prog.walkInsAllowed ? 'Permitted up to maximum room capacity' : 'Pre-booking strictly mandatory'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sessions */}
      {activeTab === 'sessions' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <h3 className="font-serif text-sm font-semibold text-text-primary">
              Session Calendar ({sessions.length})
            </h3>
          </div>

          <div className="divide-y divide-border-hairline text-xs">
            {sessions.slice(0, 10).map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{s.date} · {s.startTime} - {s.endTime}</div>
                  <div className="text-[11px] text-text-muted">Ekta Hub: {s.centreName} · Enrolled: {s.confirmedCount} / {s.capacity}</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusChip
                    label={s.attendanceRecorded ? 'Attendance Recorded' : 'Scheduled'}
                    variant={s.attendanceRecorded ? 'active' : 'neutral'}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/sessions/${s.id}`)}
                  >
                    Session Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Visibility (FR-15) */}
      {activeTab === 'visibility' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4 text-xs">
          <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
            Senior Citizen Visibility Settings (FR-15)
          </h3>
          <p className="text-text-muted leading-relaxed">
            When published, this programme appears in the Senior Citizen browse portal (`/me/programmes`) and is bookable through the simulated WhatsApp bot.
          </p>
          <div className="flex items-center justify-between p-4 bg-bg-subtle rounded border border-border-hairline">
            <div>
              <div className="font-semibold text-text-primary">Current Catalog Visibility</div>
              <div className="text-[11px] text-text-muted">
                {isPublished ? 'Visible to registered elders across assigned hubs' : 'Hidden from senior catalog'}
              </div>
            </div>
            <Button
              variant={isPublished ? 'danger' : 'primary'}
              size="sm"
              onClick={togglePublish}
            >
              {isPublished ? 'Unpublish from Portal' : 'Publish to Senior Portal'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
