import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { eventQueue } from '@/mock/eventQueue';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  Radio,
  Play,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const SosDrillsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [selectedSeniorId, setSelectedSeniorId] = useState(data.seniorCitizens[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState(data.chapters[0]?.id || '');
  const [simulateDisconnect, setSimulateDisconnect] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter drills only
  const drillEvents = data.sosEvents.filter((e) => e.isDrill);

  const handleLaunchDrill = (e: React.FormEvent) => {
    e.preventDefault();
    const senior = data.seniorCitizens.find((s) => s.id === selectedSeniorId);
    if (!senior) return;

    const drillId = `SOS-DRILL-${Date.now()}`;
    const triggeredAt = new Date().toISOString();
    const latency = Math.floor(Math.random() * 180) + 120; // 120 - 300 ms

    const drillEvent = {
      id: drillId,
      seniorId: senior.id,
      chapterId: selectedChapterId,
      triggeredAt,
      status: 'TRIGGERED' as const,
      isDrill: true,
      networkStatusAtTrigger: (simulateDisconnect ? 'DISCONNECTED' : 'ONLINE') as any,
      cellularFallbackTriggered: simulateDisconnect,
      cellularFallbackDelivered: simulateDisconnect,
      latencyMs: latency,
      slaBreached: false,
      notes: `[Operational Drill Initiated by ${user?.name || user?.role}]`,
    };

    data.sosEvents.unshift(drillEvent);

    if (simulateDisconnect) {
      const contacts = data.emergencyContacts.filter((c) => c.seniorId === senior.id);
      const recipient = contacts[0]?.phoneNumber || '+919876543210';
      data.smsFallbackRecords.unshift({
        id: `SMS-DRILL-${Date.now()}`,
        sosEventId: drillId,
        recipientPhoneNumber: recipient,
        messageText: `[DRILL] Vayoh Vikas: Emergency test triggered for ${senior.fullName}. Please do not panic.`,
        dltTemplateId: '1407161234567890123',
        status: 'DELIVERED',
        dispatchedAt: triggeredAt,
        deliveredAt: new Date(Date.now() + 1800).toISOString(),
        triggerReason: 'DRILL_DATA_DISCONNECT_SIMULATION',
        retryCount: 0,
      });
    }

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: triggeredAt,
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: selectedChapterId,
      action: 'SOS_DRILL_LAUNCH',
      entityType: 'SOS',
      entityId: drillId,
      details: `Simulated SOS drill launched for senior ${senior.fullName} (${senior.memberId}). Data disconnect: ${simulateDisconnect}`,
    });

    // Enqueue event for cross-tab notification
    eventQueue.enqueue({
      id: `EV-${Date.now()}`,
      type: 'SOS_TRIGGERED',
      timestamp: Date.now(),
      payload: drillEvent,
    });

    mockStore.persist();
    setFeedback(`Operational drill ${drillId} dispatched! Alert is live on the SOS Board.`);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sos')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Live SOS Board
        </Button>
      </div>

      <PageHeader
        title="Emergency Preparedness & Response Drills"
        description="Schedule unannounced or scheduled operational drills to test staff response SLA and cellular fallback integrity."
      />

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            {feedback}
          </span>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Drill Isolation Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block">Audit & Reporting Isolation:</span>
          All drill events are tagged with <code>isDrill = true</code> and are automatically excluded
          from real donor KPI reports, official incident rates, and SLA breach penalties.
        </div>
      </div>

      {/* Launch Drill Form */}
      <form
        onSubmit={handleLaunchDrill}
        className="bg-white border border-border-hairline rounded p-5 space-y-4"
      >
        <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
          <Radio className="w-4 h-4 text-accent" />
          Launch New Operational Drill
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-muted mb-1">
              Select Test Senior Persona:
            </label>
            <select
              value={selectedSeniorId}
              onChange={(e) => setSelectedSeniorId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border-hairline rounded bg-white"
            >
              {data.seniorCitizens.slice(0, 15).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.memberId} - {s.chapterId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-muted mb-1">Target Chapter Hub:</label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border-hairline rounded bg-white"
            >
              {data.chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 p-3 bg-surface-subtle border border-border-hairline rounded cursor-pointer">
              <input
                type="checkbox"
                checked={simulateDisconnect}
                onChange={(e) => setSimulateDisconnect(e.target.checked)}
                className="text-accent rounded"
              />
              <span className="text-xs text-text-primary">
                <strong>Simulate Mid-Transaction Data Disconnect:</strong> Exercises the cellular
                fallback routine to send transactional SMS to next-of-kin.
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border-hairline">
          <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5 bg-accent">
            <Play className="w-3.5 h-3.5 fill-current" />
            Trigger Simulated SOS Alert
          </Button>
        </div>
      </form>

      {/* Drill Results Log */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary">
            Past Drill Exercises ({drillEvents.length})
          </h3>
          <span className="text-xs text-text-muted">Filtered by isDrill = true</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Drill ID</th>
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Senior Tested</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Latency</th>
                <th className="py-2.5 px-4">SMS Fallback</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {drillEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    No drills conducted yet. Use the form above to run a preparedness test.
                  </td>
                </tr>
              ) : (
                drillEvents.map((ev) => {
                  const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);

                  return (
                    <tr key={ev.id} className="hover:bg-surface-subtle">
                      <td className="py-2.5 px-4 font-mono font-bold text-text-primary">{ev.id}</td>
                      <td className="py-2.5 px-4 font-mono text-text-muted">
                        {new Date(ev.triggeredAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-medium text-text-primary block">
                          {senior?.fullName || 'Test Senior'}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">{ev.chapterId}</td>
                      <td className="py-2.5 px-4 font-mono text-accent">{ev.latencyMs} ms</td>
                      <td className="py-2.5 px-4">
                        {ev.cellularFallbackTriggered ? (
                          <span className="text-accent font-medium text-[11px]">SMS Dispatched</span>
                        ) : (
                          <span className="text-text-muted text-[11px]">N/A (Data OK)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusChip
                          status={
                            ev.status === 'RESOLVED'
                              ? 'success'
                              : ev.status === 'TRIGGERED'
                              ? 'danger'
                              : 'warning'
                          }
                          label={ev.status}
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/sos/${ev.id}`)}
                          className="text-xs px-2 py-0.5 h-6"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
