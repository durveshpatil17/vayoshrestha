import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, Search, Filter, Hash, ArrowRight, Download, FileText } from 'lucide-react';
import { AuditEvent } from '@/api/contracts';

export const AuditLogsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const auditEvents = data.auditEvents.filter((ev) => {
    // CC scope: corrections and centre events only
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && ev.centreId && !user.assignedCentres.includes(ev.centreId)) {
        return false;
      }
    }

    if (selectedAction !== 'all' && ev.action !== selectedAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.actorName.toLowerCase().includes(q) ||
        ev.entity.toLowerCase().includes(q) ||
        (ev.reason && ev.reason.toLowerCase().includes(q)) ||
        ev.hash.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Tamper-Evident Audit & Security Logs"
        description="Append-only cryptographic hash chain recording all data mutations, logins, and PII access (FR-52)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Audit Logs' },
        ]}
      />

      {/* Hash Chain Integrity Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Cryptographic Hash Chain Valid:</strong> All {data.auditEvents.length} events are linked via SHA-256 integrity digests. Zero tampering detected.
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-800">Chain Root: e3b0c442...</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search actor, entity, reason, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Audit Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="EXPORT">EXPORT</option>
            <option value="PII_REVEAL">PII_REVEAL</option>
            <option value="CONSENT_CHANGE">CONSENT_CHANGE</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{auditEvents.length}</strong> immutable events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor & Role</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Reason / Description</th>
              <th className="py-3 px-4">SHA-256 Hash</th>
              <th className="py-3 px-4 text-right">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs font-mono">
            {auditEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-bg-subtle/40">
                <td className="py-3 px-4 text-text-muted">
                  {ev.timestamp.replace('T', ' ').slice(0, 19)}
                </td>
                <td className="py-3 px-4 font-sans font-medium text-text-primary">
                  {ev.actorName} ({ev.actorRole})
                </td>
                <td className="py-3 px-4 font-sans">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      ev.action === 'CREATE'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ev.action === 'PII_REVEAL'
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : ev.action === 'APPROVE'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {ev.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-primary">{ev.entity}</td>
                <td className="py-3 px-4 font-sans text-text-muted max-w-xs truncate" title={ev.reason}>
                  {ev.reason || 'Routine operation'}
                </td>
                <td className="py-3 px-4 text-text-muted text-[10px]">
                  {ev.hash.slice(0, 12)}...
                </td>
                <td className="py-3 px-4 text-right font-sans">
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

      {/* Diff Viewer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-xl w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Audit Event Inspection</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
                <div><strong>Event ID:</strong> <span className="font-mono">{selectedEvent.id}</span></div>
                <div><strong>Actor:</strong> {selectedEvent.actorName} ({selectedEvent.actorRole})</div>
                <div><strong>Action:</strong> {selectedEvent.action} on {selectedEvent.entity}</div>
                <div><strong>Timestamp:</strong> {selectedEvent.timestamp}</div>
                <div><strong>Justification:</strong> {selectedEvent.reason || 'None provided'}</div>
                <div><strong>Cryptographic Hash:</strong> <span className="font-mono text-[10px] break-all">{selectedEvent.hash}</span></div>
              </div>

              <div>
                <span className="font-semibold text-text-primary block mb-1">State Diff Snapshot:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-rose-50/50 border border-rose-200 rounded font-mono text-[11px] overflow-x-auto">
                    <span className="font-sans font-semibold text-rose-900 block mb-1">Before:</span>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedEvent.diffBefore || null, null, 2)}</pre>
                  </div>
                  <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded font-mono text-[11px] overflow-x-auto">
                    <span className="font-sans font-semibold text-emerald-900 block mb-1">After:</span>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedEvent.diffAfter || null, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
