import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { ExportDialog } from '@/components/data/ExportDialog';
import { maskPhoneNumber } from '@/domain/masking';
import {
  History,
  Download,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';

export const SosHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [drillFilter, setDrillFilter] = useState<'ALL' | 'REAL' | 'DRILL'>('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [exportOpen, setExportOpen] = useState(false);

  const scopedEvents = data.sosEvents.filter((ev) => {
    if (user?.role === 'CM' && ev.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === ev.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

  const filtered = scopedEvents.filter((ev) => {
    if (selectedChapter !== 'ALL' && ev.chapterId !== selectedChapter) return false;
    if (drillFilter === 'REAL' && ev.isDrill) return false;
    if (drillFilter === 'DRILL' && !ev.isDrill) return false;
    if (outcomeFilter !== 'ALL' && ev.status !== outcomeFilter) return false;
    return true;
  });

  // Calculate aggregates
  const totalEvents = filtered.length;
  const realEvents = filtered.filter((e) => !e.isDrill).length;
  const drillEvents = filtered.filter((e) => e.isDrill).length;
  const resolvedEvents = filtered.filter((e) => e.status === 'RESOLVED');
  const slaBreachedCount = filtered.filter((e) => e.slaBreached).length;

  const latencies = filtered.map((e) => e.latencyMs);
  const avgLatency =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="SOS Incident History & SLA Audit"
          description="Historical log of emergency alerts, cellular SMS fallbacks, and responder SLA compliance."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos')}
            className="text-xs"
          >
            Live Board
          </Button>
        </div>
      </div>

      {/* Aggregate metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-semibold text-text-muted">Total Logged</span>
          <div className="text-xl font-semibold tabular-nums text-text-primary mt-1">{totalEvents}</div>
          <span className="text-[10px] text-text-muted">Over 90-day pilot</span>
        </div>
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-semibold text-text-muted">Real vs Drills</span>
          <div className="text-xl font-semibold tabular-nums text-accent mt-1">
            {realEvents} / {drillEvents}
          </div>
          <span className="text-[10px] text-text-muted">Excludes unverified</span>
        </div>
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-semibold text-text-muted">Avg Alert Latency</span>
          <div className="text-xl font-semibold tabular-nums text-accent mt-1">{avgLatency} ms</div>
          <span className="text-[10px] text-success">Target: &lt; 1,000 ms</span>
        </div>
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-semibold text-text-muted">SLA Compliance</span>
          <div className="text-xl font-semibold tabular-nums text-text-primary mt-1">
            {totalEvents > 0
              ? `${Math.round(((totalEvents - slaBreachedCount) / totalEvents) * 100)}%`
              : '100%'}
          </div>
          <span className="text-[10px] text-text-muted">{slaBreachedCount} breaches</span>
        </div>
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-semibold text-text-muted">Resolved Cases</span>
          <div className="text-xl font-semibold tabular-nums text-success mt-1">
            {resolvedEvents.length}
          </div>
          <span className="text-[10px] text-text-muted">Confirmed safe</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white"
          >
            <option value="ALL">All Chapters</option>
            {data.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>

          <select
            value={drillFilter}
            onChange={(e) => setDrillFilter(e.target.value as any)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white"
          >
            <option value="ALL">All Incidents</option>
            <option value="REAL">Real Incidents Only</option>
            <option value="DRILL">Drills Only</option>
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-hairline rounded bg-white"
          >
            <option value="ALL">All Outcomes</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED_BY_SENIOR">Cancelled by Senior</option>
            <option value="TRIGGERED">Unresolved / Open</option>
          </select>
        </div>

        <span className="text-text-muted">
          Showing <strong>{filtered.length}</strong> of {scopedEvents.length} records
        </span>
      </div>

      {/* Historical Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Triggered (IST)</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Alert Latency</th>
                <th className="py-3 px-4">Cellular SMS</th>
                <th className="py-3 px-4">SLA Result</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filtered.map((ev) => {
                const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);

                return (
                  <tr key={ev.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-4 tabular-nums font-semibold text-text-primary">{ev.id}</td>
                    <td className="py-3 px-4 tabular-nums text-text-muted">
                      {new Date(ev.triggeredAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-text-primary block">
                        {senior?.fullName || 'Unknown'}
                      </span>
                      <span className="text-[11px] tabular-nums text-text-muted">
                        {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-primary">{ev.chapterId}</td>
                    <td className="py-3 px-4">
                      {ev.isDrill ? (
                        <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded font-semibold">
                          Drill
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded font-semibold">
                          Real
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-text-primary font-medium">
                      {ev.latencyMs} ms
                    </td>
                    <td className="py-3 px-4">
                      {ev.cellularFallbackTriggered ? (
                        <span className="text-[11px] text-accent font-medium">
                          {ev.cellularFallbackDelivered ? 'Delivered' : 'Dispatched'}
                        </span>
                      ) : (
                        <span className="text-text-muted text-[11px]">Data OK</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {ev.slaBreached ? (
                        <span className="text-[11px] font-semibold text-danger">Breached</span>
                      ) : (
                        <span className="text-[11px] text-success">Within SLA</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip
                        status={
                          ev.status === 'RESOLVED'
                            ? 'success'
                            : ev.status === 'CANCELLED_BY_SENIOR'
                            ? 'neutral'
                            : 'warning'
                        }
                        label={ev.status}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/sos/${ev.id}`)}
                        className="text-xs px-2 py-1 h-7 gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export SOS Incident History"
        entityName="sos_history"
        totalRows={filtered.length}
        onExport={async (reason) => {
          data.auditEvents.unshift({
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actorId: user?.id || 'SYSTEM',
            actorRole: user?.role || 'RA',
            chapterId: user?.chapterId || 'ORGANISATION',
            action: 'DATA_EXPORT',
            entityType: 'SOS',
            entityId: 'HISTORY',
            details: `SOS history CSV exported (${filtered.length} rows). Justification: ${reason}`,
          });
          mockStore.persist();
        }}
      />
    </div>
  );
};
