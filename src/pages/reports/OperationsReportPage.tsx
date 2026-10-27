import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Table, LayoutGrid, Calendar, BookOpen, Download } from 'lucide-react';

export const OperationsReportPage: React.FC = () => {
  const data = mockStore.getData();
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const registeredTotal = data.seniorCitizens.length;
  const activeTotal = data.seniorCitizens.filter((s) => s.isActive).length;
  const totalAttendanceMarks = data.attendanceRecords.filter((r) => r.status === 'Present').length;
  const uniqueAttendees = new Set(data.attendanceRecords.filter((r) => r.status === 'Present').map((r) => r.memberId)).size;

  const totalSessions = data.sessions.length;
  const recordedSessions = data.sessions.filter((s) => s.attendanceRecorded).length;
  const recordedRate = totalSessions > 0 ? Math.round((recordedSessions / totalSessions) * 100) : 0;

  // Centre-wise attendance data
  const centreData = data.centres.map((c) => {
    const centreRecords = data.attendanceRecords.filter((r) => r.centreId === c.id && r.status === 'Present');
    const unique = new Set(centreRecords.map((r) => r.memberId)).size;
    return {
      name: c.code,
      fullName: c.name,
      totalAttendance: centreRecords.length,
      uniqueParticipants: unique,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Operations & Management Overview"
        description="Comprehensive 90-day pilot indicators: capacity, registration milestones, and participation fidelity (FR-43)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Overview' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/reports/definitions">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-1.5" />
                View Metric Definitions
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Registered Senior Citizens</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{registeredTotal}</div>
          <div className="text-xs text-text-muted mt-0.5">Target: 1,000 (100% achieved)</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Active Seniors (Last 30 Days)</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">{activeTotal}</div>
          <div className="text-xs text-text-muted mt-0.5">
            {Math.round((activeTotal / registeredTotal) * 100)}% active engagement rate
          </div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Attendance Marks</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{totalAttendanceMarks}</div>
          <div className="text-xs text-text-muted mt-0.5">Cumulative session turnouts</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Unique Participants</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{uniqueAttendees}</div>
          <div className="text-xs text-text-muted mt-0.5">Distinct individuals attended</div>
        </div>
      </div>

      {/* 90-Day Pilot Phase Progression */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-text-primary">
          <span>90-Day Pilot Progression (August – October 2026)</span>
          <span className="text-accent font-mono">Day 88 of 90 (Review Phase)</span>
        </div>
        <div className="w-full bg-bg-subtle h-2.5 rounded-full overflow-hidden flex">
          <div className="bg-[#1F5F4B] h-full" style={{ width: '97%' }} />
        </div>
        <div className="flex justify-between text-[11px] text-text-muted pt-1">
          <span>Phase 1: Discovery</span>
          <span>Phase 2: Configuration</span>
          <span>Phase 3: Launch</span>
          <span>Phase 4: Operations</span>
          <span className="font-semibold text-text-primary">Phase 5: Review & Evaluation</span>
        </div>
      </div>

      {/* Centre Comparison Chart / Table */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <div>
            <h3 className="font-serif text-base font-semibold text-text-primary">
              Centre-Wise Participation Comparison
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Comparing Total Attendance Marks vs Distinct Unique Participants across 6 Ekta Hubs
            </p>
          </div>

          <div className="flex items-center border border-border-hairline rounded overflow-hidden">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 text-xs ${viewMode === 'chart' ? 'bg-accent text-white' : 'bg-bg-base text-text-muted'}`}
              title="Chart View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 text-xs ${viewMode === 'table' ? 'bg-accent text-white' : 'bg-bg-base text-text-muted'}`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'chart' ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centreData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
                <XAxis dataKey="name" stroke="#5F5C55" tick={{ fontSize: 12 }} />
                <YAxis stroke="#5F5C55" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [val, 'Count']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E2DC', fontSize: '12px' }}
                />
                <Bar dataKey="totalAttendance" fill="#1F5F4B" name="Total Attendance Marks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="uniqueParticipants" fill="#B7791F" name="Unique Participants" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-subtle text-text-muted font-medium border-b border-border-hairline">
              <tr>
                <th className="py-2.5 px-4">Centre Code</th>
                <th className="py-2.5 px-4">Ekta Hub Name</th>
                <th className="py-2.5 px-4">Total Attendance Marks</th>
                <th className="py-2.5 px-4">Unique Participants</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary">
              {centreData.map((c) => (
                <tr key={c.name} className="hover:bg-bg-subtle/50">
                  <td className="py-2.5 px-4 font-mono font-medium">{c.name}</td>
                  <td className="py-2.5 px-4 font-medium">{c.fullName}</td>
                  <td className="py-2.5 px-4 font-semibold text-text-primary">{c.totalAttendance}</td>
                  <td className="py-2.5 px-4 font-semibold text-accent">{c.uniqueParticipants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="text-[11px] text-text-muted pt-2 border-t border-border-hairline italic">
          <strong>Measurement Principle (Section 1):</strong> Total Attendance counts every physical session presence mark.
          Unique Participants counts distinct individual senior citizens. Never conflated in charts or reporting indicators.
        </div>
      </div>
    </div>
  );
};
