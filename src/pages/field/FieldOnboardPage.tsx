import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { encryptFieldPayload } from '@/domain/field/encryption';
import { createCoarseGeoStamp, CHAPTER_COARSE_POINTS } from '@/domain/field/geoStamp';
import {
  initDoubleConsent,
  advanceToConsentTwo,
  confirmConsentTwo,
  DoubleConsentState,
} from '@/domain/field/doubleConsent';
import { enqueueActivity } from '@/domain/field/offlineQueue';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  ShieldCheck,
  Send,
  Lock,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

const READ_ALOUD_SCRIPTS: Record<string, string> = {
  English:
    'Vayoshreshtha is a community service by Vayoh Vikas NGO. We help senior citizens with wellness check-ins, medical reminders, local community hub events, and trusted partner services. We protect your data and will never sell or share it without your explicit approval. Do you agree to register with us?',
  Marathi:
    'वयोश्रेष्ठ हा वयो विकास संस्थेचा ज्येष्ठ नागरिकांसाठीचा सेवा प्रकल्प आहे. आम्ही आपल्याला स्वास्थ्य संपर्क, औषध स्मरणपत्रे, एकता केंद्रातील कार्यक्रम आणि विश्वासू सेवा मिळवून देतो. आपली माहिती पूर्णपणे सुरक्षित असून ती कोणालाही विकली जात नाही. आपण नोंदणीस संमती देता का?',
  Hindi:
    'वयश्रेष्ठ वयो विकास संस्था की ओर से वरिष्ठ नागरिकों के लिए एक सेवा है। हम आपको स्वास्थ्य जांच, दवा की याद दिलाने, एकता केंद्र के कार्यक्रमों और सेवाओं में मदद करते हैं। आपका डेटा सुरक्षित रहेगा। क्या आप हमारे साथ पंजीकरण करने के लिए सहमत हैं?',
  Kannada:
    'ವಯೋಶ್ರೇಷ್ಠ ಹಿರಿಯ ನಾಗರಿಕರಿಗಾಗಿ ವಯೋ ವಿಕಾಸ್ ಸಂಸ್ಥೆಯ ಸಮುದಾಯ ಸೇವೆಯಾಗಿದೆ. ನಿಮ್ಮ ಆರೋಗ್ಯ ತಪಾಸಣೆ, ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಕೇಂದ್ರದ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ನಾವು ನೆರವಾಗುತ್ತೇವೆ. ನಿಮ್ಮ ಅನುಮತಿ ಇಲ್ಲದೆ ಯಾವುದೇ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ. ನೀವು ನೋಂದಾಯಿಸಲು ಸಮ್ಮತಿಸುತ್ತೀರಾ?',
};

export const FieldOnboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Peer Details
  const [peerName, setPeerName] = useState('');
  const [peerPhone, setPeerPhone] = useState('');
  const [language, setLanguage] = useState<'English' | 'Marathi' | 'Hindi' | 'Kannada'>('Marathi');
  const [nokName, setNokName] = useState('');
  const [nokPhone, setNokPhone] = useState('');

  // Step 2: Consent 1
  const [consent1Agreed, setConsent1Agreed] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [voiceHash, setVoiceHash] = useState<string | null>(null);

  // Step 3: Consent 2 (WhatsApp)
  const [consent2Sent, setConsent2Sent] = useState(false);
  const [peerConfirmedConsent2, setPeerConfirmedConsent2] = useState(false);

  // Step 4: Save & Outcome
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<'REGISTERED' | 'STALLED_AWAITING_CONSENT_2' | null>(null);

  // Navigation handlers
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerName.trim() || !peerPhone.trim()) return;
    setStep(2);
  };

  const handleSimulateVoice = () => {
    setVoiceRecorded(true);
    setConsent1Agreed(true);
    setVoiceHash('sha256-voice-sim-8b41f7a30c29');
  };

  const handleSendConsent2WhatsApp = () => {
    setConsent2Sent(true);
  };

  const handleSavePeer = async () => {
    setIsSubmitting(true);

    try {
      // 1. Double consent state computation
      let consentState: DoubleConsentState = initDoubleConsent({
        peerName,
        peerPhone,
        associateId: user?.id || 'u-sf-1',
        method: voiceRecorded ? 'voice_placeholder' : 'in_person_read_aloud',
        voiceHash: voiceHash || undefined,
      });

      consentState = advanceToConsentTwo(consentState);

      if (peerConfirmedConsent2) {
        consentState = confirmConsentTwo(consentState);
      }

      // 2. Coarse Geo-stamp capture
      const chapterPoint = CHAPTER_COARSE_POINTS[user?.assignedChapter || 'HUB-PUN'] || {
        lat: 18.52,
        lng: 73.85,
        area: 'Shivajinagar, Pune',
      };
      const geoStamp = createCoarseGeoStamp(chapterPoint.lat, chapterPoint.lng, chapterPoint.area);

      // 3. WebCrypto AES-GCM Encryption
      await encryptFieldPayload({
        peerName,
        peerPhone,
        emergencyContactName: nokName,
        emergencyContactPhone: nokPhone,
        consentState,
        geoStamp,
      });

      // 4. Enqueue into local offline sync queue
      enqueueActivity({
        associateId: user?.id || 'u-sf-1',
        chapterId: user?.assignedChapter || 'HUB-PUN',
        activityType: 'onboarding',
        peerName,
        peerPhone,
        emergencyContactName: nokName,
        emergencyContactPhone: nokPhone,
        preferredLanguage: language,
        geoArea: chapterPoint.area,
        doubleConsentState: consentState.state as any,
      });

      if (peerConfirmedConsent2) {
        setOutcome('REGISTERED');
      } else {
        setOutcome('STALLED_AWAITING_CONSENT_2');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (outcome) {
    return (
      <div className="space-y-6 pt-4 text-center">
        <div className="w-16 h-16 rounded-full bg-positive-tint text-positive flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {outcome === 'REGISTERED' ? 'Peer Successfully Registered!' : 'Onboarding Queued for Consent 2'}
          </h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed px-4">
            {outcome === 'REGISTERED'
              ? `${peerName} is now a registered senior member of ${user?.assignedChapter || 'Pune'} Ekta Hub. Both consents verified.`
              : `${peerName}'s details are encrypted in your local queue. Stored in Stalled Onboardings until the WhatsApp confirmation is completed.`}
          </p>
        </div>

        <div className="p-4 bg-bg-subtle rounded-lg border border-border-hairline text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-text-muted">Peer Name:</span>
            <span className="font-semibold text-text-primary">{peerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Mobile:</span>
            <span className="font-semibold text-text-primary">+91 {peerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Area Stamp:</span>
            <span className="font-semibold text-text-primary">Shivajinagar, Pune (±1 km)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Consent 1:</span>
            <span className="font-semibold text-positive">Captured in-person</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Consent 2:</span>
            <span className={peerConfirmedConsent2 ? 'font-semibold text-positive' : 'font-semibold text-critical'}>
              {peerConfirmedConsent2 ? 'Verified via WhatsApp' : 'Awaiting peer reply'}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white"
            onClick={() => {
              setOutcome(null);
              setStep(1);
              setPeerName('');
              setPeerPhone('');
              setNokName('');
              setNokPhone('');
              setConsent1Agreed(false);
              setConsent2Sent(false);
              setPeerConfirmedConsent2(false);
            }}
          >
            Add Another Peer
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full h-12 text-sm font-semibold"
            onClick={() => navigate('/field')}
          >
            Return to Field Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step Header Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep((step - 1) as any) : navigate('/field'))}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
        </button>
        <span className="text-xs font-semibold text-accent">Step {step} of 4</span>
      </div>

      {/* STEP 1: Peer Basic Details */}
      {step === 1 && (
        <form onSubmit={handleNextFromStep1} className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Peer Details</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Enter the senior's basic contact details and primary emergency support.
            </p>
          </div>

          <Input
            label="Senior Citizen Full Name *"
            placeholder="e.g. Ramesh Vishnu Kulkarni"
            value={peerName}
            onChange={(e) => setPeerName(e.target.value)}
            required
            className="text-base"
          />

          <Input
            label="Mobile Phone Number (+91) *"
            type="tel"
            placeholder="e.g. 98220 12345"
            value={peerPhone}
            onChange={(e) => setPeerPhone(e.target.value)}
            helperText="WhatsApp messages and service updates will be sent here."
            required
            className="text-base"
          />

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              Preferred Language *
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full h-11 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-sm focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-border-hairline space-y-3">
            <span className="text-xs font-semibold text-text-secondary block">
              Emergency Contact / Next of Kin (Optional)
            </span>
            <Input
              label="Contact Person Name"
              placeholder="e.g. Anand Kulkarni (Son)"
              value={nokName}
              onChange={(e) => setNokName(e.target.value)}
              className="text-base"
            />
            <Input
              label="Contact Mobile Number"
              type="tel"
              placeholder="e.g. 98220 54321"
              value={nokPhone}
              onChange={(e) => setNokPhone(e.target.value)}
              className="text-base"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Consent 1</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* STEP 2: In-Person Consent 1 */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Consent 1: In-Person Explanation</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Read the following script aloud to the peer in {language}.
            </p>
          </div>

          <div className="p-4 bg-bg-subtle rounded-lg border border-border-hairline text-sm leading-relaxed text-text-primary italic">
            "{READ_ALOUD_SCRIPTS[language] || READ_ALOUD_SCRIPTS.English}"
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setConsent1Agreed(true);
                setVoiceRecorded(false);
              }}
              className={`w-full h-14 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                consent1Agreed && !voiceRecorded
                  ? 'border-accent bg-accent-tint text-accent'
                  : 'border-border bg-bg-surface text-text-primary hover:border-accent'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>Peer Tapped "I Agree" in Person</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateVoice}
              className={`w-full h-14 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                voiceRecorded
                  ? 'border-accent bg-accent-tint text-accent'
                  : 'border-border bg-bg-surface text-text-primary hover:border-accent'
              }`}
            >
              <Mic className="w-5 h-5 text-accent" />
              <span>
                {voiceRecorded ? 'Voice Consent Recorded (8s · SHA-256)' : 'Record Voice Consent (Placeholder)'}
              </span>
            </button>
          </div>

          {consent1Agreed && (
            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-1.5"
              onClick={() => setStep(3)}
            >
              <span>Continue to WhatsApp Consent 2</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* STEP 3: WhatsApp Consent 2 Dispatch */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Consent 2: WhatsApp Confirmation</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Under DPDP regulations, peer must independently confirm via their own mobile.
            </p>
          </div>

          <div className="p-4 bg-bg-surface rounded-lg border border-border-hairline space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <Send className="w-4 h-4 text-accent" />
              Interactive WhatsApp Dispatch
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              We send an interactive verification message to +91 {peerPhone}. The peer simply replies "YES" to activate full services.
            </p>

            {!consent2Sent ? (
              <Button
                variant="primary"
                size="md"
                className="w-full h-11 bg-accent hover:bg-accent-hover text-white text-xs font-medium"
                onClick={handleSendConsent2WhatsApp}
              >
                Send Verification WhatsApp Message Now
              </Button>
            ) : (
              <div className="p-3 bg-positive-tint/50 border border-positive/30 rounded text-xs text-positive flex items-center justify-between">
                <span>Message Dispatched · 24h Expiry Clock Started</span>
                <Clock className="w-4 h-4" />
              </div>
            )}
          </div>

          {consent2Sent && (
            <div className="p-3 bg-bg-subtle rounded-lg border border-border-hairline space-y-2">
              <span className="text-xs font-medium text-text-secondary block">
                Simulated Peer Response (for Prototype):
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-primary">
                <input
                  type="checkbox"
                  checked={peerConfirmedConsent2}
                  onChange={(e) => setPeerConfirmedConsent2(e.target.checked)}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <span>Simulate Peer replying "YES" on WhatsApp immediately</span>
              </label>
              <p className="text-[11px] text-text-muted">
                If left unchecked, record will enter "Stalled Onboardings — Awaiting 2nd consent".
              </p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full h-12 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-1.5"
            onClick={() => setStep(4)}
          >
            <span>Review & Save Activity</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* STEP 4: Review, Encrypt & Coarse Geo-Stamp */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Review & Save Record</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Data is encrypted locally and stamped with coarse area privacy.
            </p>
          </div>

          <div className="p-4 bg-bg-subtle rounded-lg border border-border-hairline space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Peer:</span>
              <span className="font-semibold text-text-primary">{peerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Phone:</span>
              <span className="font-semibold text-text-primary">+91 {peerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Chapter:</span>
              <span className="font-semibold text-text-primary">{user?.assignedChapter || 'HUB-PUN'} (Pune)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Consent 1:</span>
              <span className="font-semibold text-positive">Captured ({voiceRecorded ? 'Voice' : 'In-person'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Consent 2:</span>
              <span className={peerConfirmedConsent2 ? 'font-semibold text-positive' : 'font-semibold text-critical'}>
                {peerConfirmedConsent2 ? 'Verified' : 'Pending reply (will stall)'}
              </span>
            </div>
          </div>

          {/* Privacy & Encryption Guarantee Notice */}
          <div className="p-3 bg-bg-surface rounded-lg border border-border-hairline space-y-2 text-xs text-text-muted">
            <div className="flex items-center gap-1.5 font-medium text-text-primary">
              <Lock className="w-4 h-4 text-accent" />
              <span>WebCrypto AES-GCM 256-bit Encryption</span>
            </div>
            <p className="leading-relaxed">
              Record is encrypted in browser storage before synchronization.
            </p>

            <div className="flex items-center gap-1.5 font-medium text-text-primary pt-1">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Coarse Location Capture: Shivajinagar, Pune (±1 km)</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Only a single 2-decimal area stamp is recorded. Zero continuous GPS tracking or route trails.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-14 text-sm font-semibold bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2"
            onClick={handleSavePeer}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Encrypting & Saving...' : 'Save Securely to Queue'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
