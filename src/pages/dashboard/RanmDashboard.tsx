import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import {
  AlertOctagon,
  Users,
  Clock,
  Pill,
  ChevronRight,
  ExternalLink,
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
      {/* 1. Live Critical Alert Strip (Cloudscape Flashbar style) */}
      {openSos.length > 0 && (
        <div
          role="alert"
          className="bg-negative-tint border border-negative rounded-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-negative"
        >
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-negative shrink-0" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-text">
                  Active emergency alert ({openSos.length} open)
                </span>
                <span className="px-2 py-0.5 bg-surface border border-negative text-negative rounded-chip text-xs tabular-nums">
                  SLA target &lt; 2 min
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Immediate regional attention required. Auto-escalation chain active.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => navigate('/sos')}
            className="text-xs shrink-0"
          >
            Open Live SOS Board
          </Button>
        </div>
      )}

      {/* 2. Page Header (Fiori Dynamic Page Header) */}
      <PageHeader
        title={isNM ? 'Executive Command Portal' : 'Regional Operations Portal'}
        description={
          isNM
            ? 'Vayoh Vikas · 90-day pilot operations (1,000 seniors target, 9 regional chapters)'
            : `Regional oversight: ${user?.regionId || 'Assigned Region'} · SLA compliance and chapter monitoring`
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/reports/pilot')}
            >
              Pilot Outcome Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/approvals')}
            >
              Approvals ({pendingApprovals.length})
            </Button>
          </div>
        }
      />

      {/* 3. 90-Day Pilot Timeline */}
      <Card padding="md">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text">
              Pilot target progress: 1,000 senior citizens
            </span>
            <span className="text-accent font-semibold tabular-nums">
              {registeredCount} / 1,000 ({Math.round((registeredCount / 1000) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-surface-subtle h-2 rounded-control overflow-hidden border border-border-subtle">
            <div
              className="bg-accent h-full rounded-control transition-all duration-500"
              style={{ width: `${Math.min(100, (registeredCount / 1000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Day 42 of 90-day controlled pilot</span>
            <span>Target: 1,000 onboarded seniors with emergency contacts</span>
          </div>
        </div>
      </Card>

      {/* 4. Exactly 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Registered seniors"
          value={registeredCount}
          unit="/ 1,000"
          statusLine="Target cohort progress"
          status="positive"
        />
        <KpiTile
          title="Open SOS alerts"
          value={openSos.length}
          statusLine={openSos.length === 0 ? 'No open emergencies' : 'Active emergency SLA active'}
          status={openSos.length === 0 ? 'positive' : 'negative'}
        />
        <KpiTile
          title="Median acknowledge time"
          value="1.2"
          unit="min"
          statusLine="Within < 2.0 min SLA target"
          status="positive"
        />
        <KpiTile
          title="Medication confirmation rate"
          value="81.4%"
          statusLine="Target > 75.0% met"
          status="positive"
        />
      </div>

      {/* 5. Cloudscape Key-Value List for Remaining Measures */}
      <Card
        title="Operational metrics"
        subtitle="Secondary indicators monitored by the regional leadership console"
        padding="md"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
          <div>
            <div className="text-xs text-text-secondary">Active seniors (14-day)</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">{activeCount}</div>
            <div className="text-xs text-text-secondary mt-0.5">Responded within 14 days</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Reminders delivered today</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">842</div>
            <div className="text-xs text-text-secondary mt-0.5">Pushed via WhatsApp at 08:00</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Open anomaly flags</div>
            <div className="text-xl font-semibold text-critical tabular-nums mt-1">{openFlags.length}</div>
            <div className="text-xs text-text-secondary mt-0.5">Vital readings awaiting follow-up</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Stalled onboardings</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">38</div>
            <div className="text-xs text-text-secondary mt-0.5">Consent pending verification</div>
          </div>
        </div>
      </Card>

      {/* 6. Needs Attention (Row List, NOT Tiles) */}
      <Card
        title="Needs attention"
        subtitle="Priority operational items requiring action or review"
        padding="none"
      >
        <div className="divide-y divide-border">
          {/* Item 1: Open SOS */}
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={openSos.length > 0 ? 'negative' : 'positive'}
                label={openSos.length > 0 ? 'Critical' : 'Normal'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {openSos.length > 0
                    ? `${openSos.length} open SOS alert(s) awaiting resolution in your region`
                    : 'No open emergencies in your region'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Regional response queue · Updated live
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Live</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/sos')}
              >
                Inspect Board
              </Button>
            </div>
          </div>

          {/* Item 2: Anomaly Flags */}
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={openFlags.length > 0 ? 'critical' : 'positive'}
                label={openFlags.length > 0 ? 'Warning' : 'Normal'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {openFlags.length > 0
                    ? `${openFlags.length} senior vital reading(s) in high-risk band awaiting check-in`
                    : 'No pending vital anomaly flags'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Care manager wellness follow-up queue
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Today</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/health/flags')}
              >
                Work Anomaly Queue
              </Button>
            </div>
          </div>

          {/* Item 3: Approvals */}
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={pendingApprovals.length > 0 ? 'informative' : 'positive'}
                label={pendingApprovals.length > 0 ? 'Review' : 'Approved'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {pendingApprovals.length > 0
                    ? `${pendingApprovals.length} operational rule update(s) awaiting sign-off`
                    : 'All operational configuration versions are approved'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Maker-checker governance protocol
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Pending</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/approvals')}
              >
                Review Approvals
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 7. Chapter Comparison Table (Cloudscape Data Table pattern) */}
      <Card padding="none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Chapter hub performance breakdown
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Comparative cohort metrics across all regional operating hubs
            </p>
          </div>
          <span className="text-xs text-text-secondary tabular-nums">
            {scopedChapters.length} active hubs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold h-10">
                <th className="py-2 px-4">Chapter hub</th>
                <th className="py-2 px-4">City / Region</th>
                <th className="py-2 px-4 text-right">Registered</th>
                <th className="py-2 px-4 text-right">Medication adherence</th>
                <th className="py-2 px-4 text-right">Open SOS</th>
                <th className="py-2 px-4 text-right">Open flags</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scopedChapters.map((ch, idx) => {
                const chSeniors = scopedSeniors.filter((s) => s.chapterId === ch.id);
                const chSos = openSos.filter((e) => e.chapterId === ch.id);
                const chFlags = openFlags.filter((f) => f.chapterId === ch.id);

                return (
                  <tr
                    key={ch.id}
                    className="h-12 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-2 px-4">
                      <span className="font-semibold text-text block">{ch.name}</span>
                      <span className="text-[11px] text-text-secondary">{ch.id}</span>
                    </td>
                    <td className="py-2 px-4 text-text-secondary">
                      {ch.city} ({ch.regionId})
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums font-medium text-text">
                      {chSeniors.length}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums text-accent font-semibold">
                      {78 + (idx % 8)}%
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums">
                      {chSos.length > 0 ? (
                        <span className="text-negative font-semibold">{chSos.length}</span>
                      ) : (
                        <span className="text-text-secondary">0</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums">
                      {chFlags.length > 0 ? (
                        <span className="text-critical font-semibold">{chFlags.length}</span>
                      ) : (
                        <span className="text-text-secondary">0</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/seniors?chapter=${ch.id}`)}
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
      </Card>
    </div>
  );
};
