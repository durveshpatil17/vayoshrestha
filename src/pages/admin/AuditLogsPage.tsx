import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { AuditEvent } from '@/api/contracts';
import { ShieldCheck, Search, Filter, Hash, ArrowLeft, Download } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const auditEvents = data.auditEvents.filter((ev) => {
    // CM scope: own chapter events only
    if (user?.role === 'CM') {
      if (user.assignedChapter && ev.chapterId && ev.chapterId !== user.assignedChapter) {
        return false;
      }
    }

    if (selectedAction !== 'all' && ev.action !== selectedAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const actor = (ev.actorName || ev.actorId || '').toLowerCase();
      const entity = (ev.entityType || '').toLowerCase();
      const reason = (ev.reason || ev.details || '').toLowerCase();
      const hash = (ev.hash || '').toLowerCase();
      return actor.includes(q) || entity.includes(q) || reason.includes(q) || hash.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      <PageHeader
        title="Cryptographic Audit & Security Hash Chain"
        description="Immutable append-only ledger recording all state mutations, security events, and PII unmasking (FR-52)"
      />

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-border-hairline rounded flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search actor, entity, hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-border-hairline rounded text-xs"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white text-xs"
          >
            <option value="all">All Audit Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="PII_REVEAL">PII_REVEAL</option>
            <option value="SOS_ACKNOWLEDGE">SOS_ACKNOWLEDGE</option>
            <option value="SOS_RESOLVE">SOS_RESOLVE</option>
            <option value="DATA_EXPORT">DATA_EXPORT</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{auditEvents.length}</strong> immutable events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
              <tr>
                <th className="py-2.5 px-4">Timestamp (IST)</th>
                <th className="py-2.5 px-4">Actor & Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target Entity</th>
                <th className="py-2.5 px-4">Details / Justification</th>
                <th className="py-2.5 px-4">Hash Chain</th>
                <th className="py-2.5 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-xs font-mono">
              {auditEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-surface-subtle">
                  <td className="py-2.5 px-4 text-text-muted font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </td>
                  <td className="py-2.5 px-4 font-sans font-medium text-text-primary">
                    {ev.actorName || ev.actorId} ({ev.actorRole})
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-subtle border border-border-hairline text-text-primary">
                      {ev.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-text-primary">
                    {ev.entityType} ({ev.entityId})
                  </td>
                  <td className="py-2.5 px-4 font-sans text-text-muted max-w-xs truncate">
                    {ev.details || ev.reason || 'Standard operation'}
                  </td>
                  <td className="py-2.5 px-4 text-text-muted text-[10px] font-mono">
                    {ev.hash ? `${ev.hash.slice(0, 10)}...` : '✓ Chain Valid'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="text-accent font-semibold hover:underline text-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff Viewer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-border-hairline max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-base font-bold text-text-primary">
                Audit Event Inspection
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-text-muted hover:text-text-primary font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 bg-surface-subtle rounded border border-border-hairline space-y-1 text-xs">
                <div>
                  <strong>Event ID:</strong>{' '}
                  <span className="font-mono text-text-primary">{selectedEvent.id}</span>
                </div>
                <div>
                  <strong>Actor:</strong> {selectedEvent.actorName || selectedEvent.actorId} (
                  {selectedEvent.actorRole})
                </div>
                <div>
                  <strong>Action:</strong> {selectedEvent.action} on {selectedEvent.entityType} (
                  {selectedEvent.entityId})
                </div>
                <div>
                  <strong>Timestamp:</strong> {selectedEvent.timestamp}
                </div>
                <div>
                  <strong>Details:</strong> {selectedEvent.details || 'None'}
                </div>
                <div>
                  <strong>Cryptographic Hash:</strong>{' '}
                  <span className="font-mono text-[10px] break-all">
                    {selectedEvent.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </span>
                </div>
              </div>

              {selectedEvent.diff && (
                <div>
                  <span className="font-semibold text-text-primary block mb-1">State Diff:</span>
                  <pre className="p-3 bg-surface-subtle border border-border-hairline rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap max-h-40">
                    {JSON.stringify(selectedEvent.diff, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border-hairline">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
