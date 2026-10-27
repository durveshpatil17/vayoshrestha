import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Shield,
  Server,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Users,
} from 'lucide-react';

export const SaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();

  const failedMessages = data.outboundMessages.filter((m) => m.status === 'Failed').length;
  const lockedUsers = data.users.filter((u) => u.lockoutUntil && new Date(u.lockoutUntil) > new Date()).length;
  const auditEvents = data.auditEvents.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration & Infrastructure Health"
        description="System health telemetry, mock integration status, security audit log stream, and storage utilization."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'System Health' }]}
        primaryAction={
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              mockStore.resetToDefault();
              window.location.reload();
            }}
          >
            Reset Demo Store to Factory State
          </Button>
        }
      />

      {/* 4 Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">WhatsApp Provider Gateway</span>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <div className="text-base font-bold text-text-primary">Operational (Cloud API)</div>
          <span className="text-[11px] text-text-muted mt-1 block">Latency: 142ms · 99.8% uptime</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Delivery Failure Rate</span>
            <span className="w-2 h-2 rounded-full bg-warning" />
          </div>
          <div className="text-base font-bold text-text-primary">{failedMessages} Dispatches Failed</div>
          <span className="text-[11px] text-text-muted mt-1 block">Opt-out or unreachability</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Account Security Lockouts</span>
            <span className="w-2 h-2 rounded-full bg-success" />
          </div>
          <div className="text-base font-bold text-text-primary">{lockedUsers} Locked Accounts</div>
          <span className="text-[11px] text-text-muted mt-1 block">5 failed attempts threshold</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Mock Storage Utilisation</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <div className="text-base font-bold text-text-primary">1.4 MB / 5.0 MB Quota</div>
          <span className="text-[11px] text-text-muted mt-1 block">Indexed in localStorage</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Audits & Integrations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Audit Log Stream (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-bg-base border border-border-hairline rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <h3 className="font-serif text-base font-semibold text-text-primary flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Recent Security & Operational Audit Events
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-logs')}>
              View Full Trail
            </Button>
          </div>

          <div className="divide-y divide-border-hairline">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="py-3 flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary">{evt.action}</span>
                    <span className="text-text-muted">on</span>
                    <code className="bg-bg-subtle px-1.5 py-0.5 rounded text-[11px] font-mono border border-border-hairline">
                      {evt.entity}
                    </code>
                    <StatusChip label={evt.actorRole} variant="neutral" />
                  </div>
                  <p className="text-text-muted text-[11px]">{evt.reason || 'Routine operational transaction'}</p>
                  <span className="text-[10px] text-text-disabled font-mono block mt-1">Hash: {evt.hash.slice(0, 16)}...</span>
                </div>
                <span className="text-[11px] text-text-muted shrink-0">{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Admin Shortcuts */}
        <div className="p-5 bg-bg-subtle border border-border-hairline rounded space-y-4">
          <h3 className="font-serif text-sm font-semibold text-text-primary">
            Platform Maintenance Shortcuts
          </h3>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full text-left p-2.5 rounded bg-bg-base border border-border-hairline hover:border-accent flex items-center justify-between font-medium"
            >
              <span>User Accounts Directory</span>
              <Users className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => navigate('/admin/roles')}
              className="w-full text-left p-2.5 rounded bg-bg-base border border-border-hairline hover:border-accent flex items-center justify-between font-medium"
            >
              <span>Roles & Permission Matrix</span>
              <Shield className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => navigate('/admin/integrations')}
              className="w-full text-left p-2.5 rounded bg-bg-base border border-border-hairline hover:border-accent flex items-center justify-between font-medium"
            >
              <span>Integration Health Monitor</span>
              <Server className="w-4 h-4 text-accent" />
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full text-left p-2.5 rounded bg-bg-base border border-border-hairline hover:border-accent flex items-center justify-between font-medium"
            >
              <span>Global Pilot Settings</span>
              <Activity className="w-4 h-4 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
