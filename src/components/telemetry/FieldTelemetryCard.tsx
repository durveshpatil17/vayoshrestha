import React, { useState, useEffect } from 'react';
import { getFieldQueue, FieldQueueItem } from '@/domain/field/offlineQueue';
import {
  Wifi,
  WifiOff,
  Activity,
  Clock,
  MapPin,
  RefreshCw,
  Table,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
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
      className={`bg-bg-surface border border-border rounded-xl p-5  space-y-4 ${className}`}
      data-testid="field-telemetry-card"
    >
      {/* Header with Title, Live Badge, and View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-hairline">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-tint text-accent flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary text-base">
                Field Network Telemetry
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-positive-tint text-positive text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                Live Feed
              </span>
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              Real-time last-mile synchronization across 9 Ekta Hub chapters
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-text-muted">
            Last updated: <span className="font-medium text-text-secondary">{lastUpdated}</span>
          </span>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'visual' ? 'table' : 'visual')}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-border-hairline bg-bg-subtle text-text-secondary hover:text-text-primary transition-colors"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{viewMode === 'visual' ? 'View as Table' : 'View as Graphic'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-bg-subtle/50 rounded-lg border border-border-hairline">
              <div className="text-[11px] font-medium text-text-muted">Active Field Gigs</div>
              <div className="text-2xl font-semibold text-accent tabular-nums mt-1">
                {activeGigs60m}
                <span className="text-xs font-normal text-text-muted ml-1.5">
                  / {activeGigs24h} (24h)
                </span>
              </div>
              <div className="text-[10px] text-text-secondary mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-positive inline-block" />
                42 associates online
              </div>
            </div>

            <div className="p-3 bg-bg-subtle/50 rounded-lg border border-border-hairline">
              <div className="text-[11px] font-medium text-text-muted">Last-Mile Syncs Today</div>
              <div className="text-2xl font-semibold text-text-primary tabular-nums mt-1">
                {syncsToday}
                <span className="text-xs font-semibold text-positive ml-1.5">
                  +{syncsLastHour} / 1h
                </span>
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Median delay: <strong className="font-semibold text-text-primary">{medianDelayMinutes}m</strong>
              </div>
            </div>

            <div className="p-3 bg-bg-subtle/50 rounded-lg border border-border-hairline">
              <div className="text-[11px] font-medium text-text-muted">Offline Queues Depth</div>
              <div className="text-2xl font-semibold text-critical tabular-nums mt-1">
                {pendingInQueue}
                <span className="text-xs font-normal text-text-muted ml-1.5">
                  waiting sync
                </span>
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Encrypted in browser storage
              </div>
            </div>

            <div className="p-3 bg-bg-subtle/50 rounded-lg border border-border-hairline">
              <div className="text-[11px] font-medium text-text-muted">Late Syncs (&gt;24h)</div>
              <div className="text-2xl font-semibold text-text-primary tabular-nums mt-1">
                {lateSyncs}
                <span className="text-xs font-medium text-text-muted ml-1.5">
                  ({((lateSyncs / syncsToday) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Audited & flagged SLA
              </div>
            </div>
          </div>

          {/* 24-Hour Sync Sparkline & Chapter Activity Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* 24-Hour Sparkline */}
            <div className="p-3 bg-bg-subtle/30 rounded-lg border border-border-hairline space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  Hourly Synchronization Volume (24h)
                </span>
                <span className="text-[11px] text-text-muted tabular-nums">Peak: 82 syncs/h</span>
              </div>

              {/* Sparkline Visual SVG */}
              <div className="h-16 flex items-end gap-1 pt-2">
                {sparklineData.map((val, idx) => {
                  const heightPct = Math.max(10, Math.round((val / 85) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-accent/80 hover:bg-accent rounded-t transition-all"
                      style={{ height: `${heightPct}%` }}
                      title={`Hour ${idx}:00 — ${val} synchronizations`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-text-muted pt-1">
                <span>00:00 IST</span>
                <span>12:00 IST</span>
                <span>Now</span>
              </div>
            </div>

            {/* Per-Chapter Activity Strip (9 chapters) */}
            <div className="p-3 bg-bg-subtle/30 rounded-lg border border-border-hairline space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  Chapter Activity Share (9 Hubs)
                </span>
                <span className="text-[11px] text-text-muted">Tabular &amp; Inline Bars</span>
              </div>

              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {chaptersActivity.map((ch) => (
                  <div key={ch.code} className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-[11px] text-text-secondary truncate">
                      {ch.name}
                    </span>
                    <div className="flex-1 h-2 bg-border-hairline rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${ch.percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-text-primary tabular-nums text-[11px]">
                      {ch.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Activity Ticker (BroadcastChannel Real-Time) */}
          <div className="p-3 bg-accent-tint/30 rounded-lg border border-accent/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent text-white">
                Live Ticker
              </span>
              <div className="flex items-center gap-2 text-text-primary truncate max-w-[500px]">
                <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span className="font-medium">{tickerEvents[0]?.chapterName}:</span>
                <span className="text-text-secondary">{tickerEvents[0]?.areaLabel}</span>
                <span className="text-text-muted">· {tickerEvents[0]?.activityType}</span>
                <span className="text-text-muted text-[10px]">({tickerEvents[0]?.timeAgo})</span>
              </div>
            </div>

            <div className="text-[11px] text-accent font-medium">
              Listening on BroadcastChannel across tabs
            </div>
          </div>
        </>
      ) : (
        /* Accessible Data Table View */
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-muted text-[11px] font-semibold bg-bg-subtle/50">
                <th className="py-2 px-3">Metric Name</th>
                <th className="py-2 px-3">Current Value</th>
                <th className="py-2 px-3">24-Hour Benchmark</th>
                <th className="py-2 px-3">Calculation Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-secondary">
              <tr>
                <td className="py-2 px-3 font-medium text-text-primary">Active Field Gigs</td>
                <td className="py-2 px-3 font-semibold text-accent tabular-nums">{activeGigs60m}</td>
                <td className="py-2 px-3 tabular-nums">{activeGigs24h} in 24h</td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  Associates with ≥1 logged activity in the 60m / 24h window
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-text-primary">Last-Mile Synchronizations</td>
                <td className="py-2 px-3 font-semibold text-text-primary tabular-nums">{syncsToday}</td>
                <td className="py-2 px-3 tabular-nums">+{syncsLastHour} in last hour</td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  Offline-captured items successfully committed to central store
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-text-primary">Median Capture-to-Sync Delay</td>
                <td className="py-2 px-3 font-semibold text-text-primary tabular-nums">{medianDelayMinutes} min</td>
                <td className="py-2 px-3 tabular-nums">&lt;45 min SLA</td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  Time elapsed between local device timestamp and sync commit
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-text-primary">Late Synchronizations (&gt;24h)</td>
                <td className="py-2 px-3 font-semibold text-critical tabular-nums">{lateSyncs}</td>
                <td className="py-2 px-3 tabular-nums">&lt;5% threshold</td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  Sync delay exceeding 24 hours; automatically audited for review
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-text-primary">Waiting in Local Queues</td>
                <td className="py-2 px-3 font-semibold text-critical tabular-nums">{pendingInQueue}</td>
                <td className="py-2 px-3 tabular-nums">—</td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  Encrypted AES-GCM payloads currently waiting on field devices
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Demo Guidance Link */}
      <div className="pt-2 border-t border-border-hairline flex flex-wrap items-center justify-between text-[11px] text-text-muted">
        <div>
          <span className="font-semibold text-text-primary">Definitions: </span>
          Active Field Gig = associate with ≥1 logged activity · Last-Mile Sync = offline-captured item delivered.
        </div>
        <div className="font-medium text-accent">
          Try demo: Open <code className="bg-bg-subtle px-1 rounded text-text-primary">/field</code> in another tab, add a peer, then sync!
        </div>
      </div>
    </div>
  );
};
