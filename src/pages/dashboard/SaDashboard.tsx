import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Server,
  Radio,
  Clock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  HardDrive,
  Users,
  AlertTriangle,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="System Administration & Infrastructure Health"
          description="In-browser event queue telemetry, mock gateway connectivity, security lockout control, and storage quotas."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/integrations')}
            className="text-xs"
          >
            Integration Monitor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="text-xs gap-1.5 text-danger border-danger/30 hover:bg-danger-surface"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </Button>
        </div>
      </div>

      {resetFeedback && (
        <div className="p-3 bg-success-surface border border-success/30 rounded text-xs text-success">
          {resetFeedback}
        </div>
      )}

      {/* Non-Clinical Role Isolation Notice */}
      <div className="p-4 bg-surface-subtle border-l-4 border-accent rounded text-xs text-text-primary flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-accent block">
            System Administrator Scope & Clinical Privacy Boundary
          </span>
          <span className="text-text-muted">
            The System Administrator (SA) role exercises organisation-wide control over user
            accounts, role permissions, integrations, and cryptographic audit hash chains. In strict
            accordance with data minimisation mandates, <strong>SA is denied all access</strong> to
            personal senior health logs, vital readings, and clinical threshold records.
          </span>
        </div>
      </div>

      {/* 4 Infrastructure Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">In-Browser Queue</span>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <div className="text-base font-bold text-text-primary">BroadcastChannel Active</div>
          <span className="text-[11px] text-accent font-mono mt-1 block">
            Measured Latency: 140–280 ms
          </span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">WhatsApp Gateway Mock</span>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <div className="text-base font-bold text-text-primary">Cloud API Simulator</div>
          <span className="text-[11px] text-text-muted mt-1 block">Webhook Signature Verified</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Cellular SMS Gateway</span>
            <span
              className={`w-2 h-2 rounded-full ${
                failedFallbacks > 0 ? 'bg-warning' : 'bg-success'
              }`}
            />
          </div>
          <div className="text-base font-bold text-text-primary">DLT Carrier Mock</div>
          <span className="text-[11px] text-text-muted mt-1 block">
            {failedFallbacks} failed dispatches ({data.smsFallbackRecords.length} total)
          </span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Browser Storage Quota</span>
            <HardDrive className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="text-base font-bold text-text-primary">{storageKb} KB Used</div>
          <span className="text-[11px] text-text-muted mt-1 block">
            Key: vayoshrestha_store_v2 (&lt; 5MB quota)
          </span>
        </div>
      </div>

      {/* Security & Audit Events Stream */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Recent Security & Operational Audit Events
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/audit-logs')}
            className="text-xs gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Timestamp (IST)</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {recentAudit.map((ev) => (
                <tr key={ev.id} className="hover:bg-surface-subtle">
                  <td className="py-2.5 px-4 font-mono text-text-muted">
                    {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </td>
                  <td className="py-2.5 px-4 font-mono">{ev.actorId}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-1.5 py-0.2 bg-surface-subtle border border-border-hairline rounded text-[10px] font-mono">
                      {ev.actorRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-text-primary">{ev.action}</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-text-muted">
                    {ev.entityType} ({ev.entityId})
                  </td>
                  <td className="py-2.5 px-4 text-text-muted max-w-xs truncate">{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
