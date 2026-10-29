import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Server,
  Zap,
  RotateCw,
} from 'lucide-react';

interface SyncBatchLog {
  id: string;
  associateId: string;
  associateName: string;
  chapterName: string;
  batchSize: number;
  captureDelayMinutes: number;
  syncedAt: string;
  status: 'Completed' | 'Late_Sync_Warning' | 'Retry_Required';
  errorMessage?: string;
}

const SEED_SYNC_BATCHES: SyncBatchLog[] = [
  {
    id: 'batch-001',
    associateId: 'fa-001',
    associateName: 'Ramakant Shinde',
    chapterName: 'Pune Ekta Hub',
    batchSize: 3,
    captureDelayMinutes: 28,
    syncedAt: '12 min ago',
    status: 'Completed',
  },
  {
    id: 'batch-002',
    associateId: 'fa-003',
    associateName: 'K. S. Narayana',
    chapterName: 'Bengaluru Ekta Hub',
    batchSize: 5,
    captureDelayMinutes: 1540, // > 24 hours
    syncedAt: '35 min ago',
    status: 'Late_Sync_Warning',
    errorMessage: 'Sync delay exceeded 24 hours (1,540 min). Flagged in compliance audit.',
  },
  {
    id: 'batch-003',
    associateId: 'fa-005',
    associateName: 'Suresh Deshmukh',
    chapterName: 'Nashik Ekta Hub',
    batchSize: 2,
    captureDelayMinutes: 14,
    syncedAt: '1 hour ago',
    status: 'Completed',
  },
  {
    id: 'batch-004',
    associateId: 'fa-002',
    associateName: 'Anasuya Kelkar',
    chapterName: 'Pune Ekta Hub',
    batchSize: 4,
    captureDelayMinutes: 42,
    syncedAt: '2 hours ago',
    status: 'Completed',
  },
];

export const FieldSyncMonitorPage: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<SyncBatchLog[]>(SEED_SYNC_BATCHES);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const handleRetry = (batchId: string) => {
    setIsRetrying(batchId);
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, status: 'Completed', errorMessage: undefined } : b))
      );
      setIsRetrying(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <span
              onClick={() => navigate('/field-network')}
              className="hover:text-accent cursor-pointer"
            >
              Field Network
            </span>
            <span>/</span>
            <span className="text-text font-semibold">Sync Telemetry</span>
          </div>
          <h1 className="text-2xl font-semibold text-text">
            Sync Telemetry &amp; Latency Monitor
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Real-time monitoring of client batch commits, encryption handshakes, and SLA breaches.
          </p>
        </div>
      </div>

      {/* Latency Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-semibold text-text-secondary">Median Synchronization Delay</div>
          <div className="text-2xl font-semibold text-accent tabular-nums mt-1">38 min</div>
          <div className="text-xs text-text-secondary mt-0.5">SLA target: &lt;45 min</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-semibold text-text-secondary">Batches Processed (24h)</div>
          <div className="text-2xl font-semibold text-text tabular-nums mt-1">142</div>
          <div className="text-xs text-text-secondary mt-0.5">Zero corruption failures</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-semibold text-text-secondary">Late Sync Rate (&gt;24h)</div>
          <div className="text-2xl font-semibold text-critical tabular-nums mt-1">2.8%</div>
          <div className="text-xs text-text-secondary mt-0.5">4 flagged out of 142</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-semibold text-text-secondary">Cryptographic Verification</div>
          <div className="text-base font-semibold text-positive flex items-center gap-1.5 mt-2">
            <CheckCircle className="w-4 h-4" />
            100% AES-GCM
          </div>
          <div className="text-xs text-text-secondary mt-0.5">All signatures verified</div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-subtle/50 font-semibold text-sm text-text">
          Recent Synchronization Batches
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-text-secondary text-xs font-semibold">
              <th className="py-3 px-4">Batch ID &amp; Associate</th>
              <th className="py-3 px-4">Chapter</th>
              <th className="py-3 px-4 text-center">Batch Size</th>
              <th className="py-3 px-4">Capture Delay</th>
              <th className="py-3 px-4">Sync Status</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-secondary">
            {batches.map((batch) => (
              <tr key={batch.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-text text-xs">
                    {batch.id}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {batch.associateName} ({batch.associateId})
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-text">
                  {batch.chapterName}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-accent tabular-nums">
                  {batch.batchSize} items
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`tabular-nums font-semibold ${
                      batch.captureDelayMinutes > 1440
                        ? 'text-critical font-semibold'
                        : 'text-text'
                    }`}
                  >
                    {batch.captureDelayMinutes > 60
                      ? `${Math.round(batch.captureDelayMinutes / 60)}h ${batch.captureDelayMinutes % 60}m`
                      : `${batch.captureDelayMinutes}m`}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      batch.status === 'Completed'
                        ? 'bg-positive-tint text-positive'
                        : 'bg-critical-tint text-critical'
                    }`}
                  >
                    {batch.status === 'Completed' ? 'Synced' : 'Late Sync Alert'}
                  </span>
                  {batch.errorMessage && (
                    <div className="text-xs text-critical mt-1 leading-normal">
                      {batch.errorMessage}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-text-secondary tabular-nums">
                  {batch.syncedAt}
                </td>
                <td className="py-3 px-4 text-right">
                  {batch.status !== 'Completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isRetrying === batch.id}
                      onClick={() => handleRetry(batch.id)}
                      icon={<RotateCw className={`w-3.5 h-3.5 ${isRetrying === batch.id ? 'animate-spin' : ''}`} />}
                    >
                      Acknowledge
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
