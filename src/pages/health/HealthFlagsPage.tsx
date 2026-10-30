import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertCircle,
  PhoneCall,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
  User,
  HeartPulse,
  UserCheck,
  Stethoscope,
  XCircle,
  Send,
} from 'lucide-react';
import { HealthFlag } from '@/api/contracts';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const HealthFlagsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';

  if (isSA) {
    return (
      <Container className="max-w-md mx-auto my-12 text-center p-8">
        <ShieldAlert className="w-8 h-8 text-negative mx-auto mb-3" />
        <h3 className="font-semibold text-base text-text">
          Access Restricted: 403 Forbidden
        </h3>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          System Administrators cannot view health anomaly flags per Vayoh Vikas data governance.
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </Container>
    );
  }

  const flags = data.healthFlags.filter((f) => {
    if (user?.role === 'CM' && f.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === f.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

  const [selectedFlagId, setSelectedFlagId] = useState<string>(flags[0]?.id || '');
  const [activeCallFlag, setActiveCallFlag] = useState<HealthFlag | null>(null);
  const [dismissModalOpen, setDismissModalOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState('VERIFIED_FALSE_ALARM');
  const [dismissNotes, setDismissNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('REACHED_WELL');
  const [callNotes, setCallNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedFlag = flags.find((f) => f.id === selectedFlagId) || flags[0] || null;
  const selectedSenior = selectedFlag
    ? data.seniorCitizens.find((s) => s.id === selectedFlag.seniorId)
    : null;

  const handleOpenCallModal = (flag: HealthFlag) => {
    setActiveCallFlag(flag);
    setCallOutcome('REACHED_WELL');
    setCallNotes('');
  };

  const handleCompleteCall = () => {
    if (!activeCallFlag) return;

    activeCallFlag.status = 'CLOSED';
    activeCallFlag.callCompletedAt = new Date().toISOString();
    activeCallFlag.callOutcome = callOutcome;

    // Check if escalated to SOS
    if (callOutcome === 'ESCALATE_TO_SOS') {
      const senior = data.seniorCitizens.find((s) => s.id === activeCallFlag.seniorId);
      if (senior) {
        const newSos = {
          id: `SOS-ESC-${Date.now()}`,
          seniorId: senior.id,
          chapterId: senior?.chapterId || activeCallFlag.chapterId || 'HUB-BLR',
          triggeredAt: new Date().toISOString(),
          status: 'TRIGGERED' as const,
          isDrill: false,
          networkStatusAtTrigger: 'ONLINE' as const,
          cellularFallbackTriggered: false,
          cellularFallbackDelivered: false,
          latencyMs: 140,
          slaBreached: false,
          notes: `[Auto-Escalated from Health Anomaly Flag ${activeCallFlag.id}]: ${callNotes}`,
        };
        data.sosEvents.unshift(newSos);
      }
    }

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: activeCallFlag.chapterId,
      action: 'HEALTH_FLAG_CALL_COMPLETED',
      entityType: 'FLAG',
      entityId: activeCallFlag.id,
      details: `Wellness check-in call completed by ${user?.name || user?.role}. Outcome: ${callOutcome}`,
    });

    mockStore.persist();
    setActiveCallFlag(null);
    setFeedback(`Wellness call recorded. Anomaly flag ${activeCallFlag.id} closed.`);
  };

  const handleEscalateToSos = (flag: HealthFlag) => {
    const senior = data.seniorCitizens.find((s) => s.id === flag.seniorId);
    if (!senior) return;

    flag.status = 'CLOSED';
    flag.callOutcome = 'ESCALATE_TO_SOS';
    flag.callCompletedAt = new Date().toISOString();

    const newSos = {
      id: `SOS-ESC-${Date.now()}`,
      seniorId: senior.id,
      chapterId: senior?.chapterId || flag.chapterId || 'HUB-BLR',
      triggeredAt: new Date().toISOString(),
      status: 'TRIGGERED' as const,
      isDrill: false,
      networkStatusAtTrigger: 'ONLINE' as const,
      cellularFallbackTriggered: false,
      cellularFallbackDelivered: false,
      latencyMs: 140,
      slaBreached: false,
      notes: `[Direct Escalation from Health Flag ${flag.id}] Senior reported acute distress. Reading: ${flag.readingValue}`,
    };
    data.sosEvents.unshift(newSos);

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: flag.chapterId,
      action: 'HEALTH_FLAG_ESCALATE_SOS',
      entityType: 'SOS',
      entityId: newSos.id,
      details: `Health anomaly flag ${flag.id} for ${senior.fullName} escalated immediately to active SOS incident.`,
    });

    mockStore.persist();
    setFeedback(`Flag escalated immediately to active SOS incident ${newSos.id}.`);
  };

  const handleDismissFlag = () => {
    if (!selectedFlag) return;

    selectedFlag.status = 'DISMISSED';
    selectedFlag.callOutcome = `DISMISSED: ${dismissReason} - ${dismissNotes}`;

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: selectedFlag.chapterId,
      action: 'HEALTH_FLAG_DISMISSED',
      entityType: 'FLAG',
      entityId: selectedFlag.id,
      details: `Health anomaly flag ${selectedFlag.id} dismissed with justification: ${dismissReason}. Notes: ${dismissNotes}`,
    });

    mockStore.persist();
    setDismissModalOpen(false);
    setDismissNotes('');
    setFeedback(`Anomaly flag ${selectedFlag.id} dismissed with audited justification.`);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Prominent non-clinical notice banner */}
      <MessageStrip type="informative">
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Nav back & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health')}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text">Health Anomaly Flags & Wellness Routing</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Out-of-band vital readings flagged for human operational check-in calls. No medical diagnosis or clinical advice.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <MessageStrip type="positive" onClose={() => setFeedback(null)}>
          {feedback}
        </MessageStrip>
      )}

      {/* Cloudscape Split Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Flags Triage Queue Table (7 cols) */}
        <div className="lg:col-span-7">
          <Container
            header={
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-text">Anomaly Flags Queue</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {flags.length} readings requiring operator triage and check-in routing.
                  </p>
                </div>
                <span className="text-xs font-semibold text-critical bg-critical-tint px-2.5 py-1 rounded-control">
                  {flags.filter((f) => f.status === 'NEW').length} New
                </span>
              </div>
            }
          >
            <div className="overflow-x-auto locked-list-scroll">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-page text-text-secondary font-semibold">
                    <th className="py-2.5 px-3">Senior Name</th>
                    <th className="py-2.5 px-3">Biomarker</th>
                    <th className="py-2.5 px-3">Reading Value</th>
                    <th className="py-2.5 px-3">Threshold Exceeded</th>
                    <th className="py-2.5 px-3">Triggered At</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flags.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-text-secondary">
                        No active anomaly flags in your chapter scope.
                      </td>
                    </tr>
                  ) : (
                    flags.map((flag) => {
                      const senior = data.seniorCitizens.find((s) => s.id === flag.seniorId);
                      const isSelected = flag.id === selectedFlag?.id;
                      const isCritical = flag.bandCrossed === 'CRITICAL';

                      return (
                        <tr
                          key={flag.id}
                          onClick={() => setSelectedFlagId(flag.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-informative-tint/50 border-l-4 border-accent'
                              : 'hover:bg-page'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-text block">
                              {senior?.fullName || 'Senior Citizen'}
                            </span>
                            <span className="text-xs text-text-secondary tabular-nums">
                              {senior ? maskPhoneNumber(senior.phoneNumber) : flag.seniorId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-text font-normal">
                            {flag.readingValue?.includes('/') ? 'Blood Pressure' : 'Blood Glucose'}
                          </td>
                          <td className="py-2.5 px-3 tabular-nums font-semibold text-critical">
                            {flag.readingValue}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-control text-xs font-semibold ${
                                isCritical
                                  ? 'bg-critical-tint text-critical'
                                  : 'bg-informative-tint text-accent'
                              }`}
                            >
                              {flag.bandCrossed || 'HIGH_RISK'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 tabular-nums text-text-secondary">
                            {new Date(flag.flaggedAt || Date.now()).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFlagId(flag.id);
                              }}
                              className={`px-2.5 py-1 text-xs rounded-control font-semibold ${
                                isSelected
                                  ? 'bg-accent text-white'
                                  : 'bg-surface border border-border text-text hover:bg-page'
                              }`}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Container>
        </div>

        {/* Right Panel: Detail Inspection Panel for Selected Flag (5 cols) */}
        <div className="lg:col-span-5 locked-detail-sticky space-y-4">
          {selectedFlag ? (
            <Container
              header={
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-secondary tabular-nums block">
                      Incident Flag: {selectedFlag.id}
                    </span>
                    <h2 className="text-base font-semibold text-text">
                      {selectedSenior?.fullName || 'Senior Details'}
                    </h2>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-control text-xs font-semibold ${
                      selectedFlag.status === 'NEW'
                        ? 'bg-critical-tint text-critical'
                        : selectedFlag.status === 'CLOSED'
                        ? 'bg-positive-tint text-positive'
                        : 'bg-informative-tint text-accent'
                    }`}
                  >
                    {selectedFlag.status}
                  </span>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                {/* Triggered Reading Summary */}
                <div className="p-3 bg-page border border-border rounded-control space-y-1">
                  <div className="text-xs text-text-secondary">Biomarker Anomaly Reading:</div>
                  <div className="text-xl font-semibold tabular-nums text-critical">
                    {selectedFlag.readingValue}
                  </div>
                  <div className="text-xs text-text-secondary flex items-center justify-between">
                    <span>Threshold: {selectedFlag.bandCrossed}</span>
                    <span className="tabular-nums">Rule: {selectedFlag.ruleVersion}</span>
                  </div>
                </div>

                {/* Senior Contact Info */}
                <div className="p-3 bg-surface border border-border rounded-control space-y-2">
                  <div className="font-semibold text-text flex items-center gap-1.5">
                    <User className="w-4 h-4 text-accent" />
                    Senior Contact Information
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-text">
                    <div>
                      <span className="text-text-secondary block">Direct Phone</span>
                      <span className="font-semibold tabular-nums">
                        {selectedSenior?.phoneNumber || '9876543210'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Language</span>
                      <span className="font-semibold">
                        {selectedSenior?.preferredLanguage || 'Kannada / English'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Member ID</span>
                      <span className="font-semibold tabular-nums">
                        {selectedSenior?.memberId || selectedSenior?.membershipId || 'VV-1001'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Chapter Hub</span>
                      <span className="font-semibold">{selectedFlag.chapterId || 'HUB-BLR'}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Physician Contact */}
                <div className="p-3 bg-surface border border-border rounded-control space-y-2">
                  <div className="font-semibold text-text flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-accent" />
                    Primary Physician Contact
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-text">
                    <div>
                      <span className="text-text-secondary block">Physician</span>
                      <span className="font-semibold">Dr. S. K. Narayan, MD</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Clinic Contact</span>
                      <span className="font-semibold tabular-nums">+91 80 2345 6789</span>
                    </div>
                  </div>
                </div>

                {/* Conversational Script Helper */}
                <div className="p-3 bg-informative-tint border border-accent/20 rounded-control space-y-1">
                  <span className="font-semibold text-accent block">Conversational Check-in Script:</span>
                  <p className="italic text-text leading-relaxed">
                    "Hello, I am calling from Vayoh Vikas chapter hub. We noticed you logged a reading earlier today. We wanted to check how you are feeling right now, whether you have had water, and if someone is with you at home?"
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleOpenCallModal(selectedFlag)}
                    className="w-full py-2 px-3 bg-accent text-white rounded-control font-semibold text-xs flex items-center justify-center gap-2 hover:bg-accent/90"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Senior Now (Log Call)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEscalateToSos(selectedFlag)}
                    className="w-full py-2 px-3 bg-negative text-white rounded-control font-semibold text-xs flex items-center justify-center gap-2 hover:bg-negative/90"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate to SOS Incident
                  </button>

                  <button
                    type="button"
                    onClick={() => setDismissModalOpen(true)}
                    className="w-full py-2 px-3 bg-surface border border-border text-text-secondary hover:text-text rounded-control font-semibold text-xs flex items-center justify-center gap-2 hover:bg-page"
                  >
                    <XCircle className="w-4 h-4" />
                    Dismiss (Audited Reason Required)
                  </button>
                </div>
              </div>
            </Container>
          ) : (
            <Container className="p-6 text-center text-text-secondary">
              Select an anomaly flag from the queue to view triage details and response actions.
            </Container>
          )}
        </div>
      </div>

      {/* Wellness Call Modal */}
      {activeCallFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-base text-text">
                Wellness Check-in Call Script & Outcome
              </h3>
            </div>

            <div className="p-3 bg-page border border-border rounded-control text-xs space-y-1">
              <div className="font-semibold text-text">
                Senior: {selectedSenior?.fullName} ({selectedSenior?.memberId})
              </div>
              <div className="text-text-secondary">
                Direct Phone: <strong className="text-text">{selectedSenior?.phoneNumber}</strong> · Language: {selectedSenior?.preferredLanguage}
              </div>
              <div className="text-critical font-semibold">
                Triggered Reading: {activeCallFlag.readingValue} ({activeCallFlag.bandCrossed})
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Call Outcome:</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
                >
                  <option value="REACHED_WELL">Reached senior — feeling fine, resting</option>
                  <option value="REACHED_REFERRED">Reached senior — advised consulting their family doctor</option>
                  <option value="NOK_COORDINATED">Reached Next-of-Kin — family informed and checking in</option>
                  <option value="NO_ANSWER">No answer after 3 attempts</option>
                  <option value="ESCALATE_TO_SOS">Senior in distress — ESCALATE TO EMERGENCY SOS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Operator Call Notes:</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Summarize conversation with senior..."
                  className="w-full p-3 border border-border rounded-control text-xs bg-surface text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCallFlag(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompleteCall}
                className="bg-accent"
              >
                Save & Close Flag
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dismiss Flag Modal */}
      {dismissModalOpen && selectedFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-negative" />
              <h3 className="font-semibold text-base text-text">
                Dismiss Anomaly Flag (Audited)
              </h3>
            </div>

            <p className="text-xs text-text-secondary">
              Dismissing a flagged reading bypasses standard wellness check-in protocol. An immutable audit record will be logged with your reasoning.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Audited Justification Reason:</label>
                <select
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-control bg-surface text-text text-xs"
                >
                  <option value="VERIFIED_FALSE_ALARM">Verified false alarm (device typo by senior)</option>
                  <option value="VERIFIED_WITH_FAMILY">Family / caregiver confirmed senior is stable and under care</option>
                  <option value="DUPLICATE_ENTRY">Duplicate submission within 15 minutes</option>
                  <option value="CLINICAL_TOLERANCE">Senior has documented physician exemption for elevated baseline</option>
                  <option value="TEST_DATA">Field training / drill simulation entry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Audited Justification Notes:</label>
                <textarea
                  rows={3}
                  value={dismissNotes}
                  onChange={(e) => setDismissNotes(e.target.value)}
                  placeholder="Mandatory rationale for closing flag without check-in call..."
                  className="w-full p-3 border border-border rounded-control text-xs bg-surface text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDismissModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDismissFlag}
                className="bg-negative"
              >
                Confirm Audited Dismissal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
