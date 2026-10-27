import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { Building2, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react';

export const CentresProgrammesReportPage: React.FC = () => {
  const data = mockStore.getData();
  const [tab, setTab] = useState<'centres' | 'programmes'>('centres');

  const centreMetrics = data.centres.map((c) => {
    const centreMembers = data.seniorCitizens.filter((s) => s.centreId === c.id);
    const centreActive = centreMembers.filter((s) => s.isActive).length;
    const centreSessions = data.sessions.filter((s) => s.centreId === c.id);
    const centreAttendance = data.attendanceRecords.filter((r) => r.centreId === c.id && r.status === 'Present').length;

    return {
      id: c.id,
      name: c.name,
      code: c.code,
      city: c.city,
      members: centreMembers.length,
      activeRate: centreMembers.length > 0 ? Math.round((centreActive / centreMembers.length) * 100) : 0,
      sessions: centreSessions.length,
      attendance: centreAttendance,
    };
  });

  const programmeMetrics = data.programmes.map((p) => {
    const progSessions = data.sessions.filter((s) => s.programmeId === p.id);
    const progRegistrations = data.sessionRegistrations.filter((r) =>
      progSessions.some((s) => s.id === r.sessionId)
    );
    const confirmedCount = progRegistrations.filter((r) => r.status === 'Confirmed' || r.status === 'Attended').length;

    return {
      id: p.id,
      title: p.title,
      category: p.category,
      sessionsCount: progSessions.length,
      registrations: confirmedCount,
      capacity: p.capacityPerSession,
      status: p.status,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Centres & Programmes Performance"
        description="Fidelity, capacity utilization, and attendance tracking across all 6 Ekta Hubs and 24 structured programmes (FR-44)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Centres & Programmes' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border-hairline gap-6">
        <button
          onClick={() => setTab('centres')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'centres'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Ekta Hub Centre Comparisons (6)
        </button>
        <button
          onClick={() => setTab('programmes')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'programmes'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Programme Performance Breakdown (24)
        </button>
      </div>

      {tab === 'centres' ? (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
              <tr>
                <th className="py-3 px-4">Centre Code</th>
                <th className="py-3 px-4">Ekta Hub Name</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Registered Members</th>
                <th className="py-3 px-4">Active Engagement Rate</th>
                <th className="py-3 px-4">Total Sessions Held</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
              {centreMetrics.map((c) => (
                <tr key={c.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-mono font-medium">{c.code}</td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{c.name}</td>
                  <td className="py-3.5 px-4 text-text-muted">{c.city}</td>
                  <td className="py-3.5 px-4 font-semibold">{c.members}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-accent">{c.activeRate}% active</span>
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{c.sessions} sessions</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/centres/${c.id}`} className="text-accent font-semibold hover:underline">
                      Drill-down →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
              <tr>
                <th className="py-3 px-4">Programme Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sessions Held</th>
                <th className="py-3 px-4">Confirmed Bookings</th>
                <th className="py-3 px-4">Session Capacity</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
              {programmeMetrics.map((p) => (
                <tr key={p.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-medium">
                    <Link to={`/programmes/${p.id}`} className="text-text-primary hover:text-accent underline decoration-dotted">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{p.category}</td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary">{p.sessionsCount}</td>
                  <td className="py-3.5 px-4 font-semibold text-accent">{p.registrations}</td>
                  <td className="py-3.5 px-4 text-text-muted">{p.capacity} elders</td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusChip label={p.status} variant={p.status === 'Published' ? 'active' : 'neutral'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
