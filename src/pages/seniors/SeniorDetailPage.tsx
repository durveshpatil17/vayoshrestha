import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { RevealPhoneModal } from '@/components/ui/RevealPhoneModal';
import { maskPhoneNumber } from '@/domain/masking';
import { maskAbhaNumber, isValidAbhaNumber } from '@/domain/abha';
import {
  User,
  Phone,
  Shield,
  HeartPulse,
  History,
  MessageSquare,
  FileText,
  AlertTriangle,
  Edit,
  ExternalLink,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
} from 'lucide-react';
import { EmergencyContact } from '@/api/contracts';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

export const SeniorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const senior = data.seniorCitizens.find((s) => s.id === id);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'contacts' | 'consent' | 'abha' | 'sos' | 'health' | 'comms' | 'audit'
  >('overview');

  const [unmaskModalOpen, setUnmaskModalOpen] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);
  const [testSmsSent, setTestSmsSent] = useState<string | null>(null);

  if (!senior) {
    return (
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
        <h3 className="font-serif font-bold text-base text-text-primary">Senior Citizen Not Found</h3>
        <p className="text-xs text-text-muted mt-1">The requested profile ID does not exist in the active registry.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/seniors')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  // Related data
  const seniorSosEvents = data.sosEvents.filter((e) => e.seniorId === senior.id);
  const seniorVitals = data.vitalLogs.filter((v) => v.seniorId === senior.id);
  const seniorSchedules = data.medicationSchedules.filter((s) => s.seniorId === senior.id);
  const seniorAudits = data.auditEvents.filter((a) => a.entityId === senior.id);
  const seniorMessages = data.outboundMessages.filter((m) => m.recipientPhone === (senior.phoneNumber || senior.phone));

  const rawPhone = senior.phoneNumber || senior.phone || '';
  const isPhoneMasked = user?.role === 'VF' && !revealedPhone;
  const displayPhone = isPhoneMasked ? maskPhoneNumber(rawPhone) : (revealedPhone || rawPhone);

  const handleSendTestSms = (contactName: string, contactPhone: string) => {
    setTestSmsSent(`Simulated test SMS successfully dispatched to ${contactName} (${contactPhone}).`);
    setTimeout(() => setTestSmsSent(null), 4000);
  };

  // Prepare chart data for BP trends
  const bpChartData = seniorVitals
    .filter((v) => v.type === 'BloodPressure' && v.systolic && v.diastolic)
    .slice(-10)
    .map((v) => ({
      date: new Date(v.loggedAt || v.recordedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      systolic: v.systolic,
      diastolic: v.diastolic,
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={senior.fullName}
        description={`Membership ID: ${senior.membershipId} · Assigned to ${senior.chapterId}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Senior Citizens', to: '/seniors' },
          { label: senior.fullName },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/seniors/${senior.id}/edit`)}
            >
              Edit Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print Summary
            </Button>
          </div>
        }
      />

      {testSmsSent && (
        <div className="p-3 bg-success-bg border border-success/30 text-success rounded text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{testSmsSent}</span>
          </div>
          <button onClick={() => setTestSmsSent(null)} className="text-xs font-bold">&times;</button>
        </div>
      )}

      {/* Header Profile Identity Strip */}
      <div className="bg-white border border-border-hairline rounded p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-serif text-lg font-bold">
            {senior.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-bold text-text-primary">{senior.fullName}</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-subtle text-accent font-semibold border border-border-hairline">
                {senior.membershipId}
              </span>
            </div>
            <div className="text-xs text-text-muted flex gap-3 mt-1">
              <span>Age Band: <strong className="text-text-primary">{senior.ageBand}</strong></span>
              <span>Gender: <strong className="text-text-primary">{senior.gender}</strong></span>
              <span>Language: <strong className="text-text-primary">{senior.primaryLanguage}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {senior.consentRecorded || senior.consent?.generalCommunications ? (
            <span className="px-2.5 py-1 text-xs font-medium rounded bg-success-bg text-success border border-success/30">
              Active Consent
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-medium rounded bg-warning-bg text-warning border border-warning/30">
              Opted Out
            </span>
          )}
          {senior.abha.status === 'provided_unverified' && (
            <span className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-bg-subtle text-accent border border-border-hairline">
              ABHA: {maskAbhaNumber(senior.abha.number || '')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-border-hairline flex gap-2 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: '1. Overview' },
          { key: 'contacts', label: `2. Emergency Contacts (${(senior.emergencyContacts || []).length})` },
          { key: 'consent', label: '3. Consent & Privacy' },
          { key: 'abha', label: '4. ABHA (Phase 2)' },
          { key: 'sos', label: `5. SOS History (${seniorSosEvents.length})` },
          { key: 'health', label: `6. Health Logs (${seniorVitals.length})` },
          { key: 'comms', label: '7. Communications' },
          { key: 'audit', label: `8. Audit Trail (${seniorAudits.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'border-accent text-accent font-semibold bg-accent-tint/10'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-border-hairline rounded p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-text-primary border-b border-border-hairline pb-2">
              Personal & Demographics
            </h3>
            <div className="flex justify-between">
              <span className="text-text-muted">Full Name:</span>
              <span className="font-semibold text-text-primary">{senior.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Date of Birth:</span>
              <span className="font-mono text-text-primary">{senior.dateOfBirth} (Age band: {senior.ageBand})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Gender:</span>
              <span className="text-text-primary">{senior.gender}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Primary Phone:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-text-primary font-medium">{displayPhone}</span>
                {isPhoneMasked && (
                  <button
                    onClick={() => setUnmaskModalOpen(true)}
                    className="text-[10px] text-accent font-semibold underline"
                  >
                    Reveal (Logged)
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Preferred Language:</span>
              <span className="text-text-primary">{senior.primaryLanguage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Residential Address:</span>
              <span className="text-text-primary text-right max-w-xs">{senior.address}</span>
            </div>
          </div>

          <div className="bg-white border border-border-hairline rounded p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-text-primary border-b border-border-hairline pb-2">
              Registration & Safety Status
            </h3>
            <div className="flex justify-between">
              <span className="text-text-muted">Assigned Chapter:</span>
              <span className="text-text-primary font-medium">{senior.chapterId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Enrolled Date:</span>
              <span className="font-mono text-text-primary">
                {new Date(senior.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Assisted Registration:</span>
              <span className="text-text-primary">{senior.isAssistedRegistration ? 'Yes (Assisted by Field Volunteer)' : 'No (WhatsApp Self-Onboarded)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Active (14-day window):</span>
              <span className="text-success font-semibold">Active Responding Elder</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Daily Medication Reminders:</span>
              <span className="text-text-primary font-medium">{seniorSchedules.length > 0 ? 'Enabled (08:00 AM IST)' : 'None Configured'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-white border border-border-hairline rounded p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-sm text-text-primary">Pre-Registered Next-of-Kin Contacts</h3>
                <p className="text-xs text-text-muted">
                  Contacts prioritized for transactional SMS fallback if data connection drops during an emergency SOS.
                </p>
              </div>
            </div>

            {(senior.emergencyContacts || []).length === 0 ? (
              <div className="p-4 bg-danger-bg border border-danger/30 text-danger rounded text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Critical Safety Warning: No emergency contacts are registered for this senior citizen.</span>
              </div>
            ) : (
              <div className="divide-y divide-border-hairline border border-border-hairline rounded overflow-hidden">
                {(senior.emergencyContacts || []).map((c: EmergencyContact) => (
                  <div key={c.id} className="p-4 flex items-center justify-between text-xs hover:bg-bg-subtle/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-bg-subtle border border-border-hairline text-text-muted">
                          Priority {c.priorityOrder} ({c.relationship})
                        </span>
                        {c.isPrimary && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-accent text-white font-bold">
                            Primary Next-of-Kin
                          </span>
                        )}
                      </div>
                      <div className="text-text-muted font-mono mt-1">
                        Phone: {c.phone || '<Missing Number>'}
                      </div>
                      <div className="text-[11px] text-success mt-0.5">
                        ✓ Safety SMS Fallback Consent Recorded
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendTestSms(c.name, c.phoneNumber || c.phone || '')}
                      >
                        Send Test SMS
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Consent & Language */}
      {activeTab === 'consent' && (
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4 text-xs">
          <h3 className="font-semibold text-sm text-text-primary border-b border-border-hairline pb-2">
            Granular Consent Ledger & Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded bg-bg-subtle border border-border-hairline">
              <div>
                <span className="font-semibold text-text-primary block">WhatsApp General Communications</span>
                <span className="text-text-muted text-[11px]">Daily medication reminders, vitals log prompts, community wellness messages.</span>
              </div>
              <span className={`px-2 py-1 rounded font-semibold text-xs ${senior.consentRecorded || senior.consent?.generalCommunications ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                {senior.consentRecorded || senior.consent?.generalCommunications ? 'Consented' : 'Withdrawn'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-bg-subtle border border-border-hairline">
              <div>
                <span className="font-semibold text-text-primary block">Emergency SOS Fallback SMS to Next-of-Kin</span>
                <span className="text-text-muted text-[11px]">Mandatory safety consent permitting cellular SMS dispatch if data network drops.</span>
              </div>
              <span className="px-2 py-1 rounded font-semibold text-xs bg-success-bg text-success">
                Consented
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-bg-subtle border border-border-hairline">
              <div>
                <span className="font-semibold text-text-primary block">ABDM Health Account Linkage (Phase 2)</span>
                <span className="text-text-muted text-[11px]">Separate consent required for national health record federation under ABDM.</span>
              </div>
              <span className={`px-2 py-1 rounded font-semibold text-xs ${(senior.consent?.abdmRecordLinkage || senior.consent?.abdmLinkage) ? 'bg-accent-tint text-accent' : 'bg-bg-subtle text-text-muted border border-border-hairline'}`}>
                {(senior.consent?.abdmRecordLinkage || senior.consent?.abdmLinkage) ? 'Consented (Pending Phase 2)' : 'Not Consented'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ABHA (Phase 2 Ready) */}
      {activeTab === 'abha' && (
        <div className="bg-white border border-border-hairline rounded p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border-hairline pb-3">
            <div>
              <h3 className="font-semibold text-sm text-text-primary">Ayushman Bharat Health Account (ABHA)</h3>
              <p className="text-xs text-text-muted">Structured repository field for Phase 2 ABDM federation.</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded bg-bg-subtle text-text-muted border border-border-hairline">
              Phase 2 Preparation
            </span>
          </div>

          <div className="p-3 bg-bg-subtle border border-border-hairline rounded text-text-muted">
            <strong>Compliance Note (Hard Constraint 8):</strong> ABHA number is collected strictly as a format-validated structure. Federated linkage, verification, and longitudinal EHR sharing are scheduled for Phase 2 after project execution sign-off.
          </div>

          <div className="space-y-3 max-w-md">
            <div>
              <span className="text-text-muted block text-[11px]">14-Digit ABHA Number:</span>
              <span className="font-mono text-sm font-bold text-text-primary">
                {senior.abha.number ? maskAbhaNumber(senior.abha.number) : 'Not Provided'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Verification Status:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-warning-bg text-warning">
                {senior.abha.status === 'provided_unverified' ? 'Provided, Not Verified (Pilot Rule)' : 'Not Provided'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">ABHA Address / Virtual Handle:</span>
              <span className="font-mono text-text-primary">{senior.abha.address || 'None'}</span>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                title="ABDM integration will be activated in Phase 2"
              >
                Link ABHA Account (Phase 2)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SOS History */}
      {activeTab === 'sos' && (
        <div className="bg-white border border-border-hairline rounded p-5">
          <h3 className="font-semibold text-sm text-text-primary mb-3">Emergency SOS Dispatch History</h3>
          {seniorSosEvents.length === 0 ? (
            <p className="text-xs text-text-muted py-4 text-center">No emergency SOS triggers recorded for this senior citizen.</p>
          ) : (
            <div className="divide-y divide-border-hairline border border-border-hairline rounded">
              {seniorSosEvents.map((evt) => (
                <div key={evt.id} className="p-3 text-xs flex items-center justify-between hover:bg-bg-subtle">
                  <div>
                    <span className="font-mono font-semibold text-accent">{evt.id}</span>
                    <span className="text-text-muted ml-2">Triggered: {new Date(evt.triggeredAt).toLocaleString('en-IN')}</span>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      Network: {evt.networkStatus} · Fallback SMS: {evt.fallbackSmsStatus}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success-bg text-success">
                      {evt.status}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/sos/${evt.id}`)}>
                      View Incident Case
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Health Logs */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white border border-border-hairline rounded p-5">
            <h3 className="font-semibold text-sm text-text-primary mb-2">Blood Pressure Trend (Last 10 Readings)</h3>
            <p className="text-xs text-text-muted mb-4">Shaded reference area highlights High-Risk band (Systolic &gt;= 140 mmHg).</p>
            
            {bpChartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpChartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 200]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <ReferenceArea y1={140} y2={200} fill="#FEF3E2" fillOpacity={0.6} />
                    <Line type="monotone" dataKey="systolic" stroke="#1F5F4B" strokeWidth={2} name="Systolic (mmHg)" />
                    <Line type="monotone" dataKey="diastolic" stroke="#B7791F" strokeWidth={2} name="Diastolic (mmHg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-text-muted text-center py-8">No blood pressure logs submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Communication Log */}
      {activeTab === 'comms' && (
        <div className="bg-white border border-border-hairline rounded p-5">
          <h3 className="font-semibold text-sm text-text-primary mb-3">WhatsApp & SMS Message Log</h3>
          <p className="text-xs text-text-muted">Outbound template dispatches and incoming response receipts.</p>
          <div className="mt-3 p-3 bg-bg-subtle rounded text-xs text-text-muted border border-border-hairline">
            Daily morning 08:00 AM prescription reminders active. Last response logged: 27 Oct 2026, 8:14 AM IST (Taken).
          </div>
        </div>
      )}

      {/* Tab 8: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-border-hairline rounded p-5">
          <h3 className="font-semibold text-sm text-text-primary mb-3">Profile Field-Level Audit Ledger</h3>
          <div className="space-y-2 text-xs">
            {seniorAudits.length === 0 ? (
              <p className="text-text-muted">Genesis record created at onboarding.</p>
            ) : (
              seniorAudits.map((a) => (
                <div key={a.id} className="p-3 bg-bg-subtle rounded border border-border-hairline">
                  <div className="flex justify-between">
                    <span className="font-semibold text-text-primary">{a.action}: {a.details}</span>
                    <span className="text-text-muted font-mono text-[10px]">{a.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-1">
                    Actor: {a.actorName} ({a.actorRole}) · Hash: <span className="font-mono text-accent">{a.hash}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <RevealPhoneModal
        open={unmaskModalOpen}
        onOpenChange={setUnmaskModalOpen}
        memberId={senior.id}
        memberName={senior.fullName}
        unmaskedPhone={rawPhone}
        onRevealed={(unmasked) => setRevealedPhone(unmasked)}
      />
    </div>
  );
};
