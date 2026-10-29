import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { RevealPhoneModal } from '@/components/ui/RevealPhoneModal';
import { maskPhoneNumber } from '@/domain/masking';
import { maskAbhaNumber } from '@/domain/abha';
import {
  AlertTriangle,
  Edit,
  Printer,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  User,
  HeartPulse,
  Shield,
  MessageSquare,
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
      <div className="p-8 text-center bg-surface border border-border rounded-container max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-critical mx-auto mb-3 stroke-[1.5]" />
        <h3 className="font-semibold text-base text-text">Senior citizen not found</h3>
        <p className="text-xs text-text-secondary mt-1">The requested profile ID does not exist in the active registry.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/seniors')}>
          Return to directory
        </Button>
      </div>
    );
  }

  // Related data
  const seniorSosEvents = data.sosEvents.filter((e) => e.seniorId === senior.id);
  const seniorVitals = data.vitalLogs.filter((v) => v.seniorId === senior.id);
  const seniorSchedules = data.medicationSchedules.filter((s) => s.seniorId === senior.id);
  const seniorAudits = data.auditEvents.filter((a) => a.entityId === senior.id);

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
    <div className="space-y-6 pb-16">
      <PageHeader
        title={senior.fullName}
        description={`Membership ID: ${senior.membershipId} · Assigned to ${senior.chapterId}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Senior citizens', to: '/seniors' },
          { label: senior.fullName },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit className="w-3.5 h-3.5 stroke-[1.5]" />}
              onClick={() => navigate(`/seniors/${senior.id}/edit`)}
            >
              Edit profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Printer className="w-3.5 h-3.5 stroke-[1.5]" />}
              onClick={() => window.print()}
            >
              Print summary
            </Button>
          </div>
        }
      />

      {testSmsSent && (
        <div className="p-3 bg-positive-tint border border-positive/30 text-positive rounded-control text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
            <span>{testSmsSent}</span>
          </div>
          <button
            type="button"
            onClick={() => setTestSmsSent(null)}
            className="text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Profile Identity Strip (Fiori Object Page Header) */}
      <div className="bg-surface border border-border rounded-container p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center text-xl font-semibold select-none">
            {senior.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-text">{senior.fullName}</h2>
              <span className="tabular-nums text-xs px-2 py-0.5 rounded-chip bg-surface-subtle text-accent font-semibold border border-border">
                {senior.membershipId}
              </span>
            </div>
            <div className="text-xs text-text-secondary flex flex-wrap gap-4 mt-1.5">
              <span>Age band: <strong className="text-text font-semibold">{senior.ageBand || 'Senior'}</strong></span>
              <span>Gender: <strong className="text-text font-semibold">{senior.gender}</strong></span>
              <span>Language: <strong className="text-text font-semibold">{senior.primaryLanguage}</strong></span>
              <span>Chapter: <strong className="text-text font-semibold">{senior.chapterId}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {senior.consentRecorded || senior.consent?.generalCommunications ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-chip bg-positive-tint text-positive border border-positive/30">
              Active consent
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-chip bg-critical-tint text-critical border border-critical/30">
              Opted out
            </span>
          )}
          {senior.abha?.status === 'provided_unverified' && (
            <span className="px-2.5 py-1 text-xs tabular-nums font-semibold rounded-chip bg-surface-subtle text-accent border border-border">
              ABHA: {maskAbhaNumber(senior.abha.number || '')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-border flex gap-2 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: '1. Overview' },
          { key: 'contacts', label: `2. Emergency contacts (${(senior.emergencyContacts || []).length})` },
          { key: 'consent', label: '3. Consent & privacy' },
          { key: 'abha', label: '4. ABHA (Phase 2)' },
          { key: 'sos', label: `5. SOS history (${seniorSosEvents.length})` },
          { key: 'health', label: `6. Health logs (${seniorVitals.length})` },
          { key: 'comms', label: '7. Communications' },
          { key: 'audit', label: `8. Audit trail (${seniorAudits.length})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as 'overview')}
            className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap text-xs ${
              activeTab === t.key
                ? 'border-accent text-accent font-semibold bg-accent-tint/20'
                : 'border-transparent text-text-secondary hover:text-text font-normal'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-container p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-text border-b border-border-subtle pb-2 text-sm">
              Personal & demographics
            </h3>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Full name:</span>
              <span className="font-semibold text-text">{senior.fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Date of birth:</span>
              <span className="tabular-nums text-text">{senior.dateOfBirth} (Age band: {senior.ageBand})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Gender:</span>
              <span className="text-text">{senior.gender}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Primary phone:</span>
              <div className="flex items-center gap-2">
                <span className="tabular-nums text-text font-semibold">{displayPhone}</span>
                {isPhoneMasked && (
                  <button
                    type="button"
                    onClick={() => setUnmaskModalOpen(true)}
                    className="text-xs text-accent font-semibold underline"
                  >
                    Reveal (Logged)
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Preferred language:</span>
              <span className="text-text">{senior.primaryLanguage}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-secondary">Residential address:</span>
              <span className="text-text text-right max-w-xs">{senior.address}</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-container p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-text border-b border-border-subtle pb-2 text-sm">
              Registration & safety status
            </h3>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Assigned chapter:</span>
              <span className="text-text font-semibold">{senior.chapterId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Enrolled date:</span>
              <span className="tabular-nums text-text">
                {new Date(senior.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Assisted registration:</span>
              <span className="text-text">{senior.isAssistedRegistration ? 'Yes (Assisted by field volunteer)' : 'No (WhatsApp self-onboarded)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-text-secondary">Active (14-day window):</span>
              <span className="text-positive font-semibold">Active responding elder</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-secondary">Daily medication reminders:</span>
              <span className="text-text font-semibold">{seniorSchedules.length > 0 ? 'Enabled (08:00 AM IST)' : 'None configured'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="bg-surface border border-border rounded-container p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-text">Pre-registered next-of-kin contacts</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Contacts prioritized for transactional SMS fallback if data connection drops during an emergency SOS.
            </p>
          </div>

          {(senior.emergencyContacts || []).length === 0 ? (
            <div className="p-4 bg-negative-tint border border-negative/30 text-text rounded-control text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-negative shrink-0 stroke-[1.5]" />
              <span className="text-negative font-semibold">Critical safety notice: No emergency contacts are registered for this senior citizen.</span>
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-control overflow-hidden">
              {(senior.emergencyContacts || []).map((c: EmergencyContact) => (
                <div key={c.id} className="p-4 flex items-center justify-between text-xs hover:bg-surface-hover transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text">{c.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-chip bg-surface-subtle border border-border text-text-secondary">
                        Priority {c.priorityOrder} ({c.relationship})
                      </span>
                      {c.isPrimary && (
                        <span className="text-xs px-2 py-0.5 rounded-chip bg-accent text-white font-semibold">
                          Primary next-of-kin
                        </span>
                      )}
                    </div>
                    <div className="text-text-secondary tabular-nums mt-1">
                      Phone: {c.phone || c.phoneNumber || 'N/A'}
                    </div>
                    <div className="text-xs text-positive font-semibold mt-0.5">
                      Safety SMS fallback consent recorded
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendTestSms(c.name, c.phoneNumber || c.phone || '')}
                    >
                      Send test SMS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Consent & Language */}
      {activeTab === 'consent' && (
        <div className="bg-surface border border-border rounded-container p-5 space-y-4 text-xs">
          <h3 className="font-semibold text-sm text-text border-b border-border-subtle pb-2">
            Granular consent ledger & preferences
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-control bg-surface-subtle border border-border">
              <div>
                <span className="font-semibold text-text block">WhatsApp general communications</span>
                <span className="text-text-secondary text-xs">Daily medication reminders, vitals log prompts, community wellness messages.</span>
              </div>
              <span className={`px-2 py-1 rounded-control font-semibold text-xs ${senior.consentRecorded || senior.consent?.generalCommunications ? 'bg-positive-tint text-positive' : 'bg-critical-tint text-critical'}`}>
                {senior.consentRecorded || senior.consent?.generalCommunications ? 'Consented' : 'Withdrawn'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-control bg-surface-subtle border border-border">
              <div>
                <span className="font-semibold text-text block">Emergency SOS fallback SMS to next-of-kin</span>
                <span className="text-text-secondary text-xs">Mandatory safety consent permitting cellular SMS dispatch if data network drops.</span>
              </div>
              <span className="px-2 py-1 rounded-control font-semibold text-xs bg-positive-tint text-positive">
                Consented
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-control bg-surface-subtle border border-border">
              <div>
                <span className="font-semibold text-text block">ABDM health account linkage (Phase 2)</span>
                <span className="text-text-secondary text-xs">Separate consent required for national health record federation under ABDM.</span>
              </div>
              <span className={`px-2 py-1 rounded-control font-semibold text-xs ${(senior.consent?.abdmRecordLinkage || senior.consent?.abdmLinkage) ? 'bg-accent-tint text-accent' : 'bg-surface-subtle text-text-secondary border border-border'}`}>
                {(senior.consent?.abdmRecordLinkage || senior.consent?.abdmLinkage) ? 'Consented (Pending Phase 2)' : 'Not consented'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ABHA (Phase 2 Ready) */}
      {activeTab === 'abha' && (
        <div className="bg-surface border border-border rounded-container p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="font-semibold text-sm text-text">Ayushman Bharat Health Account (ABHA)</h3>
              <p className="text-xs text-text-secondary">Structured repository field for Phase 2 ABDM federation.</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-chip bg-surface-subtle text-text-secondary border border-border">
              Phase 2 preparation
            </span>
          </div>

          <div className="p-3 bg-surface-subtle border border-border rounded-control text-text-secondary">
            <strong className="text-text font-semibold">Institutional notice:</strong> ABHA number is collected strictly as a format-validated structure. Federated linkage, verification, and longitudinal EHR sharing are scheduled for Phase 2 after project execution sign-off.
          </div>

          <div className="space-y-3 max-w-md">
            <div>
              <span className="text-text-secondary block">14-digit ABHA number:</span>
              <span className="tabular-nums text-sm font-semibold text-text">
                {senior.abha?.number ? maskAbhaNumber(senior.abha.number) : 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block">Verification status:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-chip text-xs font-semibold bg-critical-tint text-text border border-critical/30">
                {senior.abha?.status === 'provided_unverified' ? 'Provided, not verified (Phase 2)' : 'Not provided'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary block">ABHA address / virtual handle:</span>
              <span className="tabular-nums text-text">{senior.abha?.address || 'None'}</span>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                title="ABDM integration will be activated in Phase 2"
              >
                Link ABHA account (Phase 2)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SOS History */}
      {activeTab === 'sos' && (
        <div className="bg-surface border border-border rounded-container p-5 space-y-3">
          <h3 className="font-semibold text-sm text-text">Emergency SOS dispatch history</h3>
          {seniorSosEvents.length === 0 ? (
            <p className="text-xs text-text-secondary py-4 text-center">No emergency SOS triggers recorded for this senior citizen.</p>
          ) : (
            <div className="divide-y divide-border border border-border rounded-control overflow-hidden">
              {seniorSosEvents.map((evt) => (
                <div key={evt.id} className="p-3 text-xs flex items-center justify-between hover:bg-surface-hover transition-colors">
                  <div>
                    <span className="tabular-nums font-semibold text-accent">{evt.id}</span>
                    <span className="text-text-secondary ml-2 tabular-nums">Triggered: {new Date(evt.triggeredAt).toLocaleString('en-IN')}</span>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Network: {evt.networkStatusAtTrigger} · Fallback SMS: {evt.cellularFallbackTriggered ? 'Dispatched' : 'None'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusChip
                      status={evt.status === 'RESOLVED' ? 'success' : 'danger'}
                      label={evt.status}
                    />
                    <Button variant="outline" size="sm" onClick={() => navigate(`/sos/${evt.id}`)}>
                      View incident case
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
          <div className="bg-surface border border-border rounded-container p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text">Blood pressure trend (Last 10 readings)</h3>
            <p className="text-xs text-text-secondary">Shaded reference area highlights high-risk threshold band (Systolic &ge; 140 mmHg).</p>

            {bpChartData.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bpChartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis domain={[60, 200]} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip />
                    <ReferenceArea y1={140} y2={200} fill="var(--critical-tint)" fillOpacity={0.5} />
                    <Line type="monotone" dataKey="systolic" stroke="var(--chart-1)" strokeWidth={2} name="Systolic (mmHg)" />
                    <Line type="monotone" dataKey="diastolic" stroke="var(--chart-2)" strokeWidth={2} name="Diastolic (mmHg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-text-secondary text-center py-8">No blood pressure logs submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Communication Log */}
      {activeTab === 'comms' && (
        <div className="bg-surface border border-border rounded-container p-5 space-y-2">
          <h3 className="font-semibold text-sm text-text">WhatsApp & SMS message log</h3>
          <p className="text-xs text-text-secondary">Outbound template dispatches and incoming response receipts.</p>
          <div className="mt-3 p-3 bg-surface-subtle rounded-control text-xs text-text-secondary border border-border">
            Daily morning 08:00 AM prescription reminders active. Last response logged: 27 Oct 2026, 8:14 AM IST (Taken).
          </div>
        </div>
      )}

      {/* Tab 8: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-surface border border-border rounded-container p-5 space-y-3">
          <h3 className="font-semibold text-sm text-text">Profile field-level audit ledger</h3>
          <div className="space-y-2 text-xs">
            {seniorAudits.length === 0 ? (
              <p className="text-text-secondary">Genesis record created at onboarding.</p>
            ) : (
              seniorAudits.map((a) => (
                <div key={a.id} className="p-3 bg-surface-subtle rounded-control border border-border space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-text">{a.action}: {a.details}</span>
                    <span className="text-text-secondary tabular-nums text-xs">{a.timestamp}</span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    Actor: {a.actorRole} ({a.actorId}) · Entity: <span className="tabular-nums text-accent font-semibold">{a.entityId}</span>
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
