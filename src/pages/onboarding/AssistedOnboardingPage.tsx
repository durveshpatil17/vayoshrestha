import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Wizard } from '@/ui/Wizard';
import { generateMembershipId } from '@/domain/idGenerator';
import { formatIndianMobile } from '@/domain/onboarding';
import { isValidAbhaNumber, maskAbhaNumber } from '@/domain/abha';
import { dobToAgeBand } from '@/domain/masking';
import { SeniorCitizen, EmergencyContact } from '@/api/contracts';
import {
  Check,
  AlertTriangle,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const AssistedOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [activeStep, setActiveStep] = useState(0);
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
        `Potential duplicate: A senior citizen is already registered with mobile number ending in ${cleanPhone.slice(-4)} (${found.fullName}, ID: ${found.memberId || found.membershipId}).`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const currentChapterObj = data.chapters.find((c) => c.id === chapterId) || data.chapters[0];

  const handleSubmit = () => {
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
        <div className="bg-surface border border-border rounded-container p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-positive-tint text-positive rounded-full flex items-center justify-center mx-auto border border-positive/30">
            <Check className="w-8 h-8 stroke-[2]" />
          </div>
          <h2 className="text-xl font-semibold text-text">
            Registration completed successfully
          </h2>
          <p className="text-xs text-text-secondary">
            Membership card issued and saved to the offline-ready registry.
          </p>

          {/* Printable Member Card Preview */}
          <div className="mt-6 p-6 border-2 border-dashed border-border rounded-container bg-surface-subtle text-left max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-start border-b border-border-subtle pb-3">
              <div>
                <span className="text-xs font-semibold text-accent block">Vayoh Vikas</span>
                <span className="font-semibold text-sm text-text">Vayoshreshtha member card</span>
              </div>
              <span className="px-2 py-0.5 text-xs tabular-nums font-semibold bg-accent text-white rounded-chip">
                PILOT 2026
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-text-secondary block">Senior name:</span>
                <strong className="text-text text-sm font-semibold">{submittedSenior.fullName}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-secondary block">Membership ID:</span>
                  <span className="tabular-nums font-semibold text-accent">{submittedSenior.membershipId}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Primary chapter:</span>
                  <span className="text-text font-semibold">{submittedSenior.chapterId}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-secondary block">Emergency contact:</span>
                  <span className="text-text font-semibold">
                    {submittedSenior.emergencyContactName || submittedSenior.emergencyContacts?.[0]?.name || 'Next-of-Kin'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary block">Primary language:</span>
                  <span className="text-text font-semibold">{submittedSenior.primaryLanguage}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle text-xs text-text-secondary text-center">
              In an emergency, tap SOS on WhatsApp or call 112 directly.
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print member card
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/seniors')}
            >
              View senior directory
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: 'step-declaration',
      title: 'Declaration & consent',
      description: 'Record field volunteer assisting the senior citizen.',
      content: (
        <div className="space-y-4">
          <Input
            label="Assisting volunteer full name"
            value={volunteerName}
            onChange={(e) => setVolunteerName(e.target.value)}
            required
          />
          <label className="flex items-start gap-2.5 p-3 rounded-control bg-surface-subtle border border-border cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={volunteerRoleDeclaration}
              onChange={(e) => setVolunteerRoleDeclaration(e.target.checked)}
              className="mt-0.5 text-accent"
              required
            />
            <span className="text-text">
              I declare that the senior citizen has verbally provided consent for Vayoh Vikas to store their name, language, emergency contacts, and to receive WhatsApp messages and emergency safety support.
            </span>
          </label>
        </div>
      ),
    },
    {
      id: 'step-identity',
      title: 'Personal identity',
      description: 'Senior citizen identity and contact details.',
      content: (
        <div className="space-y-4">
          <Input
            label="Full name (as addressed)"
            placeholder="e.g. Ramesh Gopal Kulkarni"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of birth (YYYY-MM-DD)"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Female' | 'Male' | 'Other')}
                className="w-full text-xs bg-surface border border-border rounded-control px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <Input
            label="Senior mobile number (+91)"
            placeholder="e.g. 9822012345"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={handlePhoneBlur}
            required
            helperText="Indian 10-digit mobile number with active WhatsApp service."
          />
        </div>
      ),
    },
    {
      id: 'step-chapter',
      title: 'Language & hub',
      description: 'Select primary communication language and community chapter.',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Primary communication language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'Marathi' | 'Hindi' | 'English' | 'Kannada' | 'Tamil')}
              className="w-full text-xs bg-surface border border-border rounded-control px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="English">English</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Assigned Ekta Hub chapter</label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full text-xs bg-surface border border-border rounded-control px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {data.chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city}, {c.state})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Residential address"
            placeholder="e.g. 14 Sadashiv Peth, Near Tilak Smarak Mandir, Pune"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      ),
    },
    {
      id: 'step-nok',
      title: 'Emergency contact',
      description: 'Next-of-kin emergency contact for cellular SMS fallback.',
      content: (
        <div className="space-y-4">
          <Input
            label="Contact full name"
            placeholder="e.g. Sunil Ramesh Kulkarni"
            value={nokName}
            onChange={(e) => setNokName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Relationship</label>
              <select
                value={nokRelation}
                onChange={(e) => setNokRelation(e.target.value as 'Son' | 'Daughter' | 'Spouse' | 'Caregiver' | 'Neighbour')}
                className="w-full text-xs bg-surface border border-border rounded-control px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Spouse">Spouse</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Neighbour">Neighbour</option>
              </select>
            </div>
            <Input
              label="Contact mobile (+91)"
              placeholder="e.g. 9822199888"
              value={nokPhone}
              onChange={(e) => setNokPhone(e.target.value)}
              required
            />
          </div>
          <label className="flex items-start gap-2.5 p-3 rounded-control bg-surface-subtle border border-border cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={nokConsent}
              onChange={(e) => setNokConsent(e.target.checked)}
              className="mt-0.5 text-accent"
              required
            />
            <span className="text-text">
              Consent recorded: The senior confirms that this next-of-kin may be messaged by SMS if an SOS emergency is triggered.
            </span>
          </label>
        </div>
      ),
    },
    {
      id: 'step-abha',
      title: 'ABHA account (Phase 2)',
      description: 'Ayushman Bharat Health Account structure validation.',
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs text-text-secondary">
            <strong className="text-text font-semibold">Institutional notice:</strong> In this pilot, ABHA number collection is strictly structure-only for format validation. Federated linkage and KYC verification are deferred to Phase 2.
          </div>
          <Input
            label="14-digit ABHA number (Optional: XX-XXXX-XXXX-XXXX)"
            placeholder="e.g. 12-3456-7890-1234"
            value={abhaNumber}
            onChange={(e) => setAbhaNumber(e.target.value)}
            helperText="Optional. Hyphenated 14 digits format."
          />
          <Input
            label="ABHA address / virtual ID (Optional)"
            placeholder="e.g. ramesh.kulkarni@abdm"
            value={abhaAddress}
            onChange={(e) => setAbhaAddress(e.target.value)}
          />
          <label className="flex items-start gap-2.5 p-3 rounded-control bg-surface-subtle border border-border cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={abdmConsent}
              onChange={(e) => setAbdmConsent(e.target.checked)}
              className="mt-0.5 text-accent"
            />
            <span className="text-text">
              Separate ABDM consent: The senior consents to future ABDM health record federation (Phase 2).
            </span>
          </label>
        </div>
      ),
    },
    {
      id: 'step-reminders',
      title: 'Wellness & reminders',
      description: 'Optional daily medication reminder preferences.',
      content: (
        <div className="space-y-4">
          <label className="flex items-start gap-2.5 p-3 rounded-control bg-surface-subtle border border-border cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={wantsMedicationReminder}
              onChange={(e) => setWantsMedicationReminder(e.target.checked)}
              className="mt-0.5 text-accent"
            />
            <span className="text-text font-semibold">
              Enable daily 08:00 AM WhatsApp morning wellness reminder and blood pressure log prompt.
            </span>
          </label>
          {wantsMedicationReminder && (
            <div className="space-y-3 pt-2">
              <Input
                label="Prescription label"
                value={prescriptionLabel}
                onChange={(e) => setPrescriptionLabel(e.target.value)}
                helperText="Non-clinical label (no dosage instructions are collected or displayed)."
              />
              <Input
                label="Reminder scheduled time (IST)"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'step-review',
      title: 'Review & submit',
      description: 'Review complete senior registration details before card issuance.',
      content: (
        <div className="space-y-4">
          <div className="bg-surface-subtle rounded-control p-4 space-y-2 text-xs border border-border">
            <div className="flex justify-between border-b border-border-subtle pb-1.5">
              <span className="text-text-secondary">Full name:</span>
              <span className="font-semibold text-text">{fullName}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-1.5">
              <span className="text-text-secondary">Phone number:</span>
              <span className="tabular-nums font-semibold text-text">{formatIndianMobile(phone)}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-1.5">
              <span className="text-text-secondary">Chapter:</span>
              <span className="text-text font-semibold">{currentChapterObj.name}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-1.5">
              <span className="text-text-secondary">Primary next-of-kin:</span>
              <span className="text-text font-semibold">{nokName} ({nokRelation}) — {nokPhone}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-1.5">
              <span className="text-text-secondary">ABHA status:</span>
              <span className="text-text font-semibold">
                {abhaNumber ? `${maskAbhaNumber(abhaNumber)} (Provided, unverified - Phase 2)` : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Assisted by:</span>
              <span className="text-text font-semibold">{volunteerName}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Assisted senior citizen onboarding wizard"
        description="Mirror of the WhatsApp onboarding bot for volunteers assisting elders who cannot self-register."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Onboarding', to: '/onboarding' },
          { label: 'Assisted registration' },
        ]}
      />

      {duplicateWarning && (
        <div className="p-4 bg-critical-tint border border-critical/40 text-text rounded-container text-xs flex gap-3">
          <AlertTriangle className="w-5 h-5 text-critical shrink-0 stroke-[1.5]" />
          <div>
            <div className="font-semibold text-text">Possible duplicate record detected</div>
            <div className="text-text-secondary mt-0.5">{duplicateWarning}</div>
          </div>
        </div>
      )}

      <Wizard
        steps={steps}
        activeStepIndex={activeStep}
        onStepChange={(idx) => setActiveStep(idx)}
        onCancel={() => navigate('/onboarding')}
        onPrevious={() => setActiveStep((prev) => Math.max(0, prev - 1))}
        onNext={() => {
          if (activeStep === 1 && (!fullName.trim() || !phone.trim())) {
            alert('Please enter both Full Name and Phone Number.');
            return;
          }
          if (activeStep === 3 && (!nokName.trim() || !nokPhone.trim())) {
            alert('Please enter Next-of-Kin Name and Mobile.');
            return;
          }
          setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
        }}
        onSubmit={handleSubmit}
        submitLabel="Confirm & issue membership card"
      />
    </div>
  );
};
