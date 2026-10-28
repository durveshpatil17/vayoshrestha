import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
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
} from 'lucide-react';
import { HealthFlag } from '@/api/contracts';

export const HealthFlagsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';

  if (isSA) {
    return (
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <ShieldAlert className="w-8 h-8 text-danger mx-auto mb-3" />
        <h3 className="font-semibold text-base text-text-primary">
          Access Restricted: 403 Forbidden
        </h3>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          System Administrators cannot view health anomaly flags per Vayoh Vikas data governance.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const [activeCallFlag, setActiveCallFlag] = useState<HealthFlag | null>(null);
  const [callOutcome, setCallOutcome] = useState('REACHED_WELL');
  const [callNotes, setCallNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const flags = data.healthFlags.filter((f) => {
    if (user?.role === 'CM' && f.chapterId !== user.chapterId) return false;
    if (user?.role === 'RA') {
      const ch = data.chapters.find((c) => c.id === f.chapterId);
      if (ch && ch.regionId !== user.regionId) return false;
    }
    return true;
  });

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

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Health Overview
        </Button>
      </div>

      <PageHeader
        title="Health Anomaly Flags & Wellness Routing"
        description="Out-of-band vital readings flagged for human operational check-in calls. No medical diagnosis or clinical advice."
      />

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-semibold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Non-Medical Notice Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
        <strong>Non-Clinical Protocol:</strong> High readings flag a compassionate welfare check-in
        call by chapter volunteers or staff. Staff must never prescribe, diagnose, or advise change
        in medication. If a senior reports severe pain or breathlessness, coordinate medical help or
        escalate to SOS.
      </div>

      {/* Flags Table */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Flagged At (IST)</th>
                <th className="py-2.5 px-4">Senior Citizen</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Reading Value</th>
                <th className="py-2.5 px-4">Threshold Band</th>
                <th className="py-2.5 px-4">Rule Version</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {flags.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    No active anomaly flags in your chapter scope.
                  </td>
                </tr>
              ) : (
                flags.map((flag) => {
                  const senior = data.seniorCitizens.find((s) => s.id === flag.seniorId);

                  return (
                    <tr
                      key={flag.id}
                      className={`hover:bg-surface-subtle ${
                        flag.status === 'NEW' ? 'bg-danger-surface/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 tabular-nums text-text-muted">
                        {new Date(flag.flaggedAt || Date.now()).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-text-primary block">
                          {senior?.fullName || 'Senior'}
                        </span>
                        <span className="text-[11px] tabular-nums text-text-muted">
                          {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-text-primary">{flag.chapterId}</td>
                      <td className="py-2.5 px-4 tabular-nums font-semibold text-danger">
                        {flag.readingValue}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusChip
                          status={flag.bandCrossed === 'CRITICAL' ? 'danger' : 'warning'}
                          label={flag.bandCrossed || 'FLAG'}
                        />
                      </td>
                      <td className="py-2.5 px-4 tabular-nums text-[11px] text-text-muted">
                        {flag.ruleVersion}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusChip
                          status={
                            flag.status === 'NEW'
                              ? 'danger'
                              : flag.status === 'CLOSED'
                              ? 'success'
                              : 'warning'
                          }
                          label={flag.status}
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {flag.status !== 'CLOSED' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenCallModal(flag)}
                            className="text-xs px-2.5 py-1 h-7 gap-1 bg-accent"
                          >
                            <PhoneCall className="w-3 h-3" />
                            Work Call
                          </Button>
                        ) : (
                          <span className="text-[11px] text-text-muted">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wellness Call Modal */}
      {activeCallFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-base text-text-primary">
                Wellness Check-in Call Script & Outcome
              </h3>
            </div>

            {/* Senior summary */}
            {(() => {
              const senior = data.seniorCitizens.find((s) => s.id === activeCallFlag.seniorId);
              return (
                <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs space-y-1">
                  <div className="font-semibold text-text-primary">
                    Senior: {senior?.fullName} ({senior?.memberId})
                  </div>
                  <div className="text-text-muted">
                    Direct Phone: <strong>{senior?.phoneNumber}</strong> · Language:{' '}
                    {senior?.preferredLanguage}
                  </div>
                  <div className="text-danger font-medium">
                    Triggered Reading: {activeCallFlag.readingValue} ({activeCallFlag.bandCrossed})
                  </div>
                </div>
              );
            })()}

            {/* Non-clinical script */}
            <div className="p-3 bg-accent-tint/40 border border-accent/20 rounded text-xs space-y-1">
              <span className="font-semibold text-accent block">Suggested Conversational Script:</span>
              <p className="italic text-text-primary leading-relaxed">
                "Hello, I am calling from Vayoh Vikas hub. We noticed you logged a reading earlier today.
                We just wanted to check how you are feeling right now, whether you had water and your
                morning meal, and if anyone is home with you today?"
              </p>
            </div>

            {/* Call Outcome form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-text-primary mb-1">Call Outcome:</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full px-3 py-2 border border-border-hairline rounded bg-white text-xs"
                >
                  <option value="REACHED_WELL">Reached senior — feeling fine, resting</option>
                  <option value="REACHED_REFERRED">
                    Reached senior — advised consulting their family doctor
                  </option>
                  <option value="NOK_COORDINATED">
                    Reached Next-of-Kin — family informed and checking in
                  </option>
                  <option value="NO_ANSWER">No answer after 3 attempts</option>
                  <option value="ESCALATE_TO_SOS">
                    🚨 Senior in distress — ESCALATE TO EMERGENCY SOS
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Operator Call Notes:
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Summarize conversation with senior..."
                  className="w-full px-3 py-2 border border-border-hairline rounded text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCallFlag(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompleteCall}
                className="text-xs bg-accent"
              >
                Save & Close Flag
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
