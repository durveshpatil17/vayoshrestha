import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Clock,
  PhoneCall,
  Radio,
  ArrowLeft,
  WifiOff,
  Wifi,
  MapPin,
  FileText,
  User,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const SosCaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveOutcome, setResolveOutcome] = useState('ASSISTANCE_DISPATCHED');
  const [resolveNotes, setResolveNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const event = data.sosEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-container max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-critical mx-auto mb-3 stroke-[1.5]" />
        <h3 className="font-semibold text-base text-text">SOS case not found</h3>
        <p className="text-xs text-text-secondary mt-1">The requested SOS incident ID does not exist.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/sos')}>
          Return to SOS board
        </Button>
      </div>
    );
  }

  const senior = data.seniorCitizens.find((s) => s.id === event.seniorId);
  const contacts = data.emergencyContacts.filter((c) => c.seniorId === event.seniorId);
  const fallbackRecord = data.smsFallbackRecords.find((r) => r.sosEventId === event.id);

  const isOpenCase = event.status !== 'RESOLVED' && event.status !== 'CANCELLED_BY_SENIOR';

  const handleAcknowledge = () => {
    event.status = 'ACKNOWLEDGED';
    event.acknowledgedAt = new Date().toISOString();
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
    setActionFeedback('Case acknowledged successfully.');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const noteEntry = `[${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} - ${
      user?.name || user?.role
    }]: ${newNote.trim()}`;
    event.notes = event.notes ? `${event.notes}\n${noteEntry}` : noteEntry;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: event.chapterId,
      action: 'SOS_NOTE_ADDED',
      entityType: 'SOS',
      entityId: event.id,
      details: `Note added to case ${event.id}: "${newNote.trim().substring(0, 40)}..."`,
    });

    mockStore.persist();
    setNewNote('');
    setActionFeedback('Note appended to case audit record.');
  };

  const handleRetryFallbackSms = () => {
    if (!fallbackRecord) return;
    fallbackRecord.status = 'SENT';
    fallbackRecord.retryCount = (fallbackRecord.retryCount || 0) + 1;
    fallbackRecord.deliveredAt = new Date(Date.now() + 1500).toISOString();

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: event.chapterId,
      action: 'SMS_FALLBACK_RETRY',
      entityType: 'SOS',
      entityId: fallbackRecord.id,
      details: `Retried SMS fallback dispatch to ${fallbackRecord.recipientPhoneNumber} for SOS ${event.id}.`,
    });

    mockStore.persist();
    setActionFeedback('Cellular SMS re-sent to carrier gateway.');
  };

  const handleResolveCase = () => {
    event.status = 'RESOLVED';
    event.resolvedAt = new Date().toISOString();
    const resolutionNote = `[Resolved: ${resolveOutcome} by ${user?.name || user?.role}]: ${
      resolveNotes.trim() || 'Safe confirmation recorded.'
    }`;
    event.notes = event.notes ? `${event.notes}\n${resolutionNote}` : resolutionNote;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: event.chapterId,
      action: 'SOS_RESOLVE',
      entityType: 'SOS',
      entityId: event.id,
      details: `Case resolved with outcome "${resolveOutcome}".`,
    });

    mockStore.persist();
    setResolveModalOpen(false);
    setActionFeedback('Case marked as resolved and safely closed.');
  };

  const handleSimulatedCall = (calleeName: string, phoneNumber: string) => {
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CT',
      chapterId: event.chapterId,
      action: 'VOICE_CALL_INITIATED',
      entityType: 'SOS',
      entityId: event.id,
      details: `Simulated carrier phone call initiated to ${calleeName} (${phoneNumber}).`,
    });
    mockStore.persist();
    setActionFeedback(`Simulated call placed to ${calleeName} (${maskPhoneNumber(phoneNumber)}).`);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sos')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          Back to Live SOS board
        </Button>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded-control text-xs text-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
            <span>{actionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="font-semibold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Case Header */}
      <div className="bg-surface border border-border rounded-container p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary font-semibold tabular-nums">
              Case ID: {event.id}
            </span>
            <StatusChip
              status={
                event.status === 'TRIGGERED'
                  ? 'danger'
                  : event.status === 'ACKNOWLEDGED'
                  ? 'warning'
                  : event.status === 'RESOLVED'
                  ? 'success'
                  : 'neutral'
              }
              label={event.status}
            />
            {event.isDrill && (
              <span className="px-2 py-0.5 text-xs bg-surface-subtle text-text-secondary border border-border rounded-chip font-semibold">
                Simulated drill
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-text mt-1">
            Emergency SOS: {senior?.fullName || 'Senior member'}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5 tabular-nums">
            Triggered: {new Date(event.triggeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} · Chapter: {event.chapterId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {event.status === 'TRIGGERED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcknowledge}
              className="bg-negative hover:bg-negative/90 text-white font-semibold text-xs gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5 stroke-[1.5]" />
              Acknowledge alert
            </Button>
          )}
          {isOpenCase && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setResolveModalOpen(true)}
              className="text-xs bg-accent hover:bg-accent-hover font-semibold"
            >
              Resolve case
            </Button>
          )}
        </div>
      </div>

      {/* Latency & Cellular Fallback Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enqueue-to-Dashboard Latency */}
        <div className="bg-surface border border-border rounded-container p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary">
              Alert delivery latency
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl tabular-nums font-semibold text-accent">
                {event.latencyMs} ms
              </span>
              <span className="text-xs text-positive font-semibold">Sub-second target met</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Simulated enqueue-to-dashboard latency across in-browser BroadcastChannel.
            </p>
          </div>
          <Clock className="w-8 h-8 text-accent opacity-30 stroke-[1.5]" />
        </div>

        {/* Cellular Fallback Status */}
        <div className="bg-surface border border-border rounded-container p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-text-secondary">
              Cellular fallback trigger
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              {event.cellularFallbackTriggered ? (
                <span className="text-base font-semibold text-negative flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 stroke-[1.5]" /> Dispatched to NOK
                </span>
              ) : (
                <span className="text-base font-semibold text-positive flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 stroke-[1.5]" /> Data channel stable
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {event.cellularFallbackTriggered
                ? 'Mobile data dropped during SOS; automated transactional SMS pushed to next-of-kin.'
                : 'Webhook delivered over standard WhatsApp data network without cellular degradation.'}
            </p>
          </div>
          <Radio className="w-8 h-8 text-text-secondary opacity-30 stroke-[1.5]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline & Fallback Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Timeline */}
          <div className="bg-surface border border-border rounded-container p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent stroke-[1.5]" />
              Incident timeline
            </h3>

            <div className="space-y-4 border-l-2 border-border pl-4 ml-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-negative absolute -left-5 top-1" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text">
                    1. SOS triggered by senior
                  </span>
                  <span className="tabular-nums text-xs text-text-secondary">
                    {new Date(event.triggeredAt).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Tapped "Trigger Emergency SOS" quick reply in WhatsApp chat.
                </p>
              </div>

              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-accent absolute -left-5 top-1" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text">
                    2. Webhook ingested & dashboard alerted
                  </span>
                  <span className="tabular-nums text-xs text-text-secondary">
                    +{event.latencyMs} ms
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Payload verified and BroadcastChannel broadcast delivered to regional operators.
                </p>
              </div>

              {event.cellularFallbackTriggered && (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-critical absolute -left-5 top-1" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-critical">
                      3. Cellular fallback dispatched
                    </span>
                    <span className="tabular-nums text-xs text-text-secondary">
                      {event.cellularFallbackDelivered ? 'Delivered' : 'Pending carrier'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Data disconnection detected mid-transaction. Pushed transactional SMS to
                    registered next-of-kin.
                  </p>
                </div>
              )}

              {event.acknowledgedAt ? (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-positive absolute -left-5 top-1" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-text">
                      4. Alert acknowledged
                    </span>
                    <span className="tabular-nums text-xs text-text-secondary">
                      {new Date(event.acknowledgedAt).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Operator took ownership within acknowledgement SLA target.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-negative absolute -left-5 top-1" />
                  <span className="font-semibold text-xs text-negative">
                    Awaiting regional operator acknowledgment...
                  </span>
                </div>
              )}

              {event.resolvedAt && (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-positive absolute -left-5 top-1" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-positive">5. Case resolved</span>
                    <span className="tabular-nums text-xs text-text-secondary">
                      {new Date(event.resolvedAt).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Assistance confirmed with senior and next-of-kin.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cellular Fallback Detailed Panel */}
          {event.cellularFallbackTriggered && fallbackRecord && (
            <div className="bg-surface border border-border rounded-container p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text flex items-center gap-2">
                  <Radio className="w-4 h-4 text-accent stroke-[1.5]" />
                  Cellular SMS fallback record
                </h3>
                <StatusChip
                  status={fallbackRecord.status === 'DELIVERED' ? 'success' : 'warning'}
                  label={fallbackRecord.status}
                />
              </div>

              <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs space-y-1.5 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Recipient NOK:</span>
                  <span className="font-semibold text-text">
                    {fallbackRecord.recipientPhoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Trigger reason:</span>
                  <span className="text-text">{fallbackRecord.triggerReason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">DLT template ID:</span>
                  <span className="text-text">{fallbackRecord.dltTemplateId}</span>
                </div>
                <div className="pt-2 border-t border-border text-xs text-text">
                  <strong>SMS message text:</strong>
                  <div className="mt-1 p-2 bg-surface border border-border rounded-control italic">
                    "{fallbackRecord.messageText}"
                  </div>
                </div>
              </div>

              {fallbackRecord.status !== 'DELIVERED' && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryFallbackSms}
                    className="text-xs gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
                    Retry carrier dispatch
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Operator Notes & Action Log */}
          <div className="bg-surface border border-border rounded-container p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent stroke-[1.5]" />
              Operator notes & action log
            </h3>

            <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs tabular-nums whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {event.notes || 'No notes logged yet.'}
            </div>

            {isOpenCase && (
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter operational note (e.g. Called daughter; care volunteer dispatched)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button type="submit" variant="outline" size="sm" className="text-xs font-semibold">
                  Add note
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Senior Profile & Next-of-Kin Contacts */}
        <div className="space-y-6">
          {/* Senior Profile Summary */}
          <div className="bg-surface border border-border rounded-container p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-semibold text-sm text-text flex items-center gap-2">
                <User className="w-4 h-4 text-accent stroke-[1.5]" />
                Senior profile
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/seniors/${senior?.id}`)}
                className="text-xs h-7 px-2.5"
              >
                View full
              </Button>
            </div>

            {senior ? (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-text-secondary">Full legal name:</span>
                  <div className="font-semibold text-text text-sm">{senior.fullName}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Member ID:</span>
                  <div className="tabular-nums text-text font-semibold">{senior.memberId}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Direct mobile:</span>
                  <div className="tabular-nums text-text flex items-center justify-between">
                    <span>{senior.phoneNumber}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulatedCall(senior.fullName, senior.phoneNumber || '')}
                      className="text-xs h-7 px-2 gap-1 text-accent"
                    >
                      <PhoneCall className="w-3 h-3 stroke-[1.5]" />
                      Call
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Preferred language:</span>
                  <div className="text-text">{senior.preferredLanguage}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Primary address:</span>
                  <div className="text-text mt-0.5">
                    {senior.address || 'Address not recorded'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-secondary">Senior record unlinked.</p>
            )}

            {/* Permanent 112 Notice */}
            <div className="p-3 bg-negative-tint border border-negative/30 rounded-control text-xs text-text leading-relaxed">
              <strong className="text-negative font-semibold">Emergency notice:</strong> In a life-threatening or medical emergency,
              immediately dial <strong className="font-semibold">112</strong>.
            </div>
          </div>

          {/* Emergency Contacts with One-Click Call */}
          <div className="bg-surface border border-border rounded-container p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-accent stroke-[1.5]" />
              Emergency contacts (NOK)
            </h3>
            <p className="text-xs text-text-secondary">
              Pre-registered next-of-kin unmasked during active emergency investigation.
            </p>

            <div className="space-y-2.5">
              {contacts.length === 0 ? (
                <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs text-text-secondary">
                  No emergency contacts on file for this senior.
                </div>
              ) : (
                contacts.map((c, i) => (
                  <div
                    key={c.id || i}
                    className="p-3 bg-surface-subtle border border-border rounded-control space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text">
                        {c.fullName || c.name} ({c.relationship})
                      </span>
                      <span className="text-xs bg-surface px-1.5 py-0.5 rounded-control border border-border text-text-secondary">
                        Priority {c.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="tabular-nums text-text">{c.phoneNumber}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSimulatedCall(c.fullName || c.name, c.phoneNumber || '')}
                        className="text-xs h-7 px-2 gap-1 text-accent"
                      >
                        <PhoneCall className="w-3 h-3 stroke-[1.5]" />
                        Call NOK
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map-less Static Location Pin */}
          <div className="bg-surface border border-border rounded-container p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent stroke-[1.5]" />
              Last known hub location
            </h3>
            <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs space-y-1">
              <p className="font-semibold text-text">Ekta Hub: {event.chapterId}</p>
              <p className="text-text-secondary tabular-nums">
                Latitude: 12.9716° N · Longitude: 77.5946° E (Bengaluru Core)
              </p>
              <p className="text-xs text-text-secondary italic pt-1">
                Static hub baseline coordinates · Map integration scheduled for Phase 2.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Case Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-base text-text flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-positive stroke-[1.5]" />
              Resolve emergency case
            </h3>
            <p className="text-xs text-text-secondary">
              Record the verified outcome code and closing notes. The incident will be marked
              completed and archived to the historical registry.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Incident resolution outcome:
                </label>
                <select
                  value={resolveOutcome}
                  onChange={(e) => setResolveOutcome(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="ASSISTANCE_DISPATCHED">
                    Assistance dispatched (Care Team / Field Volunteer)
                  </option>
                  <option value="NOK_COORDINATED">
                    Resolved by next-of-kin (Daughter/Son on site)
                  </option>
                  <option value="MEDICAL_SUPPORT">
                    Medical support / 112 coordinated
                  </option>
                  <option value="FALSE_ALARM">False alarm / accidental button tap</option>
                  <option value="CANCELLED_CONFIRMED">Cancelled by senior (Confirmed safe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Closing notes:
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Summarize phone conversation with senior or NOK..."
                  className="w-full text-xs p-2.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResolveModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleResolveCase}
                className="text-xs bg-positive hover:bg-positive/90 text-white font-semibold"
              >
                Confirm resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
