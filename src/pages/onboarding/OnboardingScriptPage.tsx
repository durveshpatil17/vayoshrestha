import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { OnboardingScriptStep } from '@/api/contracts';
import { Check, Edit3, Send, Smartphone, CheckCheck } from 'lucide-react';

export const OnboardingScriptPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const script = data.onboardingScript;

  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [editingStep, setEditingStep] = useState<OnboardingScriptStep | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const activeStep = script.steps[activeStepIndex];

  const handleSaveStep = () => {
    if (!editingStep) return;
    mockStore.updateData((draft) => {
      const idx = draft.onboardingScript.steps.findIndex((s) => s.stepNumber === editingStep.stepNumber);
      if (idx !== -1) {
        draft.onboardingScript.steps[idx] = editingStep;
        draft.onboardingScript.status = 'PendingApproval';
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Regional Admin',
      user?.role || 'RA',
      'UPDATE',
      'ONBOARDING_SCRIPT',
      script.id,
      `Updated Onboarding Bot Script Step ${editingStep.stepNumber}. Status set to PendingApproval.`
    );

    setSavedNotice(`Step ${editingStep.stepNumber} submitted for NGO Management approval.`);
    setEditingStep(null);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="WhatsApp onboarding bot script editor"
        description="Configure sequential prompt copy, validation rules, and multilingual translations for senior self-onboarding."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Onboarding', to: '/onboarding' },
          { label: 'Bot script' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-chip bg-accent-tint text-accent">
              Version: {script.version} ({script.status})
            </span>
          </div>
        }
      />

      {savedNotice && (
        <div className="p-3 bg-positive-tint border border-positive/30 text-positive rounded-control text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[1.5]" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Language Selector Strip */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-container p-4">
        <div className="text-xs font-semibold text-text">Preview script language:</div>
        <div className="flex gap-2">
          {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-colors ${
                selectedLanguage === lang
                  ? 'bg-accent text-white'
                  : 'bg-surface-subtle text-text-secondary hover:text-text border border-border'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Step Sequencer & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border rounded-container p-4 space-y-3">
            <div className="text-xs font-semibold text-text-secondary">
              Onboarding script sequence ({script.steps.length} steps)
            </div>

            <div className="space-y-2">
              {script.steps.map((st, idx) => (
                <div
                  key={st.stepNumber}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setEditingStep(null);
                  }}
                  className={`p-3 rounded-control border cursor-pointer transition-colors ${
                    activeStepIndex === idx
                      ? 'bg-accent-tint/40 border-accent text-accent'
                      : 'bg-surface hover:bg-surface-hover border-border text-text'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent-tint text-accent flex items-center justify-center font-semibold text-xs">
                        {st.stepNumber}
                      </span>
                      <strong className="font-semibold text-text">{(st as any).name || st.key}</strong>
                    </div>
                    <span className="text-xs text-text-secondary tabular-nums">
                      Field: {(st as any).mappedSeniorField || st.key}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-1">
                    "{st.promptText[selectedLanguage] || st.promptText.English}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Detail / Edit Box */}
          {activeStep && (
            <div className="bg-surface border border-border rounded-container p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-text">
                    Step {activeStep.stepNumber}: {(activeStep as any).name || activeStep.key}
                  </h3>
                  <div className="text-xs text-text-secondary mt-0.5">
                    Target database field: <code className="font-semibold text-text">{(activeStep as any).mappedSeniorField || activeStep.key}</code>
                  </div>
                </div>

                {!editingStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />}
                    onClick={() => setEditingStep({ ...activeStep })}
                  >
                    Edit prompt
                  </Button>
                )}
              </div>

              {editingStep ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">
                      Prompt text ({selectedLanguage})
                    </label>
                    <textarea
                      rows={4}
                      value={editingStep.promptText[selectedLanguage] || ''}
                      onChange={(e) =>
                        setEditingStep({
                          ...editingStep,
                          promptText: {
                            ...editingStep.promptText,
                            [selectedLanguage]: e.target.value,
                          },
                        })
                      }
                      className="w-full text-xs p-2.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStep(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveStep}
                    >
                      Save & submit for review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-text-secondary block">Active prompt ({selectedLanguage}):</span>
                    <div className="mt-1 p-3 bg-surface-subtle border border-border rounded-control leading-relaxed">
                      {activeStep.promptText[selectedLanguage] || activeStep.promptText.English}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <span className="text-text-secondary block">Validation type:</span>
                      <span className="font-semibold text-text">{(activeStep as any).validationType || activeStep.validationRegex || 'Regex Pattern'}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Allow skip:</span>
                      <span className="font-semibold text-text">
                        {(activeStep as any).allowSkip !== undefined
                          ? ((activeStep as any).allowSkip ? 'Yes (Optional)' : 'No (Required)')
                          : !activeStep.required ? 'Yes (Optional)' : 'No (Required)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Phone Frame Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="w-full max-w-sm mx-auto bg-surface border border-border rounded-container p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5 font-semibold text-text">
                <Smartphone className="w-4 h-4 text-accent stroke-[1.5]" />
                WhatsApp preview
              </span>
              <span className="tabular-nums">Preview</span>
            </div>

            {/* Chat Header */}
            <div className="p-3 bg-surface-subtle border border-border rounded-control flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold">
                V
              </div>
              <div>
                <div className="font-semibold text-xs text-text">Vayoh Vikas eldercare</div>
                <div className="text-xs text-accent font-semibold">Active WhatsApp bot</div>
              </div>
            </div>

            {/* Simulated Chat Feed */}
            <div className="p-4 bg-page space-y-3 h-96 overflow-y-auto rounded-control border border-border">
              <div className="text-xs text-center text-text-secondary">Today</div>

              {script.steps.slice(0, activeStepIndex + 1).map((st) => (
                <div key={st.stepNumber} className="space-y-2">
                  {/* Bot Message Bubble */}
                  <div className="w-10/12 bg-surface p-3 rounded-control border border-border text-xs text-text">
                    <p>{st.promptText[selectedLanguage] || st.promptText.English}</p>
                    <span className="text-xs text-text-secondary block text-right mt-1 tabular-nums">09:42</span>
                  </div>

                  {/* Simulated Senior Reply */}
                  {st.stepNumber <= activeStepIndex && (
                    <div className="w-9/12 ml-auto bg-accent-tint p-2.5 rounded-control text-xs text-accent text-right border border-accent/20">
                      <p>
                        {st.stepNumber === 1
                          ? 'YES, I consent'
                          : st.stepNumber === 2
                          ? 'Ramesh Kulkarni'
                          : st.stepNumber === 3
                          ? selectedLanguage
                          : st.stepNumber === 4
                          ? 'Sunil (Son) 9822011223'
                          : 'SKIP'}
                      </p>
                      <span className="text-xs text-accent inline-flex items-center gap-1 mt-0.5 tabular-nums">
                        <CheckCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                        09:43
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-text-secondary">
              Live phone preview · {selectedLanguage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
