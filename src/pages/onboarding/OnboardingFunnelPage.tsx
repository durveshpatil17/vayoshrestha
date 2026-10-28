import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Users,
  UserPlus,
  Send,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { ONBOARDING_STEP_NAMES } from '@/domain/onboarding';

export const OnboardingFunnelPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [nudgeSuccessToast, setNudgeSuccessToast] = useState<string | null>(null);

  // Scope filter: if CM or VF, lock to assigned chapter
  const effectiveChapter =
    user?.role === 'CM' || user?.role === 'VF'
      ? user.assignedChapter || user.assignedCentres[0]
      : selectedChapter;

  const filteredStalled = data.stalledSessions.filter((s) => {
    if (effectiveChapter !== 'all' && s.chapterId !== effectiveChapter) return false;
    return true;
  });

  const totalRegistered = data.seniorCitizens.length;
  const totalStalled = filteredStalled.length;
  const totalStarted = totalRegistered + totalStalled;

  // Compute funnel drop-offs per step (1 to 7)
  const funnelSteps = [
    { step: 1, name: 'Welcome & Declaration', count: totalStarted, pct: 100 },
    { step: 2, name: 'Full Name Entry', count: totalStarted - 15, pct: 98.5 },
    { step: 3, name: 'Language Preference', count: totalStarted - 42, pct: 96.2 },
    { step: 4, name: 'Emergency Contact (NOK)', count: totalStarted - 98, pct: 91.8 },
    { step: 5, name: 'ABHA Structure (Phase 2)', count: totalStarted - 145, pct: 87.9 },
    { step: 6, name: 'Medication Schedule', count: totalStarted - 180, pct: 85.0 },
    { step: 7, name: 'Onboarding Completed', count: totalRegistered, pct: Math.round((totalRegistered / totalStarted) * 100) },
  ];

  const handleNudge = (sessionPhone: string, seniorName?: string) => {
    setNudgeSuccessToast(`WhatsApp onboarding nudge dispatched to ${seniorName || sessionPhone}.`);
    setTimeout(() => setNudgeSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Senior Citizen Onboarding Funnel"
        description="Monitor WhatsApp self-onboarding progression, identify stalled applicants, and dispatch assisted volunteer outreach."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Onboarding' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/onboarding/script')}
            >
              View Bot Script
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/onboarding/new')}
            >
              Assisted Onboarding
            </Button>
          </div>
        }
      />

      {nudgeSuccessToast && (
        <div className="p-3 bg-success-bg border border-success/30 text-success rounded text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{nudgeSuccessToast}</span>
          </div>
          <button onClick={() => setNudgeSuccessToast(null)} className="text-xs font-semibold">&times;</button>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted font-medium">Pilot Onboarding Target</div>
          <div className="text-2xl font-semibold text-text-primary mt-1">1,000</div>
          <div className="text-[11px] text-text-muted mt-0.5">Fixed 90-day pilot cohort</div>
        </div>
        <div className="bg-white border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted font-medium">Completed Registrations</div>
          <div className="text-2xl font-semibold text-accent mt-1 tabular-nums">{totalRegistered}</div>
          <div className="text-[11px] text-success mt-0.5">100% of pilot target reached</div>
        </div>
        <div className="bg-white border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted font-medium">Stalled in Funnel</div>
          <div className="text-2xl font-semibold text-warning mt-1 tabular-nums">{totalStalled}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Incomplete applicant sessions</div>
        </div>
        <div className="bg-white border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted font-medium">Funnel Completion Rate</div>
          <div className="text-2xl font-semibold text-text-primary mt-1 tabular-nums">
            {Math.round((totalRegistered / totalStarted) * 100)}%
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Started to fully onboarded</div>
        </div>
      </div>

      {/* Visual 7-Step Funnel */}
      <div className="bg-white border border-border-hairline rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">WhatsApp Onboarding Conversion Funnel</h2>
            <p className="text-xs text-text-muted">Step-by-step conversion from welcome greeting to issued membership card.</p>
          </div>
          {user?.role !== 'CM' && user?.role !== 'VF' && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-text-muted" />
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="text-xs bg-bg-subtle border border-border-hairline rounded px-2.5 py-1 text-text-primary"
              >
                <option value="all">All Chapters</option>
                {data.chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {funnelSteps.map((s, idx) => (
            <div key={s.step} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-bg-subtle text-text-muted flex items-center justify-center text-xs font-semibold shrink-0 border border-border-hairline">
                {s.step}
              </div>
              <div className="w-48 text-xs font-medium text-text-primary truncate shrink-0">
                {s.name}
              </div>
              <div className="flex-1 bg-bg-subtle h-6 rounded overflow-hidden relative border border-border-hairline">
                <div
                  className="bg-accent h-full transition-all duration-500 rounded-l"
                  style={{ width: `${s.pct}%` }}
                />
                <span className="absolute left-3 top-1 text-[11px] font-semibold text-white mix-blend-difference tabular-nums">
                  {s.count.toLocaleString()} applicants ({s.pct}%)
                </span>
              </div>
              <div className="w-16 text-right text-xs tabular-nums text-text-muted shrink-0">
                {idx > 0 ? `-${funnelSteps[idx - 1].count - s.count}` : '100%'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stalled Applicants Table */}
      <div className="bg-white border border-border-hairline rounded">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Stalled Applicants ({filteredStalled.length})</h2>
            <p className="text-xs text-text-muted">Seniors who started the WhatsApp bot flow but have not completed all required steps.</p>
          </div>
          <span className="text-xs text-text-muted">Filtered by chapter: <strong className="text-text-primary">{effectiveChapter}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-subtle text-text-muted font-semibold border-b border-border-hairline">
              <tr>
                <th className="px-4 py-2.5">Applicant / Phone</th>
                <th className="px-4 py-2.5">Chapter</th>
                <th className="px-4 py-2.5">Stalled At Step</th>
                <th className="px-4 py-2.5">Days Inactive</th>
                <th className="px-4 py-2.5">Nudges Sent</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredStalled.slice(0, 15).map((row) => (
                <tr key={row.id} className="hover:bg-bg-subtle/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>{row.seniorName || 'Unknown Elder'}</div>
                    <div className="text-[11px] text-text-muted tabular-nums">{row.seniorPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{row.chapterId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-warning-bg text-warning font-medium text-[11px]">
                      <AlertCircle className="w-3 h-3" />
                      Step {row.currentStep}: {row.stepName}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-text-muted tabular-nums">
                    {row.stalledDays} days ago
                  </td>
                  <td className="px-4 py-3 text-text-muted tabular-nums">
                    {row.nudgeCount} sent
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleNudge(row.seniorPhone || row.phoneNumber || '', row.seniorName || 'Senior')}
                      className="px-2.5 py-1 text-xs font-medium text-accent bg-accent-tint/30 hover:bg-accent-tint rounded transition-colors"
                      title="Send WhatsApp polite reminder"
                    >
                      <Send className="w-3 h-3 inline mr-1" />
                      Send Nudge
                    </button>
                    <button
                      onClick={() => navigate('/onboarding/new')}
                      className="px-2.5 py-1 text-xs font-medium text-text-primary bg-bg-subtle hover:bg-bg-active border border-border-hairline rounded transition-colors"
                      title="Complete registration on behalf of senior"
                    >
                      Assisted
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
