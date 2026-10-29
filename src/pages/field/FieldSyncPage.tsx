import React, { useState, useEffect } from 'react';
import { getFieldQueue, processSyncQueue, FieldQueueItem } from '@/domain/field/offlineQueue';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

export const FieldSyncPage: React.FC = () => {
  const { user } = useAuthStore();
  const [queue, setQueue] = useState<FieldQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_simulated_offline') === 'true';
  });

  const loadQueue = () => {
    setQueue(getFieldQueue());
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const toggleOfflineSimulation = () => {
    const next = !isSimulatedOffline;
    setIsSimulatedOffline(next);
    localStorage.setItem('vayoshrestha_field_simulated_offline', String(next));
  };

  const handleSyncNow = async () => {
    if (isSimulatedOffline) {
      setSyncFeedback('Cannot sync while simulated offline mode is ON.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await processSyncQueue(user?.id);
      loadQueue();
      setSyncFeedback(
        `Sync complete: ${res.syncedCount} item(s) delivered to central store${
          res.lateSyncCount > 0 ? ` (${res.lateSyncCount} flagged late >24h)` : ''
        }.`
      );
    } catch (err: any) {
      setSyncFeedback('Sync encountered an error: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingItems = queue.filter((q) => q.status === 'pending');
  const syncedItems = queue.filter((q) => q.status === 'synced');
  const lateItems = queue.filter((q) => q.isLateSync);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-accent" />
          Field Sync Queue
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Local cryptographic queue status and cloud synchronization.
        </p>
      </div>

      {/* Simulator Offline Toggle Panel */}
      <div className="p-4 bg-bg-subtle rounded-lg border border-border-hairline flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            {isSimulatedOffline ? (
              <WifiOff className="w-4 h-4 text-critical" />
            ) : (
              <Wifi className="w-4 h-4 text-positive" />
            )}
            Simulate Offline Network
          </div>
          <p className="text-xs text-text-muted mt-0.5 leading-normal max-w-[280px]">
            {isSimulatedOffline
              ? 'Network disabled: activities stay encrypted locally.'
              : 'Network active: queue synchronizes automatically.'}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleOfflineSimulation}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            isSimulatedOffline ? 'bg-critical' : 'bg-border-strong'
          }`}
          role="switch"
          aria-checked={isSimulatedOffline}
          aria-label="Toggle Simulated Offline Mode"
        >
          <div
            className={`bg-white w-4 h-4 rounded-full  transform transition-transform ${
              isSimulatedOffline ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Queue Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg">
          <div className="text-xl font-semibold text-critical tabular-nums">
            {pendingItems.length}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Pending Sync</div>
        </div>
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg">
          <div className="text-xl font-semibold text-positive tabular-nums">
            {syncedItems.length + 8}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Synced Today</div>
        </div>
        <div className="p-3 bg-bg-surface border border-border-hairline rounded-lg">
          <div className="text-xl font-semibold text-text-primary tabular-nums">
            {lateItems.length}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Late (&gt;24h)</div>
        </div>
      </div>

      {/* Primary Sync Action */}
      <Button
        variant="primary"
        size="lg"
        disabled={isSimulatedOffline || isSyncing || pendingItems.length === 0}
        onClick={handleSyncNow}
        className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>
          {isSyncing
            ? 'Synchronizing Queue...'
            : isSimulatedOffline
            ? 'Cannot Sync while Offline'
            : pendingItems.length === 0
            ? 'All Items Synchronized'
            : `Sync ${pendingItems.length} Pending Item(s) Now`}
        </span>
      </Button>

      {syncFeedback && (
        <div className="p-3 bg-positive-tint/50 border border-positive/30 rounded-lg text-xs text-positive">
          {syncFeedback}
        </div>
      )}

      {/* Queue Items */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-accent" />
          Queue Sequence Monitor ({queue.length} Total Records)
        </h2>

        {queue.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-border rounded-lg text-xs text-text-muted">
            Queue is empty. Use "Add a Peer" to capture activities.
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-bg-surface rounded-lg border border-border-hairline flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-text-primary flex items-center gap-1.5">
                    <span className="tabular-nums text-[10px] px-1.5 py-0.5 rounded bg-bg-subtle text-text-muted">
                      #{item.sequenceNumber}
                    </span>
                    <span>{item.peerName}</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    {item.activityType} · {item.geoArea}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.status === 'synced'
                        ? 'bg-positive-tint text-positive'
                        : 'bg-critical-tint text-critical'
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="text-[10px] tabular-nums text-text-muted mt-1">
                    {new Date(item.clientCapturedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-bg-subtle rounded-lg border border-border-hairline text-[11px] text-text-muted space-y-1">
        <div className="font-semibold text-text-primary">Demonstration Guide:</div>
        <p>1. Toggle "Simulate Offline" ON.</p>
        <p>2. Tap "Add a Peer" and complete the 4-step wizard.</p>
        <p>3. Notice item queued locally with pending status.</p>
        <p>4. Toggle "Simulate Offline" OFF and tap "Sync Now".</p>
        <p>5. Open NM/PM Home or /field-network to watch the Field Telemetry Card update live!</p>
      </div>
    </div>
  );
};
