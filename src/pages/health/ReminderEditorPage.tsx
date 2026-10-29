import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Save,
  Smartphone,
  CheckCheck,
  Pill,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/ui/Container';
import { MessageStrip } from '@/ui/MessageStrip';

export const ReminderEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isNM = user?.role === 'NM';
  const isRA = user?.role === 'RA';
  const canEdit = isNM || isRA;

  const [activeLang, setActiveLang] = useState<'ENGLISH' | 'HINDI' | 'KANNADA' | 'MARATHI' | 'TAMIL'>('ENGLISH');

  const [templateCopy, setTemplateCopy] = useState<Record<string, string>>({
    ENGLISH:
      'Good morning {name}, time for your morning wellness prescription from Vayoh Vikas {chapter}. Please confirm below, and feel free to log your blood pressure or glucose reading.',
    HINDI:
      'शुभ प्रभात {name}, वयो विकास {chapter} की ओर से आपकी सुबह की दवा का समय हो गया है। कृपया नीचे पुष्टि करें, और अपना बीपी या शुगर का पाठ्यांक दर्ज करें।',
    KANNADA:
      'ಶುಭೋದಯ {name}, ವಯೋ ವಿಕಾಸ್ {chapter} ವತಿಯಿಂದ ನಿಮ್ಮ ಬೆಳಗಿನ ಔಷಧಿ ಸಮಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ದೃಢೀಕರಿಸಿ.',
    MARATHI:
      'शुभ सकाळ {name}, वयो विकास {chapter} कडून आपल्या सकाळच्या औषधाची वेळ झाली आहे. कृपया खाली पुष्टी करा.',
    TAMIL:
      'காலை வணக்கம் {name}, வயோ விகாஸ் {chapter} அமைப்பிலிருந்து உங்கள் காலை மருந்துக்கான நேரம். தயவுசெய்து கீழே உறுதிப்படுத்தவும்.',
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const currentText = templateCopy[activeLang] || '';

  const handleInsertVariable = (variable: string) => {
    setTemplateCopy({
      ...templateCopy,
      [activeLang]: currentText + ' ' + variable,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'RA',
      chapterId: user?.chapterId || 'ORGANISATION',
      action: 'TEMPLATE_UPDATE',
      entityType: 'TEMPLATE',
      entityId: id || 'TPL-MORNING',
      details: `Updated WhatsApp utility reminder template copy for ${activeLang}.`,
    });

    mockStore.persist();
    setFeedback('Template draft saved and logged to audit trail.');
  };

  // Preview replacement
  const previewText = currentText
    .replace('{name}', 'Mr. Ramesh Rao')
    .replace('{chapter}', 'Bengaluru Hub')
    .replace('{time}', '08:00 AM');

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Prominent non-clinical notice banner */}
      <MessageStrip type="informative">
        Vayoshreshtha is a non-clinical community support platform. Biomarker readings and reminder acknowledgements are self-reported and do not constitute clinical diagnosis.
      </MessageStrip>

      {/* Nav & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/reminders')}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text">Edit Template: {id || '08:00 Morning Wellness & Vitals Prompt'}</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure variable placeholders, WhatsApp utility character limits, and interactive button replies.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <MessageStrip type="positive" onClose={() => setFeedback(null)}>
          {feedback}
        </MessageStrip>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Variable Chips (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Language Tabs */}
          <div className="flex border-b border-border text-xs">
            {(['ENGLISH', 'HINDI', 'KANNADA', 'MARATHI', 'TAMIL'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-2 border-b-2 transition-colors font-semibold ${
                  activeLang === lang
                    ? 'border-accent text-accent bg-informative-tint'
                    : 'border-transparent text-text-secondary hover:text-text'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Variable Chips */}
          <Container className="p-4 space-y-2">
            <span className="text-xs font-semibold text-text-secondary">Insert Dynamic Variable:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleInsertVariable('{name}')}
                className="px-2.5 py-1 bg-page border border-border hover:border-accent rounded-control text-xs tabular-nums text-accent font-normal"
              >
                + {'{name}'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertVariable('{chapter}')}
                className="px-2.5 py-1 bg-page border border-border hover:border-accent rounded-control text-xs tabular-nums text-accent font-normal"
              >
                + {'{chapter}'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertVariable('{time}')}
                className="px-2.5 py-1 bg-page border border-border hover:border-accent rounded-control text-xs tabular-nums text-accent font-normal"
              >
                + {'{time}'}
              </button>
            </div>
          </Container>

          {/* Text Area */}
          <form onSubmit={handleSave} className="space-y-4">
            <Container className="p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text">
                  WhatsApp Message Body ({activeLang}):
                </label>
                <span className="tabular-nums text-text-secondary">
                  {currentText.length} / 1024 chars
                </span>
              </div>
              <textarea
                rows={5}
                value={currentText}
                onChange={(e) =>
                  setTemplateCopy({
                    ...templateCopy,
                    [activeLang]: e.target.value,
                  })
                }
                disabled={!canEdit}
                className="w-full text-xs p-3 border border-border rounded-control bg-surface text-text focus:outline-none focus:border-accent leading-relaxed"
                required
              />
            </Container>

            {/* Configured Quick Reply Buttons */}
            <Container className="p-4 space-y-2">
              <span className="text-xs font-semibold text-text block">
                Quick-Reply Interactive Buttons (Fixed by Pilot Schema):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 border border-border rounded-control bg-page text-center text-xs font-semibold text-text">
                  1. Taken
                </div>
                <div className="p-2 border border-border rounded-control bg-page text-center text-xs font-semibold text-text">
                  2. Not yet
                </div>
                <div className="p-2 border border-border rounded-control bg-page text-center text-xs font-semibold text-text">
                  3. Skip
                </div>
              </div>
            </Container>

            {canEdit && (
              <div className="flex justify-end gap-2">
                <Button type="submit" variant="primary" size="sm" className="gap-1.5 bg-accent">
                  <Save className="w-4 h-4" />
                  Save Draft Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: WhatsApp Phone Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-accent" />
              Live WhatsApp Senior Preview
            </div>

            {/* Clean Phone Preview Card using tokens */}
            <div className="bg-page border border-border rounded-container p-4 max-w-sm mx-auto space-y-3">
              {/* Header inside phone */}
              <div className="bg-accent text-white p-3 rounded-container flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-semibold text-xs">
                  VV
                </div>
                <div>
                  <div className="font-semibold text-xs leading-none">Vayoh Vikas Senior Support</div>
                  <div className="text-xs text-white/80 mt-0.5">Verified Official Channel</div>
                </div>
              </div>

              {/* Chat Date Divider */}
              <div className="text-center">
                <span className="bg-surface text-text-secondary text-xs px-2.5 py-0.5 rounded-control border border-border">
                  Today
                </span>
              </div>

              {/* Inbound WhatsApp Message Bubble */}
              <div className="bg-surface rounded-container p-3 text-xs text-text space-y-2 border border-border w-11/12">
                <p className="leading-relaxed">{previewText}</p>
                <div className="flex items-center justify-end gap-1 text-xs text-text-secondary tabular-nums">
                  <span>08:00 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-accent" />
                </div>
              </div>

              {/* Quick Reply Buttons Below Bubble */}
              <div className="space-y-1.5 w-11/12">
                <button
                  type="button"
                  className="w-full py-2 px-3 bg-surface hover:bg-page border border-border text-accent text-xs font-semibold rounded-control text-center flex items-center justify-center gap-1.5"
                >
                  <Pill className="w-3.5 h-3.5" />
                  Taken
                </button>
                <button
                  type="button"
                  className="w-full py-2 px-3 bg-surface hover:bg-page border border-border text-accent text-xs font-semibold rounded-control text-center flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Not yet
                </button>
                <button
                  type="button"
                  className="w-full py-2 px-3 bg-surface hover:bg-page border border-border text-accent text-xs font-semibold rounded-control text-center flex items-center justify-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  Skip
                </button>
              </div>

              {/* Vital Input Simulation Prompt Bubble */}
              <div className="bg-surface rounded-container p-2.5 text-xs text-text space-y-1 border border-border w-11/12 mt-2">
                <p className="text-xs text-text-secondary">
                  Optional: Reply with your reading (e.g. 130/85 or 112).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
