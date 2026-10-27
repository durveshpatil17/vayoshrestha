import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckSquare,
  Calendar,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  Table,
  BarChart,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const NmPmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [chartViewMode, setChartViewMode] = useState<'chart' | 'table'>('chart');

  const data = mockStore.getData();
  const totalRegistered = data.seniorCitizens.length;
  const activeMembers = data.seniorCitizens.filter((s) => s.isActive).length;
  const totalAttendanceMarks = data.attendanceRecords.filter((a) => a.status === 'Present').length;
  const uniqueAttendees = new Set(data.attendanceRecords.filter((a) => a.status === 'Present').map((a) => a.memberId)).size;
  const openEscalations = data.escalations.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed').length;
  const openReferrals = data.referrals.filter((r) => r.status !== 'Closed' && r.status !== 'Declined').length;

  // Centre Comparison Data
  const centreStats = data.centres.map((c) => {
    const centreMembers = data.seniorCitizens.filter((s) => s.centreId === c.id);
    const centreActive = centreMembers.filter((s) => s.isActive).length;
    const centreAttendance = data.attendanceRecords.filter((a) => a.centreId === c.id && a.status === 'Present').length;
    return {
      name: c.name.replace('Ekta Hub ', ''),
      registered: centreMembers.length,
      active: centreActive,
      attendance: centreAttendance,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Operations Dashboard"
        description="Vayoshreshtha 90-Day Eldercare Pilot · Macro performance, centre comparison, and action queues."
        breadcrumbs={[{ label: 'Home', to: '/' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/reports/overview')}
          >
            Full Operations Report
          </Button>
        }
      />

      {/* 90-Day Pilot Progress Strip */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-primary">
            90-Day Eldercare Pilot Progress
          </span>
          <span className="text-text-muted font-mono">Day 42 of 90 (46.6% completed)</span>
        </div>
        <div className="w-full h-2 bg-border-hairline rounded-full overflow-hidden flex">
          <div className="h-full bg-accent" style={{ width: '46.6%' }} />
        </div>
        <div className="flex justify-between text-[11px] text-text-muted pt-1">
          <span className="font-semibold text-accent">1. Discovery</span>
          <span className="font-semibold text-accent">2. Configure</span>
          <span className="font-semibold text-accent font-bold">3. Launch (Current)</span>
          <span>4. Scale & Operate</span>
          <span>5. Final Evaluation</span>
        </div>
      </div>

      {/* 9 Canonical Headline KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Total Registered</span>
          <div className="text-xl font-bold font-serif text-text-primary tabular-nums">
            {totalRegistered} <span className="text-xs text-text-muted font-sans font-normal">/ 1,000</span>
          </div>
          <span className="text-[10px] text-success block mt-1">100% of pilot target</span>
        </div>

        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Active Members (30d)</span>
          <div className="text-xl font-bold font-serif text-text-primary tabular-nums">
            {activeMembers}
          </div>
          <span className="text-[10px] text-text-muted block mt-1">Attended in last 30d</span>
        </div>

        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Unique Participants</span>
          <div className="text-xl font-bold font-serif text-text-primary tabular-nums">
            {uniqueAttendees}
          </div>
          <span className="text-[10px] text-text-muted block mt-1">Distinct attendees</span>
        </div>

        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Total Attendance</span>
          <div className="text-xl font-bold font-serif text-text-primary tabular-nums">
            {totalAttendanceMarks}
          </div>
          <span className="text-[10px] text-text-muted block mt-1">Cumulative roll marks</span>
        </div>

        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Open Escalations</span>
          <div className="text-xl font-bold font-serif text-danger tabular-nums">
            {openEscalations}
          </div>
          <span className="text-[10px] text-danger block mt-1">SLA countdown active</span>
        </div>

        <div className="p-3.5 bg-bg-base border border-border-hairline rounded">
          <span className="text-[11px] text-text-muted block mb-1">Active Referrals</span>
          <div className="text-xl font-bold font-serif text-text-primary tabular-nums">
            {openReferrals}
          </div>
          <span className="text-[10px] text-accent block mt-1">External partner care</span>
        </div>
      </div>

      {/* Main Grid: Centre Comparison Chart & "Needs Attention" List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Centre Comparison (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-bg-base border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base font-semibold text-text-primary">
                Ekta Hubs · Registered vs Active Members
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Comparison across the 6 pilot centres in Maharashtra, MP, Rajasthan & UP.
              </p>
            </div>
            <button
              onClick={() => setChartViewMode(chartViewMode === 'chart' ? 'table' : 'chart')}
              className="px-2.5 py-1 text-xs border border-border-hairline rounded bg-bg-subtle hover:bg-bg-active text-text-primary flex items-center gap-1.5"
            >
              {chartViewMode === 'chart' ? <Table className="w-3.5 h-3.5" /> : <BarChart className="w-3.5 h-3.5" />}
              <span>{chartViewMode === 'chart' ? 'View as Table' : 'View as Chart'}</span>
            </button>
          </div>

          {chartViewMode === 'chart' ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={centreStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
                  <XAxis dataKey="name" stroke="#5F5C55" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5F5C55" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E2DC', borderRadius: 6, fontSize: 12 }}
                  />
                  <Bar dataKey="registered" name="Registered" fill="#1F5F4B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Active (30d)" fill="#B7791F" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
              <div className="text-[11px] text-text-muted text-center mt-2">
                * Active = Attended at least one session in last 30 days. Chart categorical colors: Forest Green (#1F5F4B), Ochre (#B7791F).
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-bg-subtle text-text-primary border-b border-border-hairline">
                  <tr>
                    <th className="p-2">Ekta Hub</th>
                    <th className="p-2 text-right">Registered</th>
                    <th className="p-2 text-right">Active (30d)</th>
                    <th className="p-2 text-right">Attendance Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                  {centreStats.map((cs) => (
                    <tr key={cs.name} className="hover:bg-bg-subtle/50">
                      <td className="p-2 font-medium">{cs.name}</td>
                      <td className="p-2 text-right tabular-nums">{cs.registered}</td>
                      <td className="p-2 text-right tabular-nums">{cs.active}</td>
                      <td className="p-2 text-right tabular-nums">{cs.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Needs Attention Queue (1 col) */}
        <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <h3 className="font-serif text-sm font-semibold text-text-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Needs Attention Queue
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warning-bg text-warning font-mono">
              6 Pending
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => navigate('/support/escalations')}
              className="p-2.5 rounded border border-danger/30 bg-danger-bg/30 hover:bg-danger-bg/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-danger font-semibold mb-0.5">
                <span>Immediate Health Escalation</span>
                <span className="font-mono text-[10px]">1h 15m left</span>
              </div>
              <p className="text-text-muted text-[11px]">Bhagwandas Sharma · Chest tightness report via WhatsApp</p>
            </div>

            <div
              onClick={() => navigate('/attendance/corrections')}
              className="p-2.5 rounded border border-warning/30 bg-warning-bg/30 hover:bg-warning-bg/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-warning font-semibold mb-0.5">
                <span>Attendance Correction Review</span>
                <span className="font-mono text-[10px]">2 pending</span>
              </div>
              <p className="text-text-muted text-[11px]">Submitted by Pooja Shinde (Volunteer, Pune)</p>
            </div>

            <div
              onClick={() => navigate('/referrals')}
              className="p-2.5 rounded border border-border-hairline bg-bg-subtle hover:bg-bg-active cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-text-primary font-semibold mb-0.5">
                <span>Referral Stuck &gt;7 Days</span>
                <span className="font-mono text-[10px]">3 cases</span>
              </div>
              <p className="text-text-muted text-[11px]">Pending clinic slot confirmation at Drushti Netralaya</p>
            </div>

            <div
              onClick={() => navigate('/communication/delivery')}
              className="p-2.5 rounded border border-border-hairline bg-bg-subtle hover:bg-bg-active cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-text-primary font-semibold mb-0.5">
                <span>Failed WhatsApp Notifications</span>
                <span className="font-mono text-[10px]">14 failed</span>
              </div>
              <p className="text-text-muted text-[11px]">Due to number unreachability or template rate limit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
