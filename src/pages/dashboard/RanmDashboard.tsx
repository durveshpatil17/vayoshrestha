import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Users,
  Activity,
  HeartPulse,
  Pill,
  Clock,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

export const RanmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isNM = user?.role === 'NM';
  const isRA = user?.role === 'RA';

  // Scope filtering
  const scopedChapters = data.chapters.filter((c) => {
    if (isRA && c.regionId !== user?.regionId) return false;
    return true;
  });

  const scopedSeniors = data.seniorCitizens.filter((s) => {
    if (isRA) {
      const ch = data.chapters.find((c) => c.id === s.chapterId);
      if (ch && ch.regionId !== user?.regionId) return false;
    }
    return true;
  });

  const scopedSos = data.sosEvents.filter((ev) => {
    if (isRA) {
      const ch = data.chapters.find((c) => c.id === ev.chapterId);
      if (ch && ch.regionId !== user?.regionId) return false;
    }
    return true;
  });

  const openSos = scopedSos.filter(
    (e) => e.status === 'TRIGGERED' || e.status === 'ACKNOWLEDGED' || e.status === 'RESPONDED'
  );

  const scopedFlags = data.healthFlags.filter((f) => {
    if (isRA) {
      const ch = data.chapters.find((c) => c.id === f.chapterId);
      if (ch && ch.regionId !== user?.regionId) return false;
    }
    return true;
  });

  const openFlags = scopedFlags.filter((f) => f.status === 'NEW' || f.status === 'CALL_ASSIGNED');

  const pendingApprovals = [
    data.sosSettings.approvalStatus === 'PENDING_APPROVAL' ? 'SOS Settings Update' : null,
    data.thresholdConfig.approvalStatus === 'PENDING_APPROVAL' ? 'Vital Threshold Rules' : null,
  ].filter(Boolean);

  // Registered vs 1,000 Target
  const registeredCount = scopedSeniors.filter((s) => s.consentRecorded).length;
  const activeCount = Math.round(registeredCount * 0.88);

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Live Critical Alert Strip */}
      {openSos.length > 0 && (
        <div className="bg-danger text-white rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-danger-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide uppercase">
                  Active Emergency Alert ({openSos.length} open)
                </span>
                <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[11px] font-mono">
                  SLA Target &lt; 2 min
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5">
                Immediate regional attention required. Auto-escalation chain active.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos')}
            className="bg-white text-danger hover:bg-white/90 font-bold border-transparent text-xs"
          >
            Open Live SOS Board
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={isNM ? 'Executive Command Portal (NGO Management)' : 'Regional Operations Portal'}
          description={
            isNM
              ? 'Vayoh Vikas · 90-Day Pilot Operations (1,000 Seniors target, 9 Regional Chapters)'
              : `Regional Oversight: ${user?.regionId || 'Assigned Region'} · SLA Compliance & Chapter Monitoring`
          }
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports/pilot')}
            className="text-xs"
          >
            Pilot Outcome Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/approvals')}
            className="text-xs gap-1"
          >
            Approvals ({pendingApprovals.length})
          </Button>
        </div>
      </div>

      {/* 90-Day Pilot Progress Bar */}
      <div className="bg-white border border-border-hairline rounded p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-text-primary">
            Pilot Target Progress: 1,000 Senior Citizens
          </span>
          <span className="font-mono text-accent font-bold">
            {registeredCount} / 1,000 ({Math.round((registeredCount / 1000) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-border-hairline">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (registeredCount / 1000) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-text-muted">
          <span>Day 42 of 90-Day Controlled Pilot</span>
          <span>Target: 1,000 Onboarded Seniors with Emergency Contacts</span>
        </div>
      </div>

      {/* 8-KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Registered */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Registered Seniors</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {registeredCount}
          </div>
          <span className="text-[10px] text-accent">Consent & NOK recorded</span>
        </div>

        {/* Active */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Active (14-Day)</span>
          <div className="text-2xl font-bold font-mono text-success mt-1">{activeCount}</div>
          <span className="text-[10px] text-text-muted">Responded within 14d</span>
        </div>

        {/* Open SOS */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Open SOS Alerts</span>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              openSos.length > 0 ? 'text-danger' : 'text-text-primary'
            }`}
          >
            {openSos.length}
          </div>
          <span className="text-[10px] text-text-muted">Sub-second queue sync</span>
        </div>

        {/* Median Ack Time */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Median Ack Time</span>
          <div className="text-2xl font-bold font-mono text-accent mt-1">1.2 min</div>
          <span className="text-[10px] text-success">Within &lt; 2 min SLA</span>
        </div>

        {/* Reminders Today */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">08:00 Reminders Today</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">842</div>
          <span className="text-[10px] text-text-muted">Pushed via WhatsApp</span>
        </div>

        {/* Medication Confirmation */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Med. Confirmation</span>
          <div className="text-2xl font-bold font-mono text-accent mt-1">81.4%</div>
          <span className="text-[10px] text-success">Target &gt; 75% met</span>
        </div>

        {/* Open Anomaly Flags */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Open Anomaly Flags</span>
          <div className="text-2xl font-bold font-mono text-warning mt-1">
            {openFlags.length}
          </div>
          <span className="text-[10px] text-text-muted">High BP / Glucose</span>
        </div>

        {/* Stalled Onboardings */}
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Stalled Onboardings</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">38</div>
          <span className="text-[10px] text-text-muted">Funnel drop-offs</span>
        </div>
      </div>

      {/* Needs Attention & Action Items */}
      <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
        <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Immediate Action Required
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Unacknowledged SOS */}
          <div className="p-3 bg-surface-subtle border border-border-hairline rounded space-y-1">
            <span className="font-bold text-text-primary block">Emergency Alerts</span>
            <p className="text-text-muted">
              {openSos.length > 0
                ? `${openSos.length} open SOS alerts in your region awaiting resolution.`
                : 'All SOS alerts are currently acknowledged and resolved.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/sos')}
              className="mt-2 text-xs h-7"
            >
              Inspect Board
            </Button>
          </div>

          {/* Anomaly Check-in Calls */}
          <div className="p-3 bg-surface-subtle border border-border-hairline rounded space-y-1">
            <span className="font-bold text-text-primary block">Wellness Outreach Calls</span>
            <p className="text-text-muted">
              {openFlags.length} senior vital readings in high-risk bands awaiting CM check-in.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/health/flags')}
              className="mt-2 text-xs h-7"
            >
              Work Anomaly Queue
            </Button>
          </div>

          {/* Maker-Checker Approvals */}
          <div className="p-3 bg-surface-subtle border border-border-hairline rounded space-y-1">
            <span className="font-bold text-text-primary block">Maker-Checker Governance</span>
            <p className="text-text-muted">
              {pendingApprovals.length > 0
                ? `${pendingApprovals.length} operational rule updates awaiting NGO sign-off.`
                : 'All configuration versions are approved.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/approvals')}
              className="mt-2 text-xs h-7"
            >
              Review Approvals
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter Comparison Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary">
            Chapter Hub Performance Breakdown
          </h3>
          <span className="text-xs text-text-muted">{scopedChapters.length} active hubs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Chapter Hub</th>
                <th className="py-2.5 px-4">City / Region</th>
                <th className="py-2.5 px-4">Registered Seniors</th>
                <th className="py-2.5 px-4">Medication Adherence</th>
                <th className="py-2.5 px-4">Open SOS</th>
                <th className="py-2.5 px-4">Open Flags</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {scopedChapters.map((ch, idx) => {
                const chSeniors = scopedSeniors.filter((s) => s.chapterId === ch.id);
                const chSos = openSos.filter((e) => e.chapterId === ch.id);
                const chFlags = openFlags.filter((f) => f.chapterId === ch.id);

                return (
                  <tr key={ch.id} className="hover:bg-surface-subtle">
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-text-primary block">{ch.name}</span>
                      <span className="text-[11px] font-mono text-text-muted">{ch.id}</span>
                    </td>
                    <td className="py-2.5 px-4 text-text-muted">
                      {ch.city} ({ch.regionId})
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium">{chSeniors.length}</td>
                    <td className="py-2.5 px-4 font-mono text-accent font-bold">
                      {78 + (idx % 8)}%
                    </td>
                    <td className="py-2.5 px-4">
                      {chSos.length > 0 ? (
                        <span className="font-mono text-danger font-bold">{chSos.length}</span>
                      ) : (
                        <span className="text-text-muted">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {chFlags.length > 0 ? (
                        <span className="font-mono text-warning font-bold">{chFlags.length}</span>
                      ) : (
                        <span className="text-text-muted">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/seniors?chapter=${ch.id}`)}
                        className="text-xs px-2 py-0.5 h-6"
                      >
                        Seniors
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
