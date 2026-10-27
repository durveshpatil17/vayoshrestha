import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import {
  Building2,
  Calendar,
  Users,
  Edit,
  Clock,
  MapPin,
  CheckCircle2,
  UserCheck,
  TrendingDown,
} from 'lucide-react';

export const CentreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const centre = data.centres.find((c) => c.id === id);

  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'staff' | 'programmes' | 'metrics' | 'members'>('overview');

  if (!centre) {
    return <div className="p-12 text-center text-xs text-text-muted">Ekta Hub not found.</div>;
  }

  const hubMembers = data.seniorCitizens.filter((m) => m.centreId === centre.id);
  const activeMembers = hubMembers.filter((m) => m.isActive);
  const dropOffMembers = hubMembers.filter((m) => !m.isActive).slice(0, 5);
  const hubSessions = data.sessions.filter((s) => s.centreId === centre.id);
  const hubProgrammes = data.programmes.filter((p) => p.assignedCentres.includes(centre.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title={centre.name}
        description={`Hub Code: ${centre.code} · ${centre.address}, ${centre.city}, ${centre.state} · Seating Capacity: ${centre.seatingCapacity}.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Centres', to: '/centres' },
          { label: centre.name },
        ]}
        statusBadge={<StatusChip label={centre.status} variant="active" />}
        primaryAction={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/centres/${centre.id}/edit`)}
            >
              Edit Hub Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/members/new')}
            >
              Register Elder Here
            </Button>
          </div>
        }
      />

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Registered Elders</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {hubMembers.length}
          </div>
          <span className="text-[11px] text-accent block mt-1">Local enrolment</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Active Elders (30d)</span>
          <div className="text-2xl font-bold font-serif text-success tabular-nums">
            {activeMembers.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">
            {hubMembers.length > 0 ? Math.round((activeMembers.length / hubMembers.length) * 100) : 0}% active rate
          </span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Active Programmes</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {hubProgrammes.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Structured activities</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Total Sessions</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {hubSessions.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Conducted & scheduled</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-hairline gap-6 text-xs font-medium overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview & Facilities' },
          { key: 'schedule', label: `Scheduled Sessions (${hubSessions.length})` },
          { key: 'staff', label: 'Coordinators & Staff (FR-11)' },
          { key: 'programmes', label: `Programmes (${hubProgrammes.length})` },
          { key: 'metrics', label: 'Participation & Drop-offs (FR-13)' },
          { key: 'members', label: `Enrolled Elders (${hubMembers.length})` },
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
            <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
              Centre Specifications
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-text-muted block">Coordinator</span>
                <span className="font-semibold text-text-primary">{centre.contactPerson}</span>
              </div>
              <div>
                <span className="text-text-muted block">Helpline</span>
                <span className="font-mono font-semibold text-text-primary">{centre.contactPhone}</span>
              </div>
              <div>
                <span className="text-text-muted block">Operating Hours</span>
                <span className="font-semibold text-text-primary">{centre.operatingSchedule}</span>
              </div>
              <div>
                <span className="text-text-muted block">Hall Capacity</span>
                <span className="font-semibold text-text-primary">{centre.seatingCapacity} seats</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
            <h3 className="font-serif text-sm font-semibold text-text-primary pb-2 border-b border-border-hairline">
              Accessibility & Elder Amenities
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {centre.facilities.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-bg-subtle text-text-primary border border-border-hairline text-[11px] font-medium"
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Staff (FR-11) */}
      {activeTab === 'staff' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <h3 className="font-serif text-sm font-semibold text-text-primary">
              Assigned Field Staff & Volunteers
            </h3>
            <span className="text-text-muted">Effective for 90-Day Pilot</span>
          </div>

          <div className="divide-y divide-border-hairline">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">{centre.contactPerson}</div>
                <div className="text-text-muted text-[11px]">Centre Coordinator (CC) · Assigned Hub Head</div>
              </div>
              <StatusChip label="Primary Coordinator" variant="active" />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">Pooja Shinde</div>
                <div className="text-text-muted text-[11px]">Field Volunteer (VF) · Daily Attendance & Assisted Intake</div>
              </div>
              <StatusChip label="Active Field Staff" variant="neutral" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Participation & Drop-Offs (FR-13) */}
      {activeTab === 'metrics' && (
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <div>
              <h3 className="font-serif text-sm font-semibold text-text-primary flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-warning" />
                Elder Drop-off Warning List (Inactive &gt;30 Days)
              </h3>
              <p className="text-text-muted text-[11px]">Seniors requiring compassionate volunteer welfare check-in.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/follow-ups')}>
              Create Welfare Tasks
            </Button>
          </div>

          <div className="divide-y divide-border-hairline">
            {dropOffMembers.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{m.fullName} ({m.membershipId})</div>
                  <div className="text-text-muted text-[11px]">
                    Last attended: &gt;35 days ago · Emergency: {m.emergencyContactName} ({m.emergencyContactPhone})
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/members/${m.id}`)}>
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
