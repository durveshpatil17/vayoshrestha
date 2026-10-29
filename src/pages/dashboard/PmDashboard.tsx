import React from 'react';
import { BarChart3, Users, Calendar, Award, AlertCircle, Clock } from 'lucide-react';
import { KpiTile } from '@/components/ui/KpiTile';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { FieldTelemetryCard } from '@/components/telemetry/FieldTelemetryCard';
import { mockStore } from '@/mock/store';

export const PmDashboard: React.FC = () => {
  const data = mockStore.getData();
  const registeredCount = data.seniorCitizens.filter((s) => s.consentRecorded).length;

  const programmes = [
    { id: 'PROG-01', name: 'Digital Literacy for Elders', chapter: 'Pune Hub', participants: 42, attendanceRate: '92%' },
    { id: 'PROG-02', name: 'Gentle Yoga & Joint Mobility', chapter: 'Bengaluru Hub', participants: 38, attendanceRate: '88%' },
    { id: 'PROG-03', name: 'Nutrition & Diabetes Diet', chapter: 'Nashik Hub', participants: 29, attendanceRate: '85%' },
    { id: 'PROG-04', name: 'Mindfulness & Meditation', chapter: 'Mysuru Hub', participants: 31, attendanceRate: '90%' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programme management console"
        subtitle="Organisation-wide programme delivery, session schedules, and partner operations"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/programmes/new">
              <Button variant="primary">New programme</Button>
            </Link>
          </div>
        }
      />

      {/* Exactly 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Registered seniors"
          value={registeredCount}
          unit="/ 1,000"
          statusLine="Target cohort progress"
          status="positive"
        />
        <KpiTile
          title="Active programmes"
          value="24"
          statusLine="Across 9 Ekta Hub chapters"
          status="positive"
        />
        <KpiTile
          title="Attendance rate"
          value="88.7%"
          statusLine="Target > 80% achieved"
          status="positive"
        />
        <KpiTile
          title="Volunteer coverage"
          value="94.2%"
          statusLine="Active field gig coverage"
          status="positive"
        />
      </div>

      {/* Key-Value Operational Stats */}
      <Card
        title="Operational metrics"
        subtitle="Programme cohorts, completed hours, and upcoming hub events"
        padding="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
          <div>
            <div className="text-xs text-text-secondary">Active learning cohorts</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">18 cohorts</div>
            <div className="text-xs text-text-secondary mt-0.5">Across all 4 thematic pillars</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Completed contact hours</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">1,480 hrs</div>
            <div className="text-xs text-text-secondary mt-0.5">Accumulated during 90-day pilot</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Upcoming community events</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">12 scheduled</div>
            <div className="text-xs text-text-secondary mt-0.5">In next 7 calendar days</div>
          </div>
        </div>
      </Card>

      {/* Field Telemetry Card */}
      <FieldTelemetryCard />

      {/* Programme Performance Table */}
      <Card title="Active programmes" subtitle="Recent hub session delivery and engagement" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-subtle border-b border-border text-xs text-text-secondary">
              <tr>
                <th className="px-4 py-2.5">Programme</th>
                <th className="px-4 py-2.5">Chapter</th>
                <th className="px-4 py-2.5 text-right">Participants</th>
                <th className="px-4 py-2.5 text-right">Attendance</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text">
              {programmes.map((p) => (
                <tr key={p.id} className="h-12 hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.chapter}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.participants}</td>
                  <td className="px-4 py-3 text-right font-semibold text-positive tabular-nums">{p.attendanceRate}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/programmes/${p.id}`} className="text-xs font-semibold text-accent hover:underline">
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Needs Attention (Row List, NOT Tiles) */}
      <Card title="Needs attention" subtitle="Actionable items requiring programme oversight">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-control bg-negative-tint border border-border">
            <AlertCircle className="w-4 h-4 text-negative mt-0.5 shrink-0 stroke-[1.5]" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text">3 sessions have unsubmitted attendance</div>
              <p className="text-xs text-text-secondary mt-0.5">
                Attendance rosters for Pune Hub (Digital Literacy) and Nashik Hub (Yoga for Elders) are overdue by &gt;48 hours.
              </p>
            </div>
            <Link to="/attendance/corrections">
              <Button size="sm" variant="outline">Review</Button>
            </Link>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-control bg-critical-tint border border-border">
            <Clock className="w-4 h-4 text-critical mt-0.5 shrink-0 stroke-[1.5]" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text">2 new programmes awaiting approval</div>
              <p className="text-xs text-text-secondary mt-0.5">
                Bengaluru Hub has submitted "Ayurveda Wellness Basics" and "Kannada Literature Reading" for approval.
              </p>
            </div>
            <Link to="/programmes">
              <Button size="sm" variant="outline">View queue</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
