import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { MessageStrip } from '@/components/ui/MessageStrip';
import {
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

export const SaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();

  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const lockedUsers = data.users.filter(
    (u) => (u as any).lockoutUntil && new Date((u as any).lockoutUntil) > new Date()
  ).length;

  const failedFallbacks = data.smsFallbackRecords.filter((r) => r.status === 'FAILED').length;
  const recentAudit = data.auditEvents.slice(0, 6);

  // Measure localStorage quota
  const storageBytes = encodeURI(JSON.stringify(data)).length;
  const storageKb = Math.round(storageBytes / 1024);

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to canonical pilot seed state?')) {
      mockStore.resetToDefault();
      setResetFeedback('Synthetic demo data successfully restored to canonical v2 seed.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* 1. Reset Feedback */}
      {resetFeedback && (
        <MessageStrip
          type="positive"
          message={resetFeedback}
          onDismiss={() => setResetFeedback(null)}
        />
      )}

      {/* 2. Privacy Boundary Notice */}
      <MessageStrip
        type="informative"
        message="System administrator clinical boundary: Organisation-wide control is limited to user identity, RBAC rules, telemetry, and cryptographic audit hash chains. In strict compliance with data minimisation laws, personal senior health logs and vital readings are inaccessible to this role."
      />

      {/* 3. Page Header */}
      <PageHeader
        title="System Administration and Infrastructure Health"
        description="In-browser event queue telemetry, mock gateway connectivity, security lockout control, and storage quotas."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/integrations')}
            >
              Integration Monitor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              className="gap-1.5 text-negative hover:bg-negative-tint border-border"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
              Reset Demo Data
            </Button>
          </div>
        }
      />

      {/* 4. Exactly 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="In-browser queue latency"
          value="210"
          unit="ms"
          statusLine="BroadcastChannel active"
          status="positive"
        />
        <KpiTile
          title="Gateway connectivity"
          value="100%"
          statusLine="All mock webhooks operational"
          status="positive"
        />
        <KpiTile
          title="Security lockouts"
          value={lockedUsers}
          statusLine={lockedUsers === 0 ? 'Zero locked accounts' : 'Accounts currently in lockout'}
          status={lockedUsers === 0 ? 'positive' : 'critical'}
        />
        <KpiTile
          title="Storage quota consumed"
          value={storageKb}
          unit="KB"
          statusLine="< 5 MB browser quota"
          status="positive"
        />
      </div>

      {/* 5. Needs Attention Row List */}
      <Card
        title="Needs attention"
        subtitle="System infrastructure alerts requiring administrative inspection"
        padding="none"
      >
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={failedFallbacks > 0 ? 'critical' : 'positive'}
                label={failedFallbacks > 0 ? 'Warning' : 'Normal'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {failedFallbacks > 0
                    ? `${failedFallbacks} failed cellular SMS fallback transmission(s)`
                    : 'All cellular SMS fallbacks successfully dispatched'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Cellular fallback carrier simulation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Live</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/integrations')}
              >
                Inspect Gateways
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 6. Recent Audit Events Table */}
      <Card padding="none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Recent security and operational audit events
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Append-only tamper-evident audit trail entries
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/audit-logs')}
            className="gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold h-10">
                <th className="py-2 px-4">Timestamp (IST)</th>
                <th className="py-2 px-4">Actor</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Action</th>
                <th className="py-2 px-4">Entity</th>
                <th className="py-2 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentAudit.map((ev) => (
                <tr
                  key={ev.id}
                  className="h-12 hover:bg-surface-hover transition-colors"
                >
                  <td className="py-2 px-4 tabular-nums text-text-secondary">
                    {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </td>
                  <td className="py-2 px-4 tabular-nums text-text font-medium">{ev.actorId}</td>
                  <td className="py-2 px-4">
                    <span className="px-1.5 py-0.5 bg-surface-subtle border border-border rounded-chip text-[11px] text-text font-medium">
                      {ev.actorRole}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-semibold text-text">{ev.action}</td>
                  <td className="py-2 px-4 tabular-nums text-[11px] text-text-secondary">
                    {ev.entityType} ({ev.entityId})
                  </td>
                  <td className="py-2 px-4 text-text-secondary max-w-xs truncate">{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
