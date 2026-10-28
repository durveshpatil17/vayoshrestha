import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { RefreshCw, Server, Send, AlertTriangle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const failedCount = data.outboundMessages.filter((m) => m.status === 'Failed').length;
  const queuedCount = data.outboundMessages.filter((m) => m.status === 'Queued').length;
  const [retrying, setRetrying] = useState(false);
  const [retryDone, setRetryDone] = useState(false);

  const handleBulkRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      mockStore.updateData((draft) => {
        draft.outboundMessages.forEach((m) => {
          if (m.status === 'Failed') {
            m.status = 'Delivered';
            m.failureReason = undefined;
            m.deliveredAt = new Date().toISOString();
          }
        });
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'Admin',
        'SA',
        'UPDATE',
        'OutboundMessage',
        'bulk-retry',
        `Bulk retried ${failedCount} failed notifications`,
        'Bulk delivery retry operation',
        { count: failedCount },
        undefined
      );

      setRetrying(false);
      setRetryDone(true);
      setTimeout(() => setRetryDone(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Integration Monitors & Provider Health"
        description="Real-time telemetry for WhatsApp Business API provider, webhook delivery queues, and error buffers (FR-55)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Integrations' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkRetry}
            disabled={retrying || failedCount === 0}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${retrying ? 'animate-spin' : ''}`} />
            Bulk Retry Failed Dispatches ({failedCount})
          </Button>
        }
      />

      {retryDone && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All failed dispatches cleared from error buffer and acknowledged by mock WhatsApp gateway.</span>
        </div>
      )}

      {/* Integration Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>WhatsApp Business API</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl font-serif font-bold text-text-primary mt-1">Operational (99.98%)</div>
          <div className="text-xs text-text-muted mt-1">Provider: Meta Cloud API / BSP Mock</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Inbound Webhook Latency</div>
          <div className="text-xl font-serif font-bold text-emerald-700 mt-1">142 ms</div>
          <div className="text-xs text-text-muted mt-1">HTTP 200 delivery status ack</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Message Queue Depth</div>
          <div className="text-xl font-serif font-bold text-text-primary mt-1">{queuedCount} In Queue</div>
          <div className="text-xs text-text-muted mt-1">Within normal rate limits</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Transmission Error Buffer</div>
          <div className="text-xl font-serif font-bold text-rose-700 mt-1">{failedCount} Failed</div>
          <div className="text-xs text-text-muted mt-1">Undelivered handsets</div>
        </div>
      </div>

      {/* Breakdown of Failure Reasons */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
        <h4 className="font-serif text-sm font-semibold text-text-primary">Failed Notifications by Category (FR-55)</h4>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
            <div>
              <span className="font-semibold text-text-primary">Handset Switched Off / Out of Coverage Area</span>
              <span className="text-text-muted block text-[11px]">Provider Error Code: 131026</span>
            </div>
            <span className="font-mono font-bold text-rose-700">12 Failures</span>
          </div>

          <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
            <div>
              <span className="font-semibold text-text-primary">Number Not Registered on WhatsApp</span>
              <span className="text-text-muted block text-[11px]">Provider Error Code: 131047</span>
            </div>
            <span className="font-mono font-bold text-rose-700">6 Failures</span>
          </div>

          <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
            <div>
              <span className="font-semibold text-text-primary">Explicit Channel Opt-out ("STOP" keyword logged)</span>
              <span className="text-text-muted block text-[11px]">Internal Rule Block: FR-29 Consent Gate</span>
            </div>
            <span className="font-mono font-bold text-amber-700">Blocked (By Design)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
