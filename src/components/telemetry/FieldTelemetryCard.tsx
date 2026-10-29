import React, { useState, useEffect } from 'react';
import { getFieldQueue } from '@/domain/field/offlineQueue';
import {
  Activity,
  Table,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface TickerEvent {
  id: string;
  chapterName: string;
  areaLabel: string;
  activityType: string;
  timeAgo: string;
  isLate: boolean;
}

export const FieldTelemetryCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [tickerEvents, setTickerEvents] = useState<TickerEvent[]>([
    {
      id: 'tick-1',
      chapterName: 'Pune Ekta Hub',
      areaLabel: 'Shivajinagar Central',
      activityType: 'onboarding captured',
      timeAgo: '2m ago',
      isLate: false,
    },
    {
      id: 'tick-2',
      chapterName: 'Bengaluru Ekta Hub',
      areaLabel: 'Malleshwaram East',
      activityType: 'wellness visit synced',
      timeAgo: '6m ago',
      isLate: false,
    },
    {
      id: 'tick-3',
      chapterName: 'Nashik Ekta Hub',
      areaLabel: 'Gangapur Road',
      activityType: 'consent 2 verified',
      timeAgo: '14m ago',
      isLate: false,
    },
  ]);

  const [sparklineData, setSparklineData] = useState<number[]>([
    4, 6, 8, 5, 12, 18, 24, 32, 28, 35, 42, 38, 45, 52, 48, 56, 61, 58, 64, 70, 72, 68, 75, 82,
  ]);

  // Compute live metrics from local offline queue + seeded store baseline
  const queue = getFieldQueue();
  const pendingInQueue = queue.filter((q) => q.status === 'pending').length;
  const syncedLocalCount = queue.filter((q) => q.status === 'synced').length;

  const activeGigs60m = 18 + (queue.length > 0 ? 1 : 0);
  const activeGigs24h = 47 + (queue.length > 0 ? 1 : 0);
  const syncsToday = 142 + syncedLocalCount;
  const syncsLastHour = 23 + (syncedLocalCount > 0 ? 1 : 0);
  const lateSyncs = 4 + queue.filter((q) => q.isLateSync).length;
  const medianDelayMinutes = 38;

  // 9 Chapters tabular counts & inline distribution
  const chaptersActivity = [
    { code: 'PUN', name: 'Pune', count: 28 + (queue.length > 0 ? queue.length : 0), percent: 85 },
    { code: 'BLR', name: 'Bengaluru', count: 24, percent: 74 },
    { code: 'NSK', name: 'Nashik', count: 18, percent: 56 },
    { code: 'MYS', name: 'Mysuru', count: 15, percent: 48 },
    { code: 'NAG', name: 'Nagpur', count: 14, percent: 44 },
    { code: 'CHE', name: 'Chennai', count: 13, percent: 41 },
    { code: 'IND', name: 'Indore', count: 11, percent: 35 },
    { code: 'JAI', name: 'Jaipur', count: 10, percent: 32 },
    { code: 'LUK', name: 'Lucknow', count: 9, percent: 28 },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);

    // Listen to BroadcastChannel for cross-tab field sync events
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('vayoshrestha_field_telemetry');
        channel.onmessage = (event) => {
          if (event.data) {
            const newTick: TickerEvent = {
              id: `tick-${Date.now()}`,
              chapterName: event.data.chapterId === 'HUB-BLR' ? 'Bengaluru Ekta Hub' : 'Pune Ekta Hub',
              areaLabel: event.data.areaLabel || 'Local Area',
              activityType: `${event.data.activityType?.replace(/_/g, ' ')} synced`,
              timeAgo: 'Just now',
              isLate: false,
            };
            setTickerEvents((prev) => [newTick, ...prev.slice(0, 4)]);
            setSparklineData((prev) => {
              const next = [...prev];
              next[next.length - 1] += 1;
              return next;
            });
            updateTime();
          }
        };
      }
    } catch {
      // ignore
    }

    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  return (
    <div
      className={`bg-surface border border-border rounded-container p-6 space-y-5 transition-colors ${className}`}
      data-testid="field-telemetry-card"
    >
      {/* Header: Title, Live indicator, Inline figures, View as Table */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-accent stroke-[1.5]" />
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold text-text text-base">
                Operational field network
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-chip bg-positive-tint text-positive text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
                Live feed
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Last-mile field synchronization across 9 chapters
            </p>
          </div>
        </div>

        {/* Inline headline figures */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-xs text-text-secondary block">Active field gigs</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-text tabular-nums">{activeGigs60m}</span>
              <span className="text-xs text-text-secondary tabular-nums">/ {activeGigs24h} (24h)</span>
            </div>
          </div>

          <div className="border-l border-border-subtle pl-6">
            <span className="text-xs text-text-secondary block">Last-mile syncs</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-text tabular-nums">{syncsToday}</span>
              <span className="text-xs text-positive font-semibold tabular-nums">+{syncsLastHour} / 1h</span>
            </div>
          </div>

          <div className="border-l border-border-subtle pl-6 flex items-center gap-3">
            <span className="text-xs tabular-nums text-text-secondary">
              {lastUpdated}
            </span>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'visual' ? 'table' : 'visual')}
              className="h-8 px-2.5 rounded-control text-xs font-semibold border border-border bg-surface-subtle text-text hover:bg-surface-hover flex items-center gap-1.5 transition-colors"
            >
              <Table className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>{viewMode === 'visual' ? 'View as table' : 'View as graphic'}</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <>
          {/* Key-Value Operational Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-control bg-page border border-border">
            <div>
              <span className="text-xs text-text-secondary block">Median delay</span>
              <span className="text-base font-semibold text-text tabular-nums">
                {medianDelayMinutes} min
              </span>
              <span className="text-xs text-text-secondary block mt-0.5">&lt;45m target</span>
            </div>

            <div>
              <span className="text-xs text-text-secondary block">Late syncs (&gt;24h)</span>
              <span className="text-base font-semibold text-critical tabular-nums">
                {lateSyncs}
              </span>
              <span className="text-xs text-text-secondary block mt-0.5">
                {((lateSyncs / syncsToday) * 100).toFixed(1)}% of total
              </span>
            </div>

            <div>
              <span className="text-xs text-text-secondary block">Offline queue depth</span>
              <span className="text-base font-semibold text-text tabular-nums">
                {pendingInQueue} items
              </span>
              <span className="text-xs text-text-secondary block mt-0.5">Encrypted in browser</span>
            </div>

            <div>
              <span className="text-xs text-text-secondary block">Associates online</span>
              <span className="text-base font-semibold text-positive tabular-nums">
                42 active
              </span>
              <span className="text-xs text-text-secondary block mt-0.5">Coarse geostamp</span>
            </div>
          </div>

          {/* 24-Hour Sparkline & 9-Chapter Distribution Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 24-Hour Synchronization Volume */}
            <div className="p-4 rounded-control bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">
                  Hourly synchronization volume (24h)
                </span>
                <span className="text-xs text-text-secondary tabular-nums">Peak: 82 syncs/h</span>
              </div>

              {/* Sparkline Bars */}
              <div className="h-20 flex items-end gap-1 pt-2">
                {sparklineData.map((val, idx) => {
                  const heightPct = Math.max(12, Math.round((val / 85) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-accent/80 hover:bg-accent rounded-t transition-all"
                      style={{ height: `${heightPct}%` }}
                      title={`Hour ${idx}:00 — ${val} syncs`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-text-secondary border-t border-border-subtle pt-1.5 tabular-nums">
                <span>00:00 IST</span>
                <span>12:00 IST</span>
                <span>Now</span>
              </div>
            </div>

            {/* 9 Chapters Activity Table with Inline Bars */}
            <div className="p-4 rounded-control bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text">
                  Chapter activity distribution (9 hubs)
                </span>
                <span className="text-xs text-text-secondary">Tabular counts</span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {chaptersActivity.map((ch) => (
                  <div key={ch.code} className="flex items-center gap-3 text-xs">
                    <span className="w-20 text-text-secondary truncate">
                      {ch.name}
                    </span>
                    <div className="flex-1 h-2 bg-page rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${ch.percent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-text tabular-nums">
                      {ch.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Live Activity Ticker (BroadcastChannel) */}
          <div className="p-3 rounded-control bg-accent-tint border border-accent/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-accent">
                Activity ticker:
              </span>
              <div className="flex items-center gap-2 text-text truncate max-w-xl">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 stroke-[1.5]" />
                <span className="font-semibold">{tickerEvents[0]?.chapterName}</span>
                <span className="text-text-secondary">({tickerEvents[0]?.areaLabel})</span>
                <span>· {tickerEvents[0]?.activityType}</span>
                <span className="text-text-secondary tabular-nums">({tickerEvents[0]?.timeAgo})</span>
              </div>
            </div>

            <span className="text-xs text-accent font-semibold">
              BroadcastChannel cross-tab synchronized
            </span>
          </div>
        </>
      ) : (
        /* Accessible Table View */
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-secondary text-xs font-semibold bg-surface-subtle">
                <th className="py-2.5 px-3">Metric name</th>
                <th className="py-2.5 px-3 text-right">Current value</th>
                <th className="py-2.5 px-3">24-hour benchmark</th>
                <th className="py-2.5 px-3">Calculation rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text">
              <tr className="h-10 hover:bg-surface-hover">
                <td className="py-2 px-3 font-semibold">Active field gigs</td>
                <td className="py-2 px-3 text-right font-semibold text-accent tabular-nums">{activeGigs60m}</td>
                <td className="py-2 px-3 tabular-nums text-text-secondary">{activeGigs24h} in 24h</td>
                <td className="py-2 px-3 text-text-secondary">
                  Field associates with ≥1 logged activity in 60m / 24h window
                </td>
              </tr>
              <tr className="h-10 hover:bg-surface-hover">
                <td className="py-2 px-3 font-semibold">Last-mile synchronizations</td>
                <td className="py-2 px-3 text-right font-semibold text-text tabular-nums">{syncsToday}</td>
                <td className="py-2 px-3 tabular-nums text-text-secondary">+{syncsLastHour} in last hour</td>
                <td className="py-2 px-3 text-text-secondary">
                  Offline-captured items successfully committed to store
                </td>
              </tr>
              <tr className="h-10 hover:bg-surface-hover">
                <td className="py-2 px-3 font-semibold">Median capture-to-sync delay</td>
                <td className="py-2 px-3 text-right font-semibold text-text tabular-nums">{medianDelayMinutes} min</td>
                <td className="py-2 px-3 text-text-secondary">&lt;45 min SLA</td>
                <td className="py-2 px-3 text-text-secondary">
                  Time elapsed between local device timestamp and sync commit
                </td>
              </tr>
              <tr className="h-10 hover:bg-surface-hover">
                <td className="py-2 px-3 font-semibold">Late synchronizations (&gt;24h)</td>
                <td className="py-2 px-3 text-right font-semibold text-critical tabular-nums">{lateSyncs}</td>
                <td className="py-2 px-3 text-text-secondary">&lt;5% threshold</td>
                <td className="py-2 px-3 text-text-secondary">
                  Sync delay exceeding 24 hours; audited for review
                </td>
              </tr>
              <tr className="h-10 hover:bg-surface-hover">
                <td className="py-2 px-3 font-semibold">Waiting in local offline queues</td>
                <td className="py-2 px-3 text-right font-semibold text-critical tabular-nums">{pendingInQueue}</td>
                <td className="py-2 px-3 text-text-secondary">—</td>
                <td className="py-2 px-3 text-text-secondary">
                  Encrypted AES-GCM payloads currently waiting on local devices
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Definitions caption beneath */}
      <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between text-xs text-text-secondary">
        <div>
          <strong className="text-text font-semibold">Definitions:</strong> Active field gig = associate with ≥1 logged activity · Last-mile sync = offline-captured item delivered.
        </div>
        <div className="font-semibold text-accent">
          Try demo: Open /field in another tab, log a peer, then sync!
        </div>
      </div>
    </div>
  );
};
