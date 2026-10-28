import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { eventQueue } from '@/mock/eventQueue';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import { getMinutesToSlaBreach } from '@/domain/sos';
import {
  AlertOctagon,
  Clock,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Filter,
  Eye,
  Radio,
  Wifi,
  WifiOff,
  UserCheck,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { SosEvent } from '@/api/contracts';

export const SosBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const chimeEnabled = useAuthStore((s) => s.chimeEnabled);
  const setOpenSosCount = useAuthStore((s) => s.setOpenSosCount);

  const [tick, setTick] = useState(0);
  const [filterType, setFilterType] = useState<'ALL' | 'REAL' | 'DRILL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE_ONLY');
  const [assignModalEvent, setAssignModalEvent] = useState<SosEvent | null>(null);
  const [selectedResponderId, setSelectedResponderId] = useState<string>('');

  // Re-render every second for real-time SLA countdowns & timers
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to cross-tab BroadcastChannel & EventQueue
  useEffect(() => {
    const unsubscribe = eventQueue.subscribe((event) => {
      if (event.type === 'SOS_TRIGGERED' || event.type === 'FALLBACK_SMS_TRIGGERED') {
        setTick((t) => t + 1);
        if (chimeEnabled) {
          // Play subtle tone or log chime
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 520;
            gain.gain.value = 0.08;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch {
            // Audio context blocked by browser autoplay policy
          }
        }
      }
    });
    return () => unsubscribe();
  }, [chimeEnabled]);

  const data = mockStore.getData();
  const allEvents = data.sosEvents;

  // Filter based on user's region or chapter scope
  const scopedEvents = allEvents.filter((ev) => {
    if (user?.role === 'CM' && ev.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === ev.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    if (user?.role === 'CT') {
      if (ev.assignedResponderId && ev.assignedResponderId !== user.id) return false;
    }
    return true;
  });

  // Calculate open / active alerts
  const openEvents = scopedEvents.filter(
    (e) => e.status === 'TRIGGERED' || e.status === 'ACKNOWLEDGED' || e.status === 'RESPONDED'
  );

  useEffect(() => {
    setOpenSosCount(openEvents.length);
    if (openEvents.length > 0) {
      document.title = `(${openEvents.length}) 🚨 SOS Board | Vayoshreshtha`;
    } else {
      document.title = 'SOS Board | Vayoshreshtha';
    }
    return () => {
      document.title = 'Vayoshreshtha — Pilot Portal';
    };
  }, [openEvents.length, setOpenSosCount]);

  // Apply visual filters
  const filteredEvents = scopedEvents.filter((ev) => {
    if (filterType === 'REAL' && ev.isDrill) return false;
    if (filterType === 'DRILL' && !ev.isDrill) return false;

    if (statusFilter === 'ACTIVE_ONLY') {
      return ev.status === 'TRIGGERED' || ev.status === 'ACKNOWLEDGED' || ev.status === 'RESPONDED';
    }
    if (statusFilter !== 'ALL' && ev.status !== statusFilter) return false;

    return true;
  });

  // Sort: Active first, then by timestamp desc
  filteredEvents.sort((a, b) => {
    const aActive = a.status === 'TRIGGERED' || a.status === 'ACKNOWLEDGED';
    const bActive = b.status === 'TRIGGERED' || b.status === 'ACKNOWLEDGED';
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });

  const responders = data.users.filter((u) => u.role === 'CT' || u.role === 'CM');

  const handleAcknowledge = (event: SosEvent) => {
    event.status = 'ACKNOWLEDGED';
    event.acknowledgedAt = new Date().toISOString();
    event.slaBreached =
      new Date().getTime() - new Date(event.triggeredAt).getTime() > 2 * 60 * 1000;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: event.chapterId,
      action: 'SOS_ACKNOWLEDGE',
      entityType: 'SOS',
      entityId: event.id,
      details: `SOS alert acknowledged by ${user?.name || user?.role}.`,
    });

    mockStore.persist();
    setTick((t) => t + 1);
  };

  const handleAssignConfirm = () => {
    if (!assignModalEvent || !selectedResponderId) return;
    assignModalEvent.assignedResponderId = selectedResponderId;
    assignModalEvent.status = 'RESPONDED';

    const respUser = data.users.find((u) => u.id === selectedResponderId);
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: assignModalEvent.chapterId,
      action: 'SOS_ASSIGN',
      entityType: 'SOS',
      entityId: assignModalEvent.id,
      details: `Case assigned to responder ${respUser?.name || selectedResponderId}.`,
    });

    mockStore.persist();
    setAssignModalEvent(null);
    setSelectedResponderId('');
    setTick((t) => t + 1);
  };

  // Helper for alert age display
  const getAgeDisplay = (iso: string) => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}m ${secs}s ago`;
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Non-strobing persistent red banner for active critical alerts */}
      {openEvents.length > 0 && (
        <div className="bg-danger text-white rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-danger-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  Active Emergency Alert ({openEvents.length})
                </span>
                <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[11px] tabular-nums">
                  SLA: 2 Min Max Response
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5">
                Immediate regional attention required. Cellular SMS fallbacks dispatched automatically
                where mobile data network was interrupted.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('ACTIVE_ONLY');
                setTick((t) => t + 1);
              }}
              className="bg-white text-danger hover:bg-white/90 font-semibold border-transparent text-xs"
            >
              Focus Active Alerts
            </Button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Emergency SOS Command Board"
          description="Real-time multi-tab monitoring, automated cellular fallback tracking, and SLA escalation control."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos/drills')}
            className="text-xs gap-1"
          >
            <Radio className="w-3.5 h-3.5" />
            Simulate Drill
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos/settings')}
            className="text-xs gap-1"
          >
            SLA Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sms-log')}
            className="text-xs gap-1"
          >
            Cellular Outbox
          </Button>
        </div>
      </div>

      {/* Filter and stats bar */}
      <div className="bg-white border border-border-hairline rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <div className="flex border border-border-hairline rounded overflow-hidden text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 ${
                filterType === 'ALL'
                  ? 'bg-accent text-white font-medium'
                  : 'bg-white text-text-primary hover:bg-surface-subtle'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilterType('REAL')}
              className={`px-3 py-1.5 border-l border-border-hairline ${
                filterType === 'REAL'
                  ? 'bg-accent text-white font-medium'
                  : 'bg-white text-text-primary hover:bg-surface-subtle'
              }`}
            >
              Real Only
            </button>
            <button
              onClick={() => setFilterType('DRILL')}
              className={`px-3 py-1.5 border-l border-border-hairline ${
                filterType === 'DRILL'
                  ? 'bg-accent text-white font-medium'
                  : 'bg-white text-text-primary hover:bg-surface-subtle'
              }`}
            >
              Drills Only
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-border-hairline rounded bg-white text-text-primary focus:outline-none"
          >
            <option value="ACTIVE_ONLY">Active Cases (Open)</option>
            <option value="ALL">All Statuses</option>
            <option value="TRIGGERED">Triggered (Unacknowledged)</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESPONDED">Responded / Assigned</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED_BY_SENIOR">Cancelled by Senior</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger"></span>
            Triggered: {scopedEvents.filter((e) => e.status === 'TRIGGERED').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            Acknowledged: {scopedEvents.filter((e) => e.status === 'ACKNOWLEDGED').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Resolved: {scopedEvents.filter((e) => e.status === 'RESOLVED').length}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-3 px-4">Alert Age / SLA</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Trigger Network</th>
                <th className="py-3 px-4">Cellular Fallback</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2 opacity-60" />
                    <p className="font-medium text-text-primary text-sm">No Active SOS Alerts</p>
                    <p className="text-xs mt-0.5">
                      All emergency cases are resolved or no alerts match the current filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);
                  const isUnacknowledged = ev.status === 'TRIGGERED';
                  const isSlaBreached = ev.slaBreached;
                  const assignee = data.users.find((u) => u.id === ev.assignedResponderId);

                  return (
                    <tr
                      key={ev.id}
                      className={`hover:bg-surface-subtle transition-colors ${
                        isUnacknowledged
                          ? 'bg-danger-surface/40 font-medium'
                          : ev.isDrill
                          ? 'bg-amber-50/20'
                          : ''
                      }`}
                    >
                      {/* Age & SLA countdown */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="tabular-nums text-text-primary font-semibold">
                            {getAgeDisplay(ev.triggeredAt)}
                          </span>
                          {ev.status !== 'RESOLVED' && ev.status !== 'CANCELLED_BY_SENIOR' && (
                            <span
                              className={`text-[10px] tabular-nums mt-0.5 ${
                                isSlaBreached ? 'text-danger font-semibold' : 'text-text-muted'
                              }`}
                            >
                              {isSlaBreached ? '⚠️ SLA BREACHED' : 'Ack SLA: < 2 min'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Senior */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-text-primary flex items-center gap-1.5">
                            {senior?.fullName || 'Unknown Senior'}
                            {ev.isDrill && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-slate-200 text-slate-700 rounded font-semibold">
                                Drill
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] tabular-nums text-text-muted">
                            {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Chapter */}
                      <td className="py-3 px-4 text-text-primary">
                        <span className="px-2 py-0.5 bg-surface-subtle border border-border-hairline rounded text-[11px]">
                          {ev.chapterId}
                        </span>
                      </td>

                      {/* Network Status at trigger */}
                      <td className="py-3 px-4">
                        {ev.networkStatusAtTrigger === 'DISCONNECTED' ? (
                          <span className="inline-flex items-center gap-1 text-danger font-medium text-[11px] bg-danger-surface px-1.5 py-0.5 rounded border border-danger/20">
                            <WifiOff className="w-3 h-3" /> Data Dropped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-success text-[11px]">
                            <Wifi className="w-3 h-3" /> Online
                          </span>
                        )}
                      </td>

                      {/* Fallback SMS Status */}
                      <td className="py-3 px-4">
                        {ev.cellularFallbackTriggered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-accent font-medium">
                            <Radio className="w-3 h-3 text-accent" />
                            {ev.cellularFallbackDelivered
                              ? 'NOK SMS Delivered'
                              : 'SMS Dispatched'}
                          </span>
                        ) : (
                          <span className="text-text-muted text-[11px]">Not Required</span>
                        )}
                      </td>

                      {/* Status chip */}
                      <td className="py-3 px-4">
                        <StatusChip
                          status={
                            ev.status === 'TRIGGERED'
                              ? 'danger'
                              : ev.status === 'ACKNOWLEDGED'
                              ? 'warning'
                              : ev.status === 'RESOLVED'
                              ? 'success'
                              : 'neutral'
                          }
                          label={ev.status}
                        />
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4 text-text-muted">
                        {assignee ? (
                          <span className="text-text-primary font-medium">{assignee.name}</span>
                        ) : (
                          <span className="italic text-text-muted text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isUnacknowledged && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAcknowledge(ev)}
                              className="text-xs bg-danger hover:bg-danger/90 text-white font-semibold px-2 py-1 h-7"
                            >
                              Acknowledge
                            </Button>
                          )}
                          {!assignee &&
                            (ev.status === 'TRIGGERED' || ev.status === 'ACKNOWLEDGED') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAssignModalEvent(ev);
                                  setSelectedResponderId(responders[0]?.id || '');
                                }}
                                className="text-xs px-2 py-1 h-7 gap-1"
                              >
                                <UserCheck className="w-3 h-3" />
                                Assign
                              </Button>
                            )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/sos/${ev.id}`)}
                            className="text-xs px-2 py-1 h-7 gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Case
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-sm w-full p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              Assign Case Responder
            </h3>
            <p className="text-xs text-text-muted">
              Select an on-duty Care Team member or Chapter Manager to respond to this emergency.
            </p>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Responder
              </label>
              <select
                value={selectedResponderId}
                onChange={(e) => setSelectedResponderId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              >
                {responders.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.role} - {r.chapterId || r.regionId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-hairline">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignModalEvent(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAssignConfirm}
                className="text-xs"
              >
                Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
