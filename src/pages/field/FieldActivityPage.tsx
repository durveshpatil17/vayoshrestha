import React, { useState, useEffect } from 'react';
import { getFieldQueue, FieldQueueItem } from '@/domain/field/offlineQueue';
import { useAuthStore } from '@/store/authStore';
import {
  Clock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Filter,
  MapPin,
  Calendar,
} from 'lucide-react';

export const FieldActivityPage: React.FC = () => {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'onboarding' | 'check_in_visit'>('all');
  const [activities, setActivities] = useState<FieldQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const q = getFieldQueue();
      // Include seeded baseline activities for rich prototype display
      const baseline: FieldQueueItem[] = [
        {
          id: 'base-1',
          sequenceNumber: 101,
          idempotencyKey: 'idemp-seed-1',
          associateId: user?.id || 'u-sf-1',
          chapterId: 'HUB-PUN',
          activityType: 'onboarding',
          peerName: 'Kamala Devi Joshi',
          peerPhone: '9822019991',
          geoArea: 'Shivajinagar, Pune',
          doubleConsentState: 'confirmed',
          clientCapturedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
          syncedAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
          status: 'synced',
          isLateSync: false,
          retryCount: 0,
        },
        {
          id: 'base-2',
          sequenceNumber: 102,
          idempotencyKey: 'idemp-seed-2',
          associateId: user?.id || 'u-sf-1',
          chapterId: 'HUB-PUN',
          activityType: 'check_in_visit',
          peerName: 'Ramdas Vishnu Kelkar',
          peerPhone: '9822019992',
          geoArea: 'Ghole Road, Pune',
          doubleConsentState: 'consent_2_requested',
          clientCapturedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          status: 'pending',
          isLateSync: false,
          retryCount: 0,
        },
        {
          id: 'base-3',
          sequenceNumber: 103,
          idempotencyKey: 'idemp-seed-3',
          associateId: user?.id || 'u-sf-1',
          chapterId: 'HUB-PUN',
          activityType: 'onboarding',
          peerName: 'Shalini Prabhakar',
          peerPhone: '9822019993',
          geoArea: 'Model Colony, Pune',
          doubleConsentState: 'confirmed',
          clientCapturedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
          syncedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          status: 'synced',
          isLateSync: true,
          retryCount: 0,
        },
      ];

      setActivities([...q, ...baseline]);
      setIsLoading(false);
    }, 150);
  }, [user?.id]);

  const filtered = activities.filter((a) => {
    if (filter === 'all') return true;
    return a.activityType === filter;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          My Activity Log
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Interactions captured in your assigned Ekta Hub area.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
            filter === 'all'
              ? 'bg-accent text-white'
              : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-hairline'
          }`}
        >
          All Activities ({activities.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('onboarding')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
            filter === 'onboarding'
              ? 'bg-accent text-white'
              : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-hairline'
          }`}
        >
          Onboardings
        </button>
        <button
          type="button"
          onClick={() => setFilter('check_in_visit')}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
            filter === 'check_in_visit'
              ? 'bg-accent text-white'
              : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-hairline'
          }`}
        >
          Visits & Follow-ups
        </button>
      </div>

      {/* Activities List */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-text-muted">Loading activities...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-lg text-xs text-text-muted">
          No activities found in this filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-bg-surface rounded-lg border border-border-hairline space-y-2 hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-sm text-text-primary">{item.peerName}</div>
                  <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span>{item.geoArea}</span>
                  </div>
                </div>

                {/* Status Chips */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.status === 'synced'
                        ? 'bg-positive-tint text-positive'
                        : item.status === 'pending'
                        ? 'bg-critical-tint text-critical'
                        : 'bg-bg-subtle text-text-secondary'
                    }`}
                  >
                    {item.status === 'synced' ? 'Synced' : 'Captured offline'}
                  </span>
                  {item.isLateSync && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-critical-tint text-critical">
                      Late Sync (&gt;24h)
                    </span>
                  )}
                </div>
              </div>

              {/* Consent & Metadata Details */}
              <div className="pt-1.5 border-t border-border-hairline flex items-center justify-between text-[11px] text-text-secondary">
                <span className="capitalize">
                  {item.activityType.replace(/_/g, ' ')}
                </span>
                <span className="tabular-nums">
                  {new Date(item.clientCapturedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
