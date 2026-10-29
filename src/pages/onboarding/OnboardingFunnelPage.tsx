import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { KpiTile } from '@/components/ui/KpiTile';
import {
  UserPlus,
  Send,
  Filter,
  CheckCircle2,
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
    { step: 1, name: 'Welcome & declaration', count: totalStarted, pct: 100 },
    { step: 2, name: 'Full name entry', count: totalStarted - 15, pct: 98.5 },
    { step: 3, name: 'Language preference', count: totalStarted - 42, pct: 96.2 },
    { step: 4, name: 'Emergency contact (NOK)', count: totalStarted - 98, pct: 91.8 },
    { step: 5, name: 'ABHA structure (Phase 2)', count: totalStarted - 145, pct: 87.9 },
    { step: 6, name: 'Medication schedule', count: totalStarted - 180, pct: 85.0 },
    { step: 7, name: 'Onboarding completed', count: totalRegistered, pct: Math.round((totalRegistered / totalStarted) * 100) },
  ];

  const handleNudge = (sessionPhone: string, seniorName?: string) => {
    setNudgeSuccessToast(`WhatsApp onboarding nudge dispatched to ${seniorName || sessionPhone}.`);
    setTimeout(() => setNudgeSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Senior citizen onboarding funnel"
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
              View bot script
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4 stroke-[1.5]" />}
              onClick={() => navigate('/onboarding/new')}
            >
              Assisted onboarding
            </Button>
          </div>
        }
      />

      {nudgeSuccessToast && (
        <div className="p-3 bg-positive-tint border border-positive/30 text-positive rounded-control text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
            <span>{nudgeSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setNudgeSuccessToast(null)}
            className="text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Overview Strip (Exactly 4 Headline Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Pilot onboarding target"
          value="1,000"
          statusLine="Fixed 90-day pilot cohort"
          status="positive"
        />
        <KpiTile
          title="Completed registrations"
          value={totalRegistered}
          statusLine="100% of pilot target reached"
          status="positive"
        />
        <KpiTile
          title="Stalled in funnel"
          value={totalStalled}
          statusLine="Incomplete applicant sessions"
          status={totalStalled > 0 ? 'critical' : 'positive'}
        />
        <KpiTile
          title="Funnel completion rate"
          value={`${Math.round((totalRegistered / totalStarted) * 100)}%`}
          statusLine="Started to fully onboarded"
          status="positive"
        />
      </div>

      {/* Visual 7-Step Funnel */}
      <div className="bg-surface border border-border rounded-container p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">WhatsApp onboarding conversion funnel</h2>
            <p className="text-xs text-text-secondary mt-0.5">Step-by-step conversion from welcome greeting to issued membership card.</p>
          </div>
          {user?.role !== 'CM' && user?.role !== 'VF' && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-text-secondary stroke-[1.5]" />
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="text-xs bg-surface border border-border rounded-control px-2.5 py-1 text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All chapters</option>
                {data.chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {funnelSteps.map((s, idx) => (
            <div key={s.step} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-surface-subtle text-text-secondary flex items-center justify-center text-xs font-semibold shrink-0 border border-border">
                {s.step}
              </div>
              <div className="w-52 text-xs font-semibold text-text truncate shrink-0">
                {s.name}
              </div>
              <div className="flex-1 bg-surface-subtle h-6 rounded-control overflow-hidden relative border border-border">
                <div
                  className="bg-accent h-full transition-all duration-500 rounded-l"
                  style={{ width: `${s.pct}%` }}
                />
                <span className="absolute left-3 top-1 text-xs font-semibold text-white mix-blend-difference tabular-nums">
                  {s.count.toLocaleString()} applicants ({s.pct}%)
                </span>
              </div>
              <div className="w-16 text-right text-xs tabular-nums text-text-secondary shrink-0">
                {idx > 0 ? `-${funnelSteps[idx - 1].count - s.count}` : '100%'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stalled Applicants Table */}
      <div className="bg-surface border border-border rounded-container overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">Stalled applicants ({filteredStalled.length})</h2>
            <p className="text-xs text-text-secondary mt-0.5">Seniors who started the WhatsApp bot flow but have not completed all required steps.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-normal">
                <th className="px-4 py-3">Applicant & mobile</th>
                <th className="px-4 py-3">Assigned chapter</th>
                <th className="px-4 py-3">Stalled step</th>
                <th className="px-4 py-3">Inactivity duration</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredStalled.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    Zero stalled applicants in this scope. All applicants have completed onboarding.
                  </td>
                </tr>
              ) : (
                filteredStalled.map((row) => (
                  <tr key={row.id} className="hover:bg-page transition-colors">
                    <td className="px-4 py-3 font-semibold text-text">
                      <div>{row.seniorName || 'Anonymous applicant'}</div>
                      <div className="text-xs text-text-secondary tabular-nums font-normal">{row.seniorPhone || row.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-text">
                      {row.chapterId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control bg-critical-tint text-text font-semibold text-xs border border-critical/30">
                        Step {row.currentStep}: {ONBOARDING_STEP_NAMES[row.currentStep] || row.stepName || 'Verification'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums">
                      {row.stalledDays} days ago
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNudge(row.seniorPhone || row.phoneNumber || '', row.seniorName)}
                          className="text-xs gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 stroke-[1.5]" />
                          Nudge
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/onboarding/new')}
                          className="text-xs"
                        >
                          Assist
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
