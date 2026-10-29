import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  RotateCcw,
  Search,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { SmsFallbackRecord } from '@/api/contracts';

export const SmsLogPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const records = data.smsFallbackRecords;

  const filtered = records.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const phone = (r.recipientPhoneNumber || r.recipientPhone || '').toLowerCase();
      const sosId = (r.sosEventId || r.sosId || '').toLowerCase();
      const matchPhone = phone.includes(q);
      const matchSos = sosId.includes(q);
      if (!matchPhone && !matchSos) return false;
    }
    return true;
  });

  const handleRetry = (rec: SmsFallbackRecord) => {
    rec.status = 'SENT';
    rec.retryCount = (rec.retryCount || 0) + 1;
    rec.deliveredAt = new Date(Date.now() + 1500).toISOString();

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: user?.chapterId || 'ORGANISATION',
      action: 'SMS_FALLBACK_RETRY',
      entityType: 'SOS',
      entityId: rec.id,
      details: `Retried SMS fallback dispatch to ${rec.recipientPhoneNumber} for SOS ${rec.sosEventId}.`,
    });

    mockStore.persist();
    setFeedback(`SMS ${rec.id} re-dispatched to cellular gateway.`);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sos')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          Back to Live SOS board
        </Button>
      </div>

      <PageHeader
        title="Cellular SMS fallback outbox"
        description="Audit log of offline transactional SMS dispatched to next-of-kin contacts when mobile data connectivity dropped."
      />

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded-control text-xs text-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-semibold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-2.5 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Search by SOS ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border rounded-control bg-surface text-text text-xs focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="ALL">All delivery statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SENT">Sent / in flight</option>
            <option value="FAILED">Failed</option>
            <option value="QUEUED">Queued</option>
          </select>
        </div>

        <span className="text-text-secondary text-xs">
          Showing <strong className="text-text font-semibold tabular-nums">{filtered.length}</strong> of{' '}
          <span className="tabular-nums">{records.length}</span> SMS fallback dispatches
        </span>
      </div>

      {/* Outbox Table */}
      <div className="bg-surface border border-border rounded-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-normal">
                <th className="py-2.5 px-4">Dispatch timestamp</th>
                <th className="py-2.5 px-4">Incident case</th>
                <th className="py-2.5 px-4">Recipient (NOK)</th>
                <th className="py-2.5 px-4">DLT template</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Trigger reason</th>
                <th className="py-2.5 px-4">Retries</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-secondary">
                    No SMS fallback dispatches logged under current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-2.5 px-4 tabular-nums text-text-secondary">
                      {new Date(rec.dispatchedAt || rec.sentAt || Date.now()).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/sos/${rec.sosEventId || rec.sosId}`)}
                        className="tabular-nums font-semibold text-accent hover:underline"
                      >
                        {rec.sosEventId || rec.sosId}
                      </button>
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-text">
                      {user?.role === 'SA'
                        ? (rec.recipientPhoneNumber || rec.recipientPhone || 'N/A')
                        : maskPhoneNumber(rec.recipientPhoneNumber || rec.recipientPhone || '')}
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-xs text-text-secondary">
                      {rec.dltTemplateId}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusChip
                        status={
                          rec.status === 'DELIVERED'
                            ? 'success'
                            : rec.status === 'FAILED'
                            ? 'danger'
                            : 'warning'
                        }
                        label={rec.status}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary text-xs">
                      {rec.triggerReason}
                    </td>
                    <td className="py-2.5 px-4 tabular-nums text-text-secondary">
                      {rec.retryCount || 0}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {rec.status === 'FAILED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(rec)}
                          className="text-xs px-2 py-0.5 h-6 gap-1"
                        >
                          <RotateCcw className="w-3 h-3 stroke-[1.5]" />
                          Retry
                        </Button>
                      )}
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
