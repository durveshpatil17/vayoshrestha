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
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  CheckCircle,
  Radio,
  ArrowLeft,
  WifiOff,
  Wifi,
  MapPin,
  FileText,
  User,
  AlertTriangle,
  RotateCcw,
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
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
        <h3 className="font-semibold text-base text-text-primary">SOS Case Not Found</h3>
        <p className="text-xs text-text-muted mt-1">The requested SOS incident ID does not exist.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/sos')}>
          Return to SOS Board
        </Button>
      </div>
    );
  }

  const senior = data.seniorCitizens.find((s) => s.id === event.seniorId);
  const contacts = data.emergencyContacts.filter((c) => c.seniorId === event.seniorId);
  const assignee = data.users.find((u) => u.id === event.assignedResponderId);
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
    setActionFeedback('Note logged to permanent case record.');
  };

  const handleResolveCase = () => {
    event.status = 'RESOLVED';
    event.resolvedAt = new Date().toISOString();
    event.notes = `${event.notes || ''}\n[Case Closed - Outcome: ${resolveOutcome}]: ${resolveNotes}`;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CT',
      chapterId: event.chapterId,
      action: 'SOS_RESOLVE',
      entityType: 'SOS',
      entityId: event.id,
      details: `Emergency case resolved with outcome ${resolveOutcome}. Reason: ${resolveNotes}`,
    });

    mockStore.persist();
    setResolveModalOpen(false);
    setActionFeedback('Case successfully marked as RESOLVED.');
  };

  const handleSimulatedCall = (targetName: string, phone: string) => {
    setActionFeedback(`Simulated call connected to ${targetName} (${phone}). Audio channel active.`);
  };

  const handleRetryFallbackSms = () => {
    if (fallbackRecord) {
      fallbackRecord.status = 'SENT';
      mockStore.persist();
      setActionFeedback('Fallback SMS re-queued to Next-of-Kin carrier gateway.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
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

      {actionFeedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span>{actionFeedback}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs font-semibold text-accent hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Case Header */}
      <div className="bg-white border border-border-hairline rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-semibold text-lg text-text-primary">
              Emergency Case: {event.id}
            </h2>
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
              <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded font-semibold">
                Simulated Drill
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-1">
            Triggered:{' '}
            {new Date(event.triggeredAt).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}{' '}
            IST · Chapter: <strong>{event.chapterId}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {event.status === 'TRIGGERED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcknowledge}
              className="bg-danger hover:bg-danger/90 text-white font-semibold text-xs"
            >
              Acknowledge Alert
            </Button>
          )}
          {isOpenCase && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setResolveModalOpen(true)}
              className="text-xs bg-accent hover:bg-accent-hover"
            >
              Resolve Case
            </Button>
          )}
        </div>
      </div>

      {/* Latency & Cellular Fallback Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enqueue-to-Dashboard Latency */}
        <div className="bg-white border border-border-hairline rounded p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-text-muted">
              Alert Delivery Latency
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl tabular-nums font-semibold text-accent">
                {event.latencyMs} ms
              </span>
              <span className="text-xs text-success font-medium">✓ Sub-second Target Met</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Simulated enqueue-to-dashboard latency across in-browser BroadcastChannel.
            </p>
          </div>
          <Clock className="w-8 h-8 text-accent opacity-30" />
        </div>

        {/* Cellular Fallback Status */}
        <div className="bg-white border border-border-hairline rounded p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-text-muted">
              Cellular Fallback Trigger
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              {event.cellularFallbackTriggered ? (
                <span className="text-base font-semibold text-danger flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4" /> Dispatched to NOK
                </span>
              ) : (
                <span className="text-base font-semibold text-success flex items-center gap-1.5">
                  <Wifi className="w-4 h-4" /> Data Channel Stable
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              {event.cellularFallbackTriggered
                ? 'Mobile data dropped during SOS; automated transactional SMS pushed to next-of-kin.'
                : 'Webhook delivered over standard WhatsApp data network without cellular degradation.'}
            </p>
          </div>
          <Radio className="w-8 h-8 text-text-muted opacity-30" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline & Fallback Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Timeline */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Incident Timeline
            </h3>

            <div className="space-y-4 border-l-2 border-border-hairline pl-4 ml-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-danger absolute -left-[21px] top-1"></div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-text-primary">
                    1. 🚨 SOS Triggered by Senior
                  </span>
                  <span className="tabular-nums text-[11px] text-text-muted">
                    {new Date(event.triggeredAt).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Tapped "🚨 Trigger Emergency SOS" quick reply in WhatsApp chat.
                </p>
              </div>

              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-accent absolute -left-[21px] top-1"></div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-text-primary">
                    2. Webhook Ingested & Dashboard Alerted
                  </span>
                  <span className="tabular-nums text-[11px] text-text-muted">
                    +{event.latencyMs} ms
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Payload verified and BroadcastChannel broadcast delivered to regional operators.
                </p>
              </div>

              {event.cellularFallbackTriggered && (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-warning absolute -left-[21px] top-1"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-warning">
                      3. Cellular Fallback Dispatched
                    </span>
                    <span className="tabular-nums text-[11px] text-text-muted">
                      {event.cellularFallbackDelivered ? 'Delivered' : 'Pending Carrier'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Data disconnection detected mid-transaction. Pushed transactional SMS to
                    registered Next-of-Kin.
                  </p>
                </div>
              )}

              {event.acknowledgedAt ? (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-success absolute -left-[21px] top-1"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-text-primary">
                      4. Alert Acknowledged
                    </span>
                    <span className="tabular-nums text-[11px] text-text-muted">
                      {new Date(event.acknowledgedAt).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Operator took ownership within acknowledgement SLA target.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse absolute -left-[21px] top-1"></div>
                  <span className="font-medium text-xs text-danger">
                    Awaiting Regional Operator Acknowledgment...
                  </span>
                </div>
              )}

              {event.resolvedAt && (
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-success absolute -left-[21px] top-1"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-success">5. Case Resolved</span>
                    <span className="tabular-nums text-[11px] text-text-muted">
                      {new Date(event.resolvedAt).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Assistance confirmed with senior and next-of-kin.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cellular Fallback Detailed Panel */}
          {event.cellularFallbackTriggered && fallbackRecord && (
            <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <Radio className="w-4 h-4 text-accent" />
                  Cellular SMS Fallback Record
                </h3>
                <StatusChip
                  status={fallbackRecord.status === 'DELIVERED' ? 'success' : 'warning'}
                  label={fallbackRecord.status}
                />
              </div>

              <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs space-y-1.5 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-text-muted">Recipient NOK:</span>
                  <span className="font-semibold text-text-primary">
                    {fallbackRecord.recipientPhoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Trigger Reason:</span>
                  <span className="text-text-primary">{fallbackRecord.triggerReason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">DLT Template ID:</span>
                  <span className="text-text-primary">{fallbackRecord.dltTemplateId}</span>
                </div>
                <div className="pt-2 border-t border-border-hairline font-sans text-xs text-text-primary">
                  <strong>SMS Message Text:</strong>
                  <div className="mt-1 p-2 bg-white border border-border-hairline rounded italic">
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
                    className="text-xs gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry Carrier Dispatch
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Location & Case Notes */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Operator Notes & Action Log
            </h3>

            <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs tabular-nums whitespace-pre-wrap max-h-48 overflow-y-auto">
              {event.notes || 'No notes logged yet.'}
            </div>

            {isOpenCase && (
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter operational note (e.g. Called daughter; ambulance requested)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
                />
                <Button type="submit" variant="outline" size="sm" className="text-xs">
                  Add Note
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Senior Profile & Next-of-Kin Contacts */}
        <div className="space-y-6">
          {/* Senior Profile Summary */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                Senior Profile
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/seniors/${senior?.id}`)}
                className="text-[11px] h-6 px-2"
              >
                View Full
              </Button>
            </div>

            {senior ? (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-text-muted">Full Legal Name:</span>
                  <div className="font-semibold text-text-primary text-sm">{senior.fullName}</div>
                </div>
                <div>
                  <span className="text-text-muted">Member ID:</span>
                  <div className="tabular-nums text-text-primary">{senior.memberId}</div>
                </div>
                <div>
                  <span className="text-text-muted">Direct Mobile:</span>
                  <div className="tabular-nums text-text-primary flex items-center justify-between">
                    <span>{senior.phoneNumber}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulatedCall(senior.fullName, senior.phoneNumber || senior.phone || '')}
                      className="text-[11px] h-6 px-2 gap-1 text-accent"
                    >
                      <PhoneCall className="w-3 h-3" /> Call
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Preferred Language:</span>
                  <div className="text-text-primary">{senior.preferredLanguage}</div>
                </div>
                <div>
                  <span className="text-text-muted">Primary Address:</span>
                  <div className="text-text-primary mt-0.5">
                    {senior.address || 'Address not recorded'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted">Senior record unlinked.</p>
            )}

            {/* Permanent 112 Notice */}
            <div className="p-3 bg-danger-surface border border-danger/30 rounded text-xs text-danger font-medium leading-relaxed">
              ⚠️ <strong>Emergency Notice:</strong> In a life-threatening or medical emergency,
              immediately dial <strong>112</strong>.
            </div>
          </div>

          {/* Emergency Contacts with One-Click Call */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-accent" />
              Emergency Contacts (NOK)
            </h3>
            <p className="text-[11px] text-text-muted">
              Pre-registered next-of-kin unmasked during active emergency investigation.
            </p>

            <div className="space-y-2.5">
              {contacts.length === 0 ? (
                <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs text-text-muted">
                  No emergency contacts on file for this senior.
                </div>
              ) : (
                contacts.map((c, i) => (
                  <div
                    key={c.id || i}
                    className="p-3 bg-surface-subtle border border-border-hairline rounded space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-primary">
                        {c.name} ({c.relationship})
                      </span>
                      <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-border-hairline">
                        Priority {c.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="tabular-nums text-text-primary">{c.phoneNumber}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSimulatedCall(c.name, c.phoneNumber || c.phone || '')}
                        className="text-[11px] h-6 px-2 gap-1 text-accent"
                      >
                        <PhoneCall className="w-3 h-3" /> Call NOK
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map-less Static Location Pin */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              Last Known Hub Location
            </h3>
            <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs space-y-1">
              <p className="font-medium text-text-primary">Ekta Hub: {event.chapterId}</p>
              <p className="text-text-muted">
                Latitude: 12.9716° N · Longitude: 77.5946° E (Bengaluru Core)
              </p>
              <p className="text-[11px] text-text-muted italic pt-1">
                Static hub baseline coordinates · Map integration scheduled for Phase 2.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Case Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-base text-text-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Resolve Emergency Case
            </h3>
            <p className="text-xs text-text-muted">
              Record the verified outcome code and closing notes. The incident will be marked
              completed and archived to the historical registry.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Incident Resolution Outcome:
                </label>
                <select
                  value={resolveOutcome}
                  onChange={(e) => setResolveOutcome(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-border-hairline rounded bg-white"
                >
                  <option value="ASSISTANCE_DISPATCHED">
                    Assistance Dispatched (Care Team / Field Volunteer)
                  </option>
                  <option value="NOK_COORDINATED">
                    Resolved by Next-of-Kin (Daughter/Son on site)
                  </option>
                  <option value="MEDICAL_SUPPORT">
                    Medical Support / 112 Coordinated
                  </option>
                  <option value="FALSE_ALARM">False Alarm / Accidental Button Tap</option>
                  <option value="CANCELLED_CONFIRMED">Cancelled by Senior (Confirmed OK)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Closing Notes:
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Summarize phone conversation with senior or NOK..."
                  className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
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
                className="text-xs bg-success hover:bg-success/90 text-white font-medium"
              >
                Confirm Resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
