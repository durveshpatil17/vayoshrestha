import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  Filter,
  ArrowLeft,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { KpiTile } from '@/components/ui/KpiTile';

export const SosHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [drillFilter, setDrillFilter] = useState<'ALL' | 'REAL' | 'DRILL'>('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');

  const allEvents = data.sosEvents;

  // Filter based on user scope
  const scopedEvents = allEvents.filter((ev) => {
    if (user?.role === 'CM' && ev.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === ev.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

  // Apply filters
  const filtered = scopedEvents.filter((ev) => {
    if (selectedChapter !== 'ALL' && ev.chapterId !== selectedChapter) return false;
    if (drillFilter === 'REAL' && ev.isDrill) return false;
    if (drillFilter === 'DRILL' && !ev.isDrill) return false;
    if (outcomeFilter !== 'ALL' && ev.status !== outcomeFilter) return false;
    return true;
  });

  const totalEvents = scopedEvents.length;
  const realEvents = scopedEvents.filter((e) => !e.isDrill).length;
  const resolvedEvents = scopedEvents.filter((e) => e.status === 'RESOLVED');
  const slaBreachedCount = scopedEvents.filter((e) => e.slaBreached).length;
  const avgLatency =
    totalEvents > 0
      ? Math.round(scopedEvents.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / totalEvents)
      : 0;

  const handleExportCsv = () => {
    const headers = 'ID,TriggeredAt,SeniorId,ChapterId,Status,IsDrill,LatencyMs,SlaBreached\n';
    const rows = filtered
      .map(
        (e) =>
          `"${e.id}","${e.triggeredAt}","${e.seniorId}","${e.chapterId}","${e.status}","${e.isDrill}","${e.latencyMs}","${e.slaBreached}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vayoshrestha_SOS_History_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Top back button */}
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Historical SOS registry & incident audit"
          description="Permanent tamper-evident log of emergency activations, cellular fallbacks, and SLA compliance metrics."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 stroke-[1.5]" />
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/sos')}
            className="text-xs gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 stroke-[1.5]" />
            Live board
          </Button>
        </div>
      </div>

      {/* Aggregate metric cards (Exactly 4 Headline Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Total incidents logged"
          value={totalEvents}
          unit={`(${realEvents} real)`}
          statusLine="Over 90-day pilot cycle"
          status="positive"
        />
        <KpiTile
          title="Average alert latency"
          value={`${avgLatency} ms`}
          statusLine="Target < 1,000 ms met"
          status="positive"
        />
        <KpiTile
          title="SLA compliance"
          value={
            totalEvents > 0
              ? `${Math.round(((totalEvents - slaBreachedCount) / totalEvents) * 100)}%`
              : '100%'
          }
          statusLine={`${slaBreachedCount} SLA breaches audited`}
          status={slaBreachedCount === 0 ? 'positive' : 'critical'}
        />
        <KpiTile
          title="Resolved incidents"
          value={resolvedEvents.length}
          statusLine="Confirmed safe resolution"
          status="positive"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-text-secondary flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 stroke-[1.5]" /> Filters:
          </span>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-2.5 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="ALL">All chapters</option>
            {data.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>

          <select
            value={drillFilter}
            onChange={(e) => setDrillFilter(e.target.value as 'ALL' | 'REAL' | 'DRILL')}
            className="px-2.5 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="ALL">All incidents</option>
            <option value="REAL">Real incidents only</option>
            <option value="DRILL">Drills only</option>
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="ALL">All outcomes</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED_BY_SENIOR">Cancelled by senior</option>
            <option value="TRIGGERED">Unresolved / open</option>
          </select>
        </div>

        <span className="text-text-secondary">
          Showing <strong className="text-text font-semibold tabular-nums">{filtered.length}</strong> of{' '}
          <span className="tabular-nums">{scopedEvents.length}</span> records
        </span>
      </div>

      {/* Historical Table */}
      <div className="bg-surface border border-border rounded-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-normal">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Triggered (IST)</th>
                <th className="py-3 px-4">Senior citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Alert latency</th>
                <th className="py-3 px-4">Cellular SMS</th>
                <th className="py-3 px-4">SLA result</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((ev) => {
                const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);

                return (
                  <tr key={ev.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4 tabular-nums font-semibold text-text">{ev.id}</td>
                    <td className="py-3 px-4 tabular-nums text-text-secondary">
                      {new Date(ev.triggeredAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-text block">
                        {senior?.fullName || 'Unknown'}
                      </span>
                      <span className="text-xs tabular-nums text-text-secondary">
                        {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text">{ev.chapterId}</td>
                    <td className="py-3 px-4">
                      {ev.isDrill ? (
                        <span className="px-2 py-0.5 text-xs bg-surface-subtle text-text-secondary rounded-chip font-semibold border border-border">
                          Drill
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-negative-tint text-negative rounded-chip font-semibold border border-negative/20">
                          Real
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-text font-semibold">
                      {ev.latencyMs} ms
                    </td>
                    <td className="py-3 px-4">
                      {ev.cellularFallbackTriggered ? (
                        <span className="text-xs text-accent font-semibold">
                          {ev.cellularFallbackDelivered ? 'Delivered' : 'Dispatched'}
                        </span>
                      ) : (
                        <span className="text-text-secondary text-xs">Data OK</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {ev.slaBreached ? (
                        <span className="text-xs font-semibold text-negative">Breached</span>
                      ) : (
                        <span className="text-xs text-positive font-semibold">Within SLA</span>
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
                        className="text-xs px-2 py-0.5 h-6"
                      >
                        Dossier
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
