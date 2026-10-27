import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { checkDuplicateMember } from '@/domain/duplicateCheck';
import { generateMembershipId } from '@/domain/idGenerator';
import { canSendMessage } from '@/domain/consent';
import {
  Check,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const MemberNewPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const centres = mockStore.getData().centres;
  const existingMembers = mockStore.getData().seniorCitizens;

  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    found: boolean;
    confidence: 'high' | 'medium' | 'none';
    memberId: string | null;
    reasons: string[];
  }>({ found: false, confidence: 'none', memberId: null, reasons: [] });

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1956-05-15');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState<'Marathi' | 'Hindi' | 'English' | 'Gujarati'>('Marathi');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [centreId, setCentreId] = useState(centres[0]?.id || 'HUB-PUN');

  // Assisted Mode (FR-08)
  const [isAssisted, setIsAssisted] = useState(false);
  const [assistantName, setAssistantName] = useState(user?.fullName || '');
  const [assistantRelationship, setAssistantRelationship] = useState('Field Volunteer');
  const [declaredOnBehalf, setDeclaredOnBehalf] = useState(false);

  // Consent & Preferences (FR-09, 29)
  const [consentGranted, setConsentGranted] = useState(true);
  const [allowWhatsApp, setAllowWhatsApp] = useState(true);

  // Submission State
  const [submittedMember, setSubmittedMember] = useState<any | null>(null);
  const [welcomeMessageDispatched, setWelcomeMessageDispatched] = useState(false);

  // Real-time Duplicate Detection (Name + DOB + Phone)
  useEffect(() => {
    if (fullName.trim().length >= 3 && phone.trim().length >= 10) {
      const result = checkDuplicateMember(
        { fullName, dateOfBirth, phone },
        existingMembers
      );
      if (result.isDuplicate || result.isPotentialDuplicate) {
        setDuplicateWarning({
          found: true,
          confidence: result.confidence,
          memberId: result.matchedMemberId,
          reasons: result.matchReasons,
        });
      } else {
        setDuplicateWarning({ found: false, confidence: 'none', memberId: null, reasons: [] });
      }
    }
  }, [fullName, dateOfBirth, phone, existingMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCentre = centres.find((c) => c.id === centreId) || centres[0];
    const hubMembersCount = existingMembers.filter((m) => m.centreId === centreId).length;
    const membershipId = generateMembershipId(selectedCentre.code, 26, hubMembersCount + 1);

    const newMember = {
      id: `m-${Date.now()}`,
      membershipId,
      fullName,
      dateOfBirth,
      gender,
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      centreId,
      primaryLanguage,
      address,
      digitalConfidence: 'Basic' as const,
      isAssistedRegistration: isAssisted,
      assistedBy: isAssisted ? `${assistantName} (${assistantRelationship})` : undefined,
      consentStatus: consentGranted ? ('OptedIn' as const) : ('Pending' as const),
      consentRecordedAt: consentGranted ? new Date().toISOString() : undefined,
      optedOutChannels: allowWhatsApp ? [] : ['WhatsApp'],
      registeredAt: new Date().toISOString().split('T')[0],
      isActive: false,
      status: 'Registered' as const,
    };

    mockStore.updateData((data) => {
      data.seniorCitizens.unshift(newMember);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Volunteer Staff',
      user?.role || 'VF',
      'CREATE',
      'SeniorCitizen',
      newMember.id,
      isAssisted ? `Assisted elder registration by ${assistantName}` : 'Self registration',
      null,
      newMember,
      centreId
    );

    setSubmittedMember(newMember);
  };

  const handleSendWelcomeMessage = () => {
    if (!submittedMember) return;
    const consentCheck = canSendMessage(submittedMember, 'BookingConfirmation');
    if (!consentCheck.allowed) {
      alert(`Cannot send welcome message: ${consentCheck.reason}`);
      return;
    }

    mockStore.updateData((data) => {
      data.outboundMessages.unshift({
        id: `msg-${Date.now()}`,
        recipientMemberId: submittedMember.id,
        recipientPhone: submittedMember.phone,
        recipientName: submittedMember.fullName,
        centreId: submittedMember.centreId,
        templateCode: 'WELCOME_01',
        category: 'Announcement',
        content: `Namaste ${submittedMember.fullName}, welcome to Vayoshreshtha! Your membership ID is ${submittedMember.membershipId}. Reply STOP to opt out.`,
        status: 'Queued',
        scheduledFor: new Date().toISOString(),
        retryCount: 0,
      });
    });

    setWelcomeMessageDispatched(true);
  };

  if (submittedMember) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-6">
        <div className="w-14 h-14 rounded-full bg-success-bg text-success flex items-center justify-center mx-auto border border-success/30">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-text-primary">
          Senior Citizen Successfully Registered
        </h1>
        <p className="text-xs text-text-muted">
          New membership record created and recorded in the audit trail.
        </p>

        {/* Printable Physical Membership Card Preview */}
        <div className="bg-bg-base border-2 border-border-strong rounded-lg p-6 max-w-md mx-auto text-left shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-hairline">
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Vayoh Vikas NGO</span>
              <span className="font-serif text-base font-bold text-text-primary">Vayoshreshtha Ekta Card</span>
            </div>
            <div className="w-8 h-8 rounded bg-accent text-white font-serif font-bold flex items-center justify-center text-sm">
              V
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-text-muted block">Elder Member Name</span>
              <span className="text-sm font-bold text-text-primary">{submittedMember.fullName}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="text-[10px] text-text-muted block">Membership ID</span>
                <span className="font-mono font-bold text-accent text-sm">{submittedMember.membershipId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-muted block">Centre</span>
                <span className="font-semibold text-text-primary">{submittedMember.centreId}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Emergency Helpline</span>
              <span className="font-mono text-text-muted">+91 98220 11999 (Vayoh Vikas)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => navigate(`/members/${submittedMember.id}/card`)}
          >
            Print Membership Card
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            disabled={welcomeMessageDispatched || submittedMember.consentStatus !== 'OptedIn'}
            onClick={handleSendWelcomeMessage}
          >
            {welcomeMessageDispatched ? 'Welcome WhatsApp Queued' : 'Send Welcome WhatsApp'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/members/${submittedMember.id}`)}
          >
            View Member Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Register Senior Citizen"
        description="5-step structured intake with duplicate prevention, assisted declaration, and recorded consent."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Senior Citizens', to: '/members' }, { label: 'New Registration' }]}
      />

      {/* Stepper Progress Header */}
      <div className="flex items-center justify-between border-b border-border-hairline pb-4 text-xs font-medium">
        {[
          { step: 1, title: '1. Identity' },
          { step: 2, title: '2. Contact' },
          { step: 3, title: '3. Centre' },
          { step: 4, title: '4. Consent' },
          { step: 5, title: '5. Review' },
        ].map((s) => (
          <div
            key={s.step}
            className={`flex items-center gap-1.5 ${
              currentStep === s.step
                ? 'text-accent font-bold'
                : currentStep > s.step
                ? 'text-text-primary'
                : 'text-text-disabled'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === s.step
                  ? 'bg-accent text-white'
                  : currentStep > s.step
                  ? 'bg-success-bg text-success'
                  : 'bg-bg-subtle text-text-muted'
              }`}
            >
              {currentStep > s.step ? <Check className="w-3 h-3" /> : s.step}
            </span>
            <span>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Real-Time Duplicate Warning Alert */}
      {duplicateWarning.found && (
        <div className="p-4 bg-warning-bg text-warning rounded border border-warning/30 text-xs flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">
                Potential Duplicate Senior Citizen Detected ({duplicateWarning.confidence} confidence)
              </strong>
              <p className="text-text-muted">
                {duplicateWarning.reasons.join(', ')}. Existing Member ID: <strong className="font-mono text-text-primary">{duplicateWarning.memberId}</strong>.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/members/${duplicateWarning.memberId}`)}
          >
            Inspect Existing Record
          </Button>
        </div>
      )}

      {/* Wizard Step Forms */}
      <div className="bg-bg-base border border-border-hairline rounded p-6 shadow-xs">
        {/* Step 1: Identity & Assisted Flag */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
              <h3 className="font-serif text-base font-semibold text-text-primary">
                Step 1 · Elder Identity & Intake Mode
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isAssisted}
                  onChange={(e) => setIsAssisted(e.target.checked)}
                  className="rounded border-border-strong text-accent focus:ring-accent"
                />
                <span className="font-semibold text-accent">Assisted Registration Mode (FR-08)</span>
              </label>
            </div>

            {isAssisted && (
              <div className="p-4 bg-accent-tint/30 border border-accent/20 rounded space-y-3 text-xs">
                <span className="font-semibold text-text-primary block">
                  Proxy / Field Volunteer Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Assistant Name"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    required
                  />
                  <Input
                    label="Relationship to Senior"
                    value={assistantRelationship}
                    onChange={(e) => setAssistantRelationship(e.target.value)}
                    placeholder="e.g. Field Volunteer, Son, Neighbour"
                    required
                  />
                </div>
                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declaredOnBehalf}
                    onChange={(e) => setDeclaredOnBehalf(e.target.checked)}
                    className="rounded border-border-strong text-accent focus:ring-accent mt-0.5"
                  />
                  <span className="text-text-muted">
                    I declare on behalf of the senior citizen that the details provided are true and entered with their verbal understanding and consent.
                  </span>
                </label>
              </div>
            )}

            <Input
              label="Full Name of Senior Citizen"
              placeholder="e.g. Bhagwandas Ramchandra Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date of Birth (YYYY-MM-DD)"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                options={[
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact & Language */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary pb-3 border-b border-border-hairline">
              Step 2 · Contact Details & Language Preference
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Senior Citizen Mobile Number"
                type="tel"
                placeholder="10-digit Indian number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Used for session reminders and WhatsApp updates"
                required
              />
              <Select
                label="Primary Language"
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value as any)}
                options={[
                  { value: 'Marathi', label: 'Marathi (मराठी)' },
                  { value: 'Hindi', label: 'Hindi (हिंदी)' },
                  { value: 'English', label: 'English' },
                  { value: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
                ]}
              />
            </div>

            <Input
              label="Residential Address"
              placeholder="House/Flat No., Street, Ward, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="pt-2">
              <span className="text-xs font-semibold text-text-primary block mb-2">Emergency Contact</span>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Contact Person Name"
                  placeholder="Relative or neighbour"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  required
                />
                <Input
                  label="Emergency Phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Centre Allocation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary pb-3 border-b border-border-hairline">
              Step 3 · Ekta Hub Allocation
            </h3>

            <Select
              label="Assigned Ekta Hub Community Centre"
              value={centreId}
              onChange={(e) => setCentreId(e.target.value)}
              options={centres.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.city}, ${c.state})`,
              }))}
            />

            <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted">
              Senior will be registered to attend scheduled activities, yoga sessions, and health camps at this designated hub.
            </div>
          </div>
        )}

        {/* Step 4: Consent & DPDP Notice */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary pb-3 border-b border-border-hairline">
              Step 4 · Consent & Communication Permissions (FR-09, FR-29)
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 p-3 rounded border border-border-hairline cursor-pointer bg-bg-subtle/30">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded border-border-strong text-accent focus:ring-accent mt-0.5"
                />
                <div>
                  <strong className="block text-text-primary font-semibold mb-0.5">
                    Formal Eldercare Ecosystem Consent
                  </strong>
                  <span className="text-text-muted leading-relaxed">
                    The elder agrees to have their basic registration details maintained by Vayoh Vikas to participate in Ekta Hub sessions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded border border-border-hairline cursor-pointer bg-bg-subtle/30">
                <input
                  type="checkbox"
                  checked={allowWhatsApp}
                  onChange={(e) => setAllowWhatsApp(e.target.checked)}
                  disabled={!consentGranted}
                  className="rounded border-border-strong text-accent focus:ring-accent mt-0.5"
                />
                <div>
                  <strong className="block text-text-primary font-semibold mb-0.5">
                    WhatsApp Programme Notifications & Reminders
                  </strong>
                  <span className="text-text-muted leading-relaxed">
                    Permits dispatching reminder messages and event schedules. The elder can opt out at any time by replying 'STOP'.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-base font-semibold text-text-primary pb-3 border-b border-border-hairline">
              Step 5 · Final Verification & Membership Issuance
            </h3>

            <div className="grid grid-cols-2 gap-4 p-4 bg-bg-subtle rounded border border-border-hairline">
              <div>
                <span className="text-text-muted block">Full Name:</span>
                <span className="font-semibold text-text-primary">{fullName}</span>
              </div>
              <div>
                <span className="text-text-muted block">Date of Birth:</span>
                <span className="font-semibold text-text-primary">{dateOfBirth}</span>
              </div>
              <div>
                <span className="text-text-muted block">Phone:</span>
                <span className="font-mono font-semibold text-text-primary">{phone}</span>
              </div>
              <div>
                <span className="text-text-muted block">Language:</span>
                <span className="font-semibold text-text-primary">{primaryLanguage}</span>
              </div>
              <div>
                <span className="text-text-muted block">Centre:</span>
                <span className="font-semibold text-text-primary">{centres.find((c) => c.id === centreId)?.name}</span>
              </div>
              <div>
                <span className="text-text-muted block">Assisted Registration:</span>
                <span className="font-semibold text-text-primary">{isAssisted ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-text-muted block">Consent Status:</span>
                <span className="font-semibold text-success">{consentGranted ? 'Opted In' : 'Pending'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex justify-between pt-6 mt-6 border-t border-border-hairline">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              Previous
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => navigate('/members')}>
              Cancel
            </Button>
          )}

          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={currentStep === 1 && (!fullName.trim() || (isAssisted && !declaredOnBehalf))}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Generate Membership ID & Issue Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
