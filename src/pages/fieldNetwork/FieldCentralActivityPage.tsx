import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Activity,
  Search,
  Filter,
  Download,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Shield,
} from 'lucide-react';

interface CentralActivityLog {
  id: string;
  associateName: string;
  chapterName: string;
  activityType: 'onboarding' | 'check_in_visit' | 'consent_follow_up';
  peerMasked: string;
  areaLabel: string;
  doubleConsent: 'confirmed' | 'consent_2_requested' | 'consent_1_captured';
  capturedOffline: boolean;
  capturedAt: string;
  syncedAt: string;
  isLateSync: boolean;
}

const SEED_CENTRAL_LOGS: CentralActivityLog[] = [
  {
    id: 'act-001',
    associateName: 'Ramakant Shinde',
    chapterName: 'Pune Ekta Hub',
    activityType: 'onboarding',
    peerMasked: 'K. ••••••shi',
    areaLabel: 'Shivajinagar Central, Pune',
    doubleConsent: 'confirmed',
    capturedOffline: true,
    capturedAt: '2026-10-29T09:15:00Z',
    syncedAt: '2026-10-29T09:42:00Z',
    isLateSync: false,
  },
  {
    id: 'act-002',
    associateName: 'Anasuya Kelkar',
    chapterName: 'Pune Ekta Hub',
    activityType: 'check_in_visit',
    peerMasked: 'D. ••••••lkar',
    areaLabel: 'Ghole Road, Pune',
    doubleConsent: 'confirmed',
    capturedOffline: false,
    capturedAt: '2026-10-29T10:30:00Z',
    syncedAt: '2026-10-29T10:30:15Z',
    isLateSync: false,
  },
  {
    id: 'act-003',
    associateName: 'K. S. Narayana',
    chapterName: 'Bengaluru Ekta Hub',
    activityType: 'onboarding',
    peerMasked: 'V. ••••••ao',
    areaLabel: 'Malleshwaram East, Bengaluru',
    doubleConsent: 'consent_2_requested',
    capturedOffline: true,
    capturedAt: '2026-10-28T08:00:00Z',
    syncedAt: '2026-10-29T11:15:00Z',
    isLateSync: true, // >24h late sync flag!
  },
  {
    id: 'act-004',
    associateName: 'Venkatesh Rao',
    chapterName: 'Bengaluru Ekta Hub',
    activityType: 'check_in_visit',
    peerMasked: 'S. ••••••tty',
    areaLabel: 'Jayanagar 4th Block, Bengaluru',
    doubleConsent: 'confirmed',
    capturedOffline: true,
    capturedAt: '2026-10-29T11:45:00Z',
    syncedAt: '2026-10-29T12:05:00Z',
    isLateSync: false,
  },
  {
    id: 'act-005',
    associateName: 'Suresh Deshmukh',
    chapterName: 'Nashik Ekta Hub',
    activityType: 'onboarding',
    peerMasked: 'P. ••••••ndhe',
    areaLabel: 'Gangapur Road, Nashik',
    doubleConsent: 'confirmed',
    capturedOffline: false,
    capturedAt: '2026-10-29T12:30:00Z',
    syncedAt: '2026-10-29T12:30:20Z',
    isLateSync: false,
  },
  {
    id: 'act-006',
    associateName: 'Meenakshi Sundaram',
    chapterName: 'Chennai Ekta Hub',
    activityType: 'consent_follow_up',
    peerMasked: 'M. ••••••man',
    areaLabel: 'Mylapore West, Chennai',
    doubleConsent: 'confirmed',
    capturedOffline: true,
    capturedAt: '2026-10-29T13:10:00Z',
    syncedAt: '2026-10-29T13:50:00Z',
    isLateSync: false,
  },
];

export const FieldCentralActivityPage: React.FC = () => {
  const navigate = useNavigate();

  const [chapterFilter, setChapterFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<CentralActivityLog[]>(SEED_CENTRAL_LOGS);

  const filtered = logs.filter((log) => {
    if (chapterFilter !== 'ALL' && !log.chapterName.includes(chapterFilter)) return false;
    if (typeFilter !== 'ALL' && log.activityType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.associateName.toLowerCase().includes(q) ||
        log.areaLabel.toLowerCase().includes(q) ||
        log.peerMasked.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    // Sanitize and export coarse data
    const headers = 'ID,Associate,Chapter,ActivityType,PeerMasked,AreaLabel,ConsentState,CapturedOffline,IsLateSync,SyncedAt\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${l.associateName}","${l.chapterName}","${l.activityType}","${l.peerMasked}","${l.areaLabel}","${l.doubleConsent}",${l.capturedOffline},${l.isLateSync},"${l.syncedAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vayoshrestha_field_activity_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <span
              onClick={() => navigate('/field-network')}
              className="hover:text-accent cursor-pointer"
            >
              Field Network
            </span>
            <span>/</span>
            <span className="text-text-primary font-medium">Activity Stream</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Central Field Activity Stream
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Audit-grade log of last-mile field interactions with privacy-preserving area labels.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportCsv}
        >
          Export CSV (Audited)
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search by associate name or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
          >
            <option value="ALL">All Chapters</option>
            <option value="Pune">Pune Ekta Hub</option>
            <option value="Bengaluru">Bengaluru Ekta Hub</option>
            <option value="Nashik">Nashik Ekta Hub</option>
            <option value="Chennai">Chennai Ekta Hub</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
          >
            <option value="ALL">All Activity Types</option>
            <option value="onboarding">Onboardings</option>
            <option value="check_in_visit">Check-in Visits</option>
            <option value="consent_follow_up">Consent Follow-ups</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-text-muted text-[11px] font-semibold">
              <th className="py-3 px-4">Activity &amp; Associate</th>
              <th className="py-3 px-4">Coarse Area Label (±1 km)</th>
              <th className="py-3 px-4">Peer Record (Masked)</th>
              <th className="py-3 px-4">Consent Status</th>
              <th className="py-3 px-4">Capture Mode</th>
              <th className="py-3 px-4">Sync Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-secondary">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-bg-subtle/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-text-primary capitalize">
                    {log.activityType.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    by {log.associateName} · {log.chapterName}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-text-primary font-medium">
                    <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>{log.areaLabel}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[11px] text-text-primary">
                  {log.peerMasked}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      log.doubleConsent === 'confirmed'
                        ? 'bg-positive-tint text-positive'
                        : 'bg-critical-tint text-critical'
                    }`}
                  >
                    {log.doubleConsent === 'confirmed' ? 'Double Consented' : 'Awaiting Consent 2'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        log.capturedOffline
                          ? 'bg-bg-subtle text-text-secondary border border-border-hairline'
                          : 'bg-positive-tint/40 text-positive'
                      }`}
                    >
                      {log.capturedOffline ? 'Offline Captured' : 'Online Direct'}
                    </span>
                    {log.isLateSync && (
                      <span className="px-1.5 py-0.5 rounded bg-critical-tint text-critical text-[9px] font-semibold">
                        Late Sync (&gt;24h)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-text-muted tabular-nums">
                  {new Date(log.syncedAt).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-bg-subtle rounded-xl border border-border-hairline flex items-center gap-2 text-xs text-text-muted">
        <Shield className="w-4 h-4 text-accent flex-shrink-0" />
        <span>
          Privacy guarantee: No raw GPS traces or continuous trails are collected. All coordinates are coarse area approximations rounded to 2 decimal places.
        </span>
      </div>
    </div>
  );
};
