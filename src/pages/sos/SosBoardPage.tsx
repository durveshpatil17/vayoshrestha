import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { eventQueue } from '@/mock/eventQueue';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Clock,
  Radio,
  Wifi,
  WifiOff,
  UserCheck,
  Eye,
  CheckCircle2,
  Filter,
  ExternalLink,
  Send,
  AlertTriangle,
  X,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import { SosEvent } from '@/api/contracts';

export const SosBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const chimeEnabled = useAuthStore((s) => s.chimeEnabled);
  const setOpenSosCount = useAuthStore((s) => s.setOpenSosCount);

  const [, setTick] = useState(0);
  const [filterType, setFilterType] = useState<'ALL' | 'REAL' | 'DRILL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE_ONLY');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [assignModalEvent, setAssignModalEvent] = useState<SosEvent | null>(null);
  const [selectedResponderId, setSelectedResponderId] = useState<string>('');
  const [resolveModalEvent, setResolveModalEvent] = useState<SosEvent | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [quickNote, setQuickNote] = useState('');

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
          try {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      document.title = `(${openEvents.length}) SOS Board | Vayoshrestha`;
    } else {
      document.title = 'SOS Board | Vayoshrestha';
    }
    return () => {
      document.title = 'Vayoshrestha';
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

  // Active selected event or default to first open event
  const effectiveSelectedId =
    selectedEventId && filteredEvents.some((e) => e.id === selectedEventId)
      ? selectedEventId
      : filteredEvents.length > 0
      ? filteredEvents[0].id
      : null;

  const selectedEvent = scopedEvents.find((e) => e.id === effectiveSelectedId) || null;
  const selectedSenior = selectedEvent
    ? data.seniorCitizens.find((s) => s.id === selectedEvent.seniorId)
    : null;
  const selectedContacts = selectedEvent
    ? data.emergencyContacts.filter((c) => c.seniorId === selectedEvent.seniorId)
    : [];
  const selectedFallback = selectedEvent
    ? data.smsFallbackRecords.find((r) => r.sosEventId === selectedEvent.id)
    : null;

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

  const handleResolveConfirm = () => {
    if (!resolveModalEvent) return;
    resolveModalEvent.status = 'RESOLVED';
    resolveModalEvent.resolvedAt = new Date().toISOString();
    const resolutionNote = `[Resolved by ${user?.name || user?.role}]: ${resolveNotes.trim() || 'Assistance confirmed safe.'}`;
    resolveModalEvent.notes = resolveModalEvent.notes
      ? `${resolveModalEvent.notes}\n${resolutionNote}`
      : resolutionNote;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: resolveModalEvent.chapterId,
      action: 'SOS_RESOLVE',
      entityType: 'SOS',
      entityId: resolveModalEvent.id,
      details: `Incident resolved: ${resolveNotes.trim() || 'Safe confirmation recorded.'}`,
    });

    mockStore.persist();
    setResolveModalEvent(null);
    setResolveNotes('');
    setTick((t) => t + 1);
  };

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickNote.trim()) return;
    const noteEntry = `[${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} - ${
      user?.name || user?.role
    }]: ${quickNote.trim()}`;
    selectedEvent.notes = selectedEvent.notes
      ? `${selectedEvent.notes}\n${noteEntry}`
      : noteEntry;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: selectedEvent.chapterId,
      action: 'SOS_NOTE_ADDED',
      entityType: 'SOS',
      entityId: selectedEvent.id,
      details: `Note added to case ${selectedEvent.id}: "${quickNote.trim()}"`,
    });

    mockStore.persist();
    setQuickNote('');
    setTick((t) => t + 1);
  };

  const getAgeDisplay = (iso: string) => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}m ${secs}s ago`;
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Cloudscape Flashbar for Active Emergencies (Non-strobing) */}
      {openEvents.length > 0 && (
        <div
          role="alert"
          className="bg-negative-tint border-l-4 border-l-negative border border-border rounded-container p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-control bg-negative text-white shrink-0">
              <AlertOctagon className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-text">
                  Active emergency alerts ({openEvents.length})
                </span>
                <span className="px-2 py-0.5 rounded-chip bg-negative text-white text-xs font-semibold tabular-nums">
                  Response SLA: 2 min max
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Immediate regional attention required. Automated cellular SMS fallbacks dispatched where mobile data connectivity was interrupted.
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
              className="font-semibold text-xs text-negative border-negative/30 hover:bg-surface"
            >
              Focus active alerts
            </Button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Emergency SOS command board"
          description="Real-time incident triage, automated cellular fallback verification, and response SLA escalation control."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos/drills')}
            className="text-xs gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 stroke-[1.5]" />
            Simulate drill
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sos/settings')}
            className="text-xs gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
            SLA settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sms-log')}
            className="text-xs gap-1.5"
          >
            <Send className="w-3.5 h-3.5 stroke-[1.5]" />
            Cellular outbox
          </Button>
        </div>
      </div>

      {/* Filter and Overview Statistics Bar */}
      <div className="bg-surface border border-border rounded-container p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 stroke-[1.5]" />
            Filter:
          </span>
          <div className="flex border border-border rounded-control overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 transition-colors ${
                filterType === 'ALL'
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-surface text-text hover:bg-surface-hover'
              }`}
            >
              All alerts
            </button>
            <button
              type="button"
              onClick={() => setFilterType('REAL')}
              className={`px-3 py-1.5 border-l border-border transition-colors ${
                filterType === 'REAL'
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-surface text-text hover:bg-surface-hover'
              }`}
            >
              Real only
            </button>
            <button
              type="button"
              onClick={() => setFilterType('DRILL')}
              className={`px-3 py-1.5 border-l border-border transition-colors ${
                filterType === 'DRILL'
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-surface text-text hover:bg-surface-hover'
              }`}
            >
              Drills only
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="ACTIVE_ONLY">Active cases (open)</option>
            <option value="ALL">All statuses</option>
            <option value="TRIGGERED">Triggered (unacknowledged)</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESPONDED">Responded / assigned</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CANCELLED_BY_SENIOR">Cancelled by senior</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-negative" />
            Triggered: <strong className="text-text font-semibold">{scopedEvents.filter((e) => e.status === 'TRIGGERED').length}</strong>
          </span>
          <span className="flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-critical" />
            Acknowledged: <strong className="text-text font-semibold">{scopedEvents.filter((e) => e.status === 'ACKNOWLEDGED').length}</strong>
          </span>
          <span className="flex items-center gap-1.5 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-positive" />
            Resolved: <strong className="text-text font-semibold">{scopedEvents.filter((e) => e.status === 'RESOLVED').length}</strong>
          </span>
        </div>
      </div>

      {/* AWS Cloudscape Split Panel Layout: Triage Table (Left) + Incident Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Triage List Table (7 cols on lg, full on small) */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-container overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">
              Incident triage queue ({filteredEvents.length})
            </h3>
            <span className="text-xs text-text-secondary">
              Select row to inspect
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-subtle border-b border-border text-text-secondary font-normal">
                  <th className="py-2.5 px-3">Age / SLA</th>
                  <th className="py-2.5 px-3">Senior</th>
                  <th className="py-2.5 px-3">Chapter</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-secondary">
                      <CheckCircle2 className="w-8 h-8 text-positive mx-auto mb-2 opacity-70 stroke-[1.5]" />
                      <p className="font-semibold text-text text-sm">No active SOS alerts</p>
                      <p className="text-xs mt-0.5">
                        All emergency cases are resolved or no alerts match the filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);
                    const isUnacknowledged = ev.status === 'TRIGGERED';
                    const isSlaBreached = ev.slaBreached;
                    const isSelected = ev.id === effectiveSelectedId;

                    return (
                      <tr
                        key={ev.id}
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-accent-tint/60'
                            : isUnacknowledged
                            ? 'bg-negative-tint/40 hover:bg-negative-tint/60'
                            : 'hover:bg-surface-hover'
                        }`}
                      >
                        {/* Age & SLA countdown */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="tabular-nums text-text font-semibold">
                              {getAgeDisplay(ev.triggeredAt)}
                            </span>
                            {ev.status !== 'RESOLVED' && ev.status !== 'CANCELLED_BY_SENIOR' && (
                              <span
                                className={`text-xs tabular-nums mt-0.5 ${
                                  isSlaBreached ? 'text-negative font-semibold' : 'text-text-secondary'
                                }`}
                              >
                                {isSlaBreached ? 'SLA breached' : '< 2 min SLA'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Senior */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-text flex items-center gap-1.5 truncate">
                              {senior?.fullName || 'Senior'}
                              {ev.isDrill && (
                                <span className="px-1.5 py-0.2 text-xs bg-surface-subtle text-text-secondary rounded-chip font-semibold border border-border">
                                  Drill
                                </span>
                              )}
                            </span>
                            <span className="text-xs tabular-nums text-text-secondary">
                              {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Chapter */}
                        <td className="py-2.5 px-3 text-text">
                          <span className="px-2 py-0.5 bg-surface-subtle border border-border rounded-control text-xs">
                            {ev.chapterId}
                          </span>
                        </td>

                        {/* Network Status */}
                        <td className="py-2.5 px-3">
                          {ev.networkStatusAtTrigger === 'DISCONNECTED' ? (
                            <span className="inline-flex items-center gap-1 text-negative font-semibold text-xs">
                              <WifiOff className="w-3.5 h-3.5 stroke-[1.5]" />
                              <span>Dropped</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-positive font-semibold text-xs">
                              <Wifi className="w-3.5 h-3.5 stroke-[1.5]" />
                              <span>Online</span>
                            </span>
                          )}
                        </td>

                        {/* Status chip */}
                        <td className="py-2.5 px-3">
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

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {isUnacknowledged && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAcknowledge(ev)}
                                className="text-xs bg-negative hover:bg-negative/90 text-white font-semibold px-2 py-0.5 h-7"
                              >
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/sos/${ev.id}`)}
                              className="text-xs px-2 py-0.5 h-7 gap-1"
                            >
                              <Eye className="w-3 h-3 stroke-[1.5]" />
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

        {/* Right Column: AWS Cloudscape Split Panel (5 cols on lg) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-container p-5 space-y-5 sticky top-20">
          {selectedEvent ? (
            <>
              {/* Panel Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-border-subtle">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary tabular-nums font-semibold">
                      {selectedEvent.id}
                    </span>
                    <StatusChip
                      status={
                        selectedEvent.status === 'TRIGGERED'
                          ? 'danger'
                          : selectedEvent.status === 'ACKNOWLEDGED'
                          ? 'warning'
                          : selectedEvent.status === 'RESOLVED'
                          ? 'success'
                          : 'neutral'
                      }
                      label={selectedEvent.status}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-text mt-1">
                    {selectedSenior?.fullName || 'Senior incident inspection'}
                  </h3>
                  <div className="text-xs text-text-secondary mt-0.5 tabular-nums">
                    Triggered at: {new Date(selectedEvent.triggeredAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} ({getAgeDisplay(selectedEvent.triggeredAt)})
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/sos/${selectedEvent.id}`)}
                  className="gap-1 text-xs shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                  Full dossier
                </Button>
              </div>

              {/* Protocol Actions Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedEvent.status === 'TRIGGERED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcknowledge(selectedEvent)}
                    className="bg-negative hover:bg-negative/90 text-white font-semibold text-xs gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 stroke-[1.5]" />
                    Acknowledge alert
                  </Button>
                )}

                {(selectedEvent.status === 'TRIGGERED' || selectedEvent.status === 'ACKNOWLEDGED') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssignModalEvent(selectedEvent);
                      setSelectedResponderId(responders[0]?.id || '');
                    }}
                    className="text-xs gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                    Assign responder
                  </Button>
                )}

                {selectedEvent.status !== 'RESOLVED' && selectedEvent.status !== 'CANCELLED_BY_SENIOR' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResolveModalEvent(selectedEvent)}
                    className="text-xs gap-1.5 text-positive hover:bg-positive-tint"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    Resolve incident
                  </Button>
                )}
              </div>

              {/* Senior Citizen Profile & Contacts */}
              <div className="space-y-3 bg-surface-subtle p-3.5 rounded-control border border-border">
                <div className="text-xs font-semibold text-text flex items-center justify-between">
                  <span>Senior & contact details</span>
                  <span className="text-text-secondary tabular-nums">
                    {selectedSenior?.age ? `${selectedSenior.age}y` : ''} · {selectedSenior?.gender || ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-secondary block">Phone number</span>
                    <span className="font-semibold text-text tabular-nums">
                      {selectedSenior ? maskPhoneNumber(selectedSenior.phoneNumber) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Assigned chapter</span>
                    <span className="font-semibold text-text">
                      {selectedEvent.chapterId}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-secondary block">Home address</span>
                    <span className="text-text">
                      {selectedSenior?.address || 'Chapter residential sector'}
                    </span>
                  </div>
                </div>

                {/* Emergency NOK Contacts */}
                <div className="border-t border-border-subtle pt-2 space-y-1.5">
                  <span className="text-xs font-semibold text-text block">
                    Next-of-kin emergency contacts
                  </span>
                  {selectedContacts.length === 0 ? (
                    <p className="text-xs text-text-secondary">No next-of-kin contacts registered.</p>
                  ) : (
                    selectedContacts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-text font-normal">
                          {c.name || (c as any).fullName} ({c.relationship})
                        </span>
                        <span className="text-text-secondary tabular-nums">
                          {maskPhoneNumber(c.phoneNumber)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Fallback Cellular SMS Status */}
                <div className="border-t border-border-subtle pt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary flex items-center gap-1">
                      <Radio className="w-3 h-3 text-accent stroke-[1.5]" />
                      Cellular SMS fallback:
                    </span>
                    <span className="font-semibold text-text">
                      {selectedFallback
                        ? selectedFallback.status === 'DELIVERED'
                          ? 'Delivered to NOK'
                          : selectedFallback.status
                        : selectedEvent.cellularFallbackTriggered
                        ? 'Dispatched'
                        : 'Not triggered (Data online)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Notes & Ticker */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text block">
                  Incident notes & activity log
                </span>

                <div className="max-h-36 overflow-y-auto space-y-1.5 bg-page p-3 rounded-control border border-border text-xs text-text-secondary">
                  {selectedEvent.notes ? (
                    (Array.isArray(selectedEvent.notes) ? selectedEvent.notes.join('\n') : String(selectedEvent.notes)).split('\n').map((line: string, idx: number) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="italic">No dispatch notes recorded yet.</p>
                  )}
                </div>

                {/* Add Quick Note Form */}
                <form onSubmit={handleAddQuickNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational update note..."
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 rounded-control border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button type="submit" variant="outline" size="sm" className="text-xs">
                    Post
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-text-secondary space-y-2">
              <ShieldAlert className="w-8 h-8 text-text-secondary mx-auto opacity-50 stroke-[1.5]" />
              <p className="text-sm font-semibold text-text">No alert selected</p>
              <p className="text-xs">
                Select an incident from the triage queue to inspect details and initiate protocols.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-sm w-full p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent stroke-[1.5]" />
              Assign case responder
            </h3>
            <p className="text-xs text-text-secondary">
              Select an on-duty Care Team responder or Chapter Manager to attend this incident.
            </p>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Responder
              </label>
              <select
                value={selectedResponderId}
                onChange={(e) => setSelectedResponderId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {responders.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.role} - {r.chapterId || r.regionId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
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
                Confirm assignment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolveModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-md w-full p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5]" />
              Confirm incident resolution
            </h3>
            <p className="text-xs text-text-secondary">
              Document final safety status and confirmation details before closing incident {resolveModalEvent.id}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Resolution notes & safety confirmation
              </label>
              <textarea
                rows={3}
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="Senior verified safe by in-person responder or verified family contact..."
                className="w-full text-xs p-2.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResolveModalEvent(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleResolveConfirm}
                className="text-xs bg-positive hover:bg-positive/90 text-white font-semibold"
              >
                Close incident as resolved
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
