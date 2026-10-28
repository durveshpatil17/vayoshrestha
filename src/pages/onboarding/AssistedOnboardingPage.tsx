import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateMembershipId } from '@/domain/idGenerator';
import { isValidIndianMobile, formatIndianMobile } from '@/domain/onboarding';
import { isValidAbhaNumber, maskAbhaNumber, formatRawAbha } from '@/domain/abha';
import { dobToAgeBand } from '@/domain/masking';
import { SeniorCitizen, EmergencyContact } from '@/api/contracts';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  UserCheck,
  Printer,
  Send,
  ShieldAlert,
} from 'lucide-react';

export const AssistedOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [step, setStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [submittedSenior, setSubmittedSenior] = useState<SeniorCitizen | null>(null);

  // Form State
  const [volunteerName, setVolunteerName] = useState(user?.fullName || 'Field Volunteer');
  const [volunteerRoleDeclaration, setVolunteerRoleDeclaration] = useState(true);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1956-06-15');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [chapterId, setChapterId] = useState(user?.assignedChapter || user?.assignedCentres[0] || 'HUB-PUN');
  const [language, setLanguage] = useState<'Marathi' | 'Hindi' | 'English' | 'Kannada' | 'Tamil'>('Marathi');
  const [address, setAddress] = useState('');

  // Emergency Contact 1
  const [nokName, setNokName] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [nokRelation, setNokRelation] = useState<'Son' | 'Daughter' | 'Spouse' | 'Caregiver' | 'Neighbour'>('Son');
  const [nokConsent, setNokConsent] = useState(true);

  // ABHA (Optional Phase 2)
  const [abhaNumber, setAbhaNumber] = useState('');
  const [abhaAddress, setAbhaAddress] = useState('');
  const [abdmConsent, setAbdmConsent] = useState(false);

  // Medication schedule (Optional)
  const [wantsMedicationReminder, setWantsMedicationReminder] = useState(true);
  const [prescriptionLabel, setPrescriptionLabel] = useState('Morning wellness & blood pressure prescription');
  const [reminderTime, setReminderTime] = useState('08:00');

  // Duplicate Check on Phone Blur
  const handlePhoneBlur = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const found = data.seniorCitizens.find((s) => (s.phoneNumber || s.phone || '').includes(cleanPhone.slice(-10)));
    if (found) {
      setDuplicateWarning(
        `Potential Duplicate: A senior citizen is already registered with mobile number ending in ${cleanPhone.slice(-4)} (${found.fullName}, ID: ${found.memberId || found.membershipId}).`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const currentChapterObj = data.chapters.find((c) => c.id === chapterId) || data.chapters[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSeq = data.seniorCitizens.length + 1;
    const membershipId = generateMembershipId(currentChapterObj.code, 26, newSeq);
    const seniorId = `m-${newSeq}`;

    const contacts: EmergencyContact[] = [
      {
        id: `c-${newSeq}-1`,
        name: nokName,
        relationship: nokRelation,
        phone: nokPhone,
        isPrimary: true,
        safetySmsConsent: nokConsent,
        priorityOrder: 1,
      },
    ];

    const hasAbhaValid = Boolean(abhaNumber && isValidAbhaNumber(abhaNumber));

    const newSenior: SeniorCitizen = {
      id: seniorId,
      membershipId,
      fullName: fullName.trim(),
      dateOfBirth,
      ageBand: dobToAgeBand(dateOfBirth),
      gender,
      phone: phone.trim(),
      emergencyContacts: contacts,
      emergencyContactName: nokName,
      emergencyContactPhone: nokPhone,
      chapterId: currentChapterObj.id,
      centreId: currentChapterObj.id,
      primaryLanguage: language,
      address,
      digitalConfidence: 'Assisted',
      isAssistedRegistration: true,
      assistedBy: `${volunteerName} (${user?.role})`,
      consent: {
        generalCommunications: true,
        safetySmsFallback: nokConsent,
        abdmLinkage: abdmConsent,
        recordedAt: new Date().toISOString(),
        version: 'v1.2-2026',
      },
      abha: {
        number: hasAbhaValid ? abhaNumber : undefined,
        address: abhaAddress || undefined,
        abdmConsent,
        status: hasAbhaValid ? 'provided_unverified' : 'not_provided',
      },
      status: 'Registered',
      isActive: true,
      registeredAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.seniorCitizens.unshift(newSenior);
      if (wantsMedicationReminder) {
        draft.medicationSchedules.unshift({
          id: `sched-${Date.now()}`,
          seniorId,
          seniorName: newSenior.fullName,
          label: prescriptionLabel,
          time: reminderTime,
          frequency: 'Daily',
          language,
          status: 'Active',
        });
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Field Volunteer',
      user?.role || 'VF',
      'CREATE',
      'SENIOR',
      newSenior.id,
      `Completed assisted paper-to-digital registration for ${newSenior.fullName} at ${currentChapterObj.name}. Assigned Membership ID: ${membershipId}`,
      'Assisted onboarding on behalf of senior',
      undefined,
      currentChapterObj.id
    );

    setSubmittedSenior(newSenior);
  };

  if (submittedSenior) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        <div className="bg-white border border-border-hairline rounded p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-4 border border-success/30">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-text-primary">
            Registration Completed Successfully
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Membership card issued and saved to the offline-ready registry.
          </p>

          {/* Printable Member Card Preview */}
          <div className="mt-6 p-6 border-2 border-dashed border-border-strong rounded-lg bg-bg-subtle text-left max-w-md mx-auto">
            <div className="flex justify-between items-start border-b border-border-hairline pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Vayoh Vikas</span>
                <span className="font-serif font-bold text-sm text-text-primary">Vayoshreshtha Member Card</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-accent text-white rounded">
                PILOT 2026
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">Senior Name:</span>
                <strong className="text-text-primary text-sm font-semibold">{submittedSenior.fullName}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-muted block text-[10px]">Membership ID:</span>
                  <span className="font-mono font-bold text-accent">{submittedSenior.membershipId}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">Primary Chapter:</span>
                  <span className="text-text-primary font-medium">{submittedSenior.chapterId}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-muted block text-[10px]">Emergency Contact:</span>
                  <span className="text-text-primary">{submittedSenior.emergencyContactName || submittedSenior.emergencyContacts?.[0]?.name || 'Next-of-Kin'} ({submittedSenior.emergencyContacts?.[0]?.relationship || 'Family'})</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px]">Primary Language:</span>
                  <span className="text-text-primary">{submittedSenior.primaryLanguage}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border-hairline text-[10px] text-text-muted text-center">
              🚨 In an emergency, tap SOS on WhatsApp or call 112 directly.
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print Member Card
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/seniors')}
            >
              View Senior Directory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Assisted Senior Citizen Onboarding Wizard"
        description="Mirror of the WhatsApp onboarding bot for volunteers assisting elders who cannot self-register."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Onboarding', to: '/onboarding' },
          { label: 'Assisted Registration' },
        ]}
      />

      {duplicateWarning && (
        <div className="p-4 bg-warning-bg border border-warning/40 text-warning rounded text-xs flex gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-bold">Possible Duplicate Record Detected</div>
            <div>{duplicateWarning}</div>
          </div>
        </div>
      )}

      {/* Stepper Progress */}
      <div className="bg-white border border-border-hairline rounded p-4">
        <div className="flex items-center justify-between">
          {[
            '1. Declaration',
            '2. Name & DOB',
            '3. Language & Hub',
            '4. Emergency Contact',
            '5. ABHA (Phase 2)',
            '6. Reminders',
            '7. Review & Submit',
          ].map((title, i) => (
            <div
              key={title}
              className={`text-xs flex items-center gap-1.5 ${
                step === i + 1
                  ? 'font-bold text-accent'
                  : step > i + 1
                  ? 'text-success font-medium'
                  : 'text-text-muted'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === i + 1
                    ? 'bg-accent text-white'
                    : step > i + 1
                    ? 'bg-success text-white'
                    : 'bg-bg-subtle text-text-muted border border-border-hairline'
                }`}
              >
                {step > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden md:inline">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <form onSubmit={handleSubmit} className="bg-white border border-border-hairline rounded p-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 1: Volunteer Declaration & Consent
            </h3>
            <p className="text-xs text-text-muted">
              Record the field volunteer assisting the senior citizen with digital onboarding.
            </p>
            <Input
              label="Assisting Volunteer Full Name"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              required
            />
            <label className="flex items-start gap-2.5 p-3 rounded bg-bg-subtle border border-border-hairline cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={volunteerRoleDeclaration}
                onChange={(e) => setVolunteerRoleDeclaration(e.target.checked)}
                className="mt-0.5"
                required
              />
              <span className="text-text-primary">
                I declare that the senior citizen has verbally provided consent for Vayoh Vikas to store their name, language, emergency contacts, and to receive WhatsApp messages and emergency safety support.
              </span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 2: Senior Citizen Personal Identity
            </h3>
            <Input
              label="Full Name (as requested to be addressed)"
              placeholder="e.g. Ramesh Gopal Kulkarni"
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
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs bg-bg-subtle border border-border-hairline rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <Input
              label="Senior Mobile Number (+91)"
              placeholder="e.g. 9822012345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={handlePhoneBlur}
              required
              helperText="Indian 10-digit mobile number with active WhatsApp service."
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 3: Preferred Language & Primary Chapter
            </h3>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">Primary Communication Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full text-xs bg-bg-subtle border border-border-hairline rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="English">English</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">Assigned Ekta Hub Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full text-xs bg-bg-subtle border border-border-hairline rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              >
                {data.chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city}, {c.state})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Residential Address"
              placeholder="e.g. 14 Sadashiv Peth, Near Tilak Smarak Mandir, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 4: Primary Emergency Contact (Next-of-Kin)
            </h3>
            <p className="text-xs text-text-muted">
              Pre-registered contact who will receive transactional fallback SMS during data drops when an SOS is triggered.
            </p>
            <Input
              label="Contact Full Name"
              placeholder="e.g. Sunil Ramesh Kulkarni"
              value={nokName}
              onChange={(e) => setNokName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">Relationship</label>
                <select
                  value={nokRelation}
                  onChange={(e) => setNokRelation(e.target.value as any)}
                  className="w-full text-xs bg-bg-subtle border border-border-hairline rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Neighbour">Neighbour</option>
                </select>
              </div>
              <Input
                label="Contact Mobile (+91)"
                placeholder="e.g. 9822199888"
                value={nokPhone}
                onChange={(e) => setNokPhone(e.target.value)}
                required
              />
            </div>
            <label className="flex items-start gap-2.5 p-3 rounded bg-bg-subtle border border-border-hairline cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={nokConsent}
                onChange={(e) => setNokConsent(e.target.checked)}
                className="mt-0.5"
                required
              />
              <span className="text-text-primary">
                Consent recorded: The senior confirms that this Next-of-Kin may be messaged by SMS if an SOS emergency is triggered.
              </span>
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <h3 className="text-sm font-semibold text-text-primary">
                Step 5: Ayushman Bharat Health Account (ABHA) — Structure Only
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-bg-subtle text-text-muted border border-border-hairline">
                Phase 2 Ready
              </span>
            </div>

            <div className="p-3 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted">
              <strong>Institutional Notice:</strong> In this pilot, ABHA number collection is strictly structure-only for format validation. Federated linkage and KYC verification are deferred to Phase 2 after project-execution confirmation.
            </div>

            <Input
              label="14-digit ABHA Number (Optional: XX-XXXX-XXXX-XXXX)"
              placeholder="e.g. 12-3456-7890-1234"
              value={abhaNumber}
              onChange={(e) => setAbhaNumber(e.target.value)}
              helperText="Optional. Hyphenated 14 digits format."
            />

            <Input
              label="ABHA Address / Virtual ID (Optional)"
              placeholder="e.g. ramesh.kulkarni@abdm"
              value={abhaAddress}
              onChange={(e) => setAbhaAddress(e.target.value)}
            />

            <label className="flex items-start gap-2.5 p-3 rounded bg-bg-subtle border border-border-hairline cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={abdmConsent}
                onChange={(e) => setAbdmConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-text-primary">
                Separate ABDM Consent: The senior consents to future ABDM health record federation (Phase 2).
              </span>
            </label>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 6: Morning Medication & Vitals Schedule (Optional)
            </h3>
            <label className="flex items-start gap-2.5 p-3 rounded bg-bg-subtle border border-border-hairline cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={wantsMedicationReminder}
                onChange={(e) => setWantsMedicationReminder(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-text-primary font-medium">
                Enable daily 08:00 AM WhatsApp morning wellness reminder and blood pressure log prompt.
              </span>
            </label>

            {wantsMedicationReminder && (
              <div className="space-y-3 pt-2">
                <Input
                  label="Prescription Label"
                  value={prescriptionLabel}
                  onChange={(e) => setPrescriptionLabel(e.target.value)}
                  helperText="Non-clinical label (no dosage instructions are collected or displayed)."
                />
                <Input
                  label="Reminder Scheduled Time (IST)"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              Step 7: Review & Final Submission
            </h3>
            <div className="bg-bg-subtle rounded p-4 space-y-2 text-xs border border-border-hairline">
              <div className="flex justify-between border-b border-border-hairline pb-1.5">
                <span className="text-text-muted">Full Name:</span>
                <span className="font-semibold text-text-primary">{fullName}</span>
              </div>
              <div className="flex justify-between border-b border-border-hairline pb-1.5">
                <span className="text-text-muted">Phone Number:</span>
                <span className="font-mono text-text-primary">{formatIndianMobile(phone)}</span>
              </div>
              <div className="flex justify-between border-b border-border-hairline pb-1.5">
                <span className="text-text-muted">Chapter:</span>
                <span className="text-text-primary">{currentChapterObj.name}</span>
              </div>
              <div className="flex justify-between border-b border-border-hairline pb-1.5">
                <span className="text-text-muted">Primary Next-of-Kin:</span>
                <span className="text-text-primary">{nokName} ({nokRelation}) — {nokPhone}</span>
              </div>
              <div className="flex justify-between border-b border-border-hairline pb-1.5">
                <span className="text-text-muted">ABHA Status:</span>
                <span className="text-text-primary">
                  {abhaNumber ? `${maskAbhaNumber(abhaNumber)} (Provided, unverified - Phase 2)` : 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Assisted By:</span>
                <span className="text-text-primary">{volunteerName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border-hairline">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                if (step === 2 && (!fullName.trim() || !phone.trim())) {
                  alert('Please enter both Full Name and Phone Number.');
                  return;
                }
                if (step === 4 && (!nokName.trim() || !nokPhone.trim())) {
                  alert('Please enter Next-of-Kin Name and Mobile.');
                  return;
                }
                setStep(step + 1);
              }}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Check className="w-4 h-4" />}
            >
              Confirm & Issue Membership Card
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
