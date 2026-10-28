import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  MessageSquare,
  ArrowLeft,
  Save,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  Check,
  CheckCheck,
} from 'lucide-react';

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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/health/reminders')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Templates
        </Button>
      </div>

      <PageHeader
        title={`Edit Template: ${id || '08:00 Morning Wellness & Vitals Prompt'}`}
        description="Configure variable placeholders, WhatsApp utility character limits, and interactive button replies."
      />

      {feedback && (
        <div className="p-3 bg-success-surface border border-success/30 rounded text-xs text-success flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Variable Chips (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Language Tabs */}
          <div className="flex border-b border-border-hairline text-xs font-medium">
            {(['ENGLISH', 'HINDI', 'KANNADA', 'MARATHI', 'TAMIL'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-2 border-b-2 transition-colors ${
                  activeLang === lang
                    ? 'border-accent text-accent font-bold bg-accent-tint/30'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Variable Chips */}
          <div className="bg-white border border-border-hairline rounded p-4 space-y-2">
            <span className="text-xs font-semibold text-text-muted">Insert Dynamic Variable:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleInsertVariable('{name}')}
                className="px-2.5 py-1 bg-surface-subtle border border-border-hairline hover:border-accent rounded text-xs font-mono text-accent"
              >
                + {'{name}'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertVariable('{chapter}')}
                className="px-2.5 py-1 bg-surface-subtle border border-border-hairline hover:border-accent rounded text-xs font-mono text-accent"
              >
                + {'{chapter}'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertVariable('{time}')}
                className="px-2.5 py-1 bg-surface-subtle border border-border-hairline hover:border-accent rounded text-xs font-mono text-accent"
              >
                + {'{time}'}
              </button>
            </div>
          </div>

          {/* Text Area */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="bg-white border border-border-hairline rounded p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-primary">
                  WhatsApp Message Body ({activeLang}):
                </label>
                <span className="font-mono text-text-muted">
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
                className="w-full text-xs p-3 border border-border-hairline rounded focus:outline-none focus:border-accent font-sans leading-relaxed"
                required
              />
            </div>

            {/* Configured Quick Reply Buttons */}
            <div className="bg-white border border-border-hairline rounded p-4 space-y-2">
              <span className="text-xs font-semibold text-text-primary block">
                Quick-Reply Interactive Buttons (Fixed by Pilot Schema):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 border border-border-hairline rounded bg-surface-subtle text-center text-xs font-medium text-text-primary">
                  1. Taken
                </div>
                <div className="p-2 border border-border-hairline rounded bg-surface-subtle text-center text-xs font-medium text-text-primary">
                  2. Not yet
                </div>
                <div className="p-2 border border-border-hairline rounded bg-surface-subtle text-center text-xs font-medium text-text-primary">
                  3. Skip
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex justify-end gap-2">
                <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5 bg-accent">
                  <Save className="w-3.5 h-3.5" />
                  Save Draft Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: WhatsApp Phone Simulator Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              Live WhatsApp Senior Preview
            </div>

            {/* Unbranded WhatsApp Chat Frame */}
            <div className="bg-[#ECE5DD] border border-[#DDD4C9] rounded-2xl p-4 shadow-sm max-w-sm mx-auto space-y-3 font-sans">
              {/* Header inside phone */}
              <div className="bg-[#075E54] text-white p-2.5 rounded-t-lg -mx-4 -mt-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  VV
                </div>
                <div>
                  <div className="font-bold text-xs leading-none">Vayoh Vikas Senior Support</div>
                  <div className="text-[10px] text-white/80 mt-0.5">Verified Official Channel</div>
                </div>
              </div>

              {/* Chat Date Divider */}
              <div className="text-center">
                <span className="bg-white/80 text-[#555] text-[10px] px-2 py-0.5 rounded shadow-xs">
                  Today
                </span>
              </div>

              {/* Inbound WhatsApp Message Bubble */}
              <div className="bg-white rounded-lg p-3 text-xs text-[#111] space-y-2 shadow-xs border border-black/5 max-w-[90%]">
                <p className="leading-relaxed">{previewText}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 font-mono">
                  <span>08:00 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                </div>
              </div>

              {/* Quick Reply Buttons Below Bubble */}
              <div className="space-y-1.5 max-w-[90%]">
                <button
                  type="button"
                  className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-[#00A884] text-xs font-semibold rounded shadow-xs text-center"
                >
                  💊 Taken
                </button>
                <button
                  type="button"
                  className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-[#00A884] text-xs font-semibold rounded shadow-xs text-center"
                >
                  ⏳ Not yet
                </button>
                <button
                  type="button"
                  className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-[#00A884] text-xs font-semibold rounded shadow-xs text-center"
                >
                  ⏭️ Skip
                </button>
              </div>

              {/* Vital Input Simulation Prompt Bubble */}
              <div className="bg-white rounded-lg p-2.5 text-xs text-[#111] space-y-1 shadow-xs border border-black/5 max-w-[90%] mt-2">
                <p className="text-[11px] text-gray-600">
                  Optional: Reply with your reading (e.g. <code>130/85</code> or <code>112</code>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
