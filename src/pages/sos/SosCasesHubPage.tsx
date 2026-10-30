import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { SosHistoryPage } from './SosHistoryPage';
import { SosDrillsPage } from './SosDrillsPage';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Shield, Radio, ArrowRight, Clock } from 'lucide-react';

export const SosCasesHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const currentTab = searchParams.get('tab') || 'active';

  const activeEvents = data.sosEvents.filter(
    (e) => e.status === 'Triggered' || e.status === 'Acknowledged' || e.status === 'TRIGGERED' || e.status === 'ACKNOWLEDGED'
  );

  const tabs = [
    {
      key: 'active',
      label: 'Active cases',
      badge: activeEvents.length,
      icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'all',
      label: 'All history',
      badge: data.sosEvents.length,
      icon: <Shield className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'drills',
      label: 'Disaster drills',
      icon: <Radio className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Emergency Cases & Drills Hub"
        description="Life-safety triage records, incident audit logs, and readiness drills"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => navigate('/sos')}
              className="flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Live SOS Board</span>
            </Button>
          </div>
        }
      />

      <NavTabBar tabs={tabs} defaultTab="active" />

      {/* Tab 1: Active Cases */}
      {currentTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-container p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">
                Active Emergency Incidents ({activeEvents.length})
              </h2>
              <span className="text-xs text-text-secondary">
                Auto-refreshed via BroadcastChannel
              </span>
            </div>

            {activeEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-secondary">
                No active emergency incidents currently open. All cases resolved or triaged.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-hover rounded-control px-2 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-control bg-negative-tint text-negative border border-negative/30 shrink-0">
                        <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text">{ev.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-text-secondary">
                            Senior: {ev.seniorId}
                          </span>
                          <span className="text-xs font-semibold text-negative">
                            {ev.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          Triggered: {new Date(ev.triggeredAt).toLocaleTimeString('en-IN')} · Chapter: {ev.chapterId}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/sos/${ev.id}`)}
                      className="self-end sm:self-center"
                    >
                      Triage case
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: All History */}
      {currentTab === 'all' && <SosHistoryPage />}

      {/* Tab 3: Drills */}
      {currentTab === 'drills' && <SosDrillsPage />}
    </div>
  );
};

