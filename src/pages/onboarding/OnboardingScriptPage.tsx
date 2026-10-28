import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { OnboardingScriptStep } from '@/api/contracts';
import { Check, Edit3, Send, Smartphone } from 'lucide-react';

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
        draft.onboardingScript.status = 'PendingApproval'; // Requires NM approval per maker-checker!
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
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Onboarding Bot Script Editor"
        description="Configure sequential prompt copy, validation rules, and multilingual translations for senior self-onboarding."
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Onboarding', to: '/onboarding' },
          { label: 'Bot Script' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded bg-accent-tint text-accent">
              Version: {script.version} ({script.status})
            </span>
          </div>
        }
      />

      {savedNotice && (
        <div className="p-3 bg-success-bg border border-success/30 text-success rounded text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Language Selector Strip */}
      <div className="flex items-center justify-between bg-white border border-border-hairline rounded p-4">
        <div className="text-xs font-semibold text-text-primary">Preview Script Language:</div>
        <div className="flex gap-2">
          {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                selectedLanguage === lang
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-bg-subtle text-text-muted hover:text-text-primary border border-border-hairline'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout: Script Steps on Left, Live Phone Frame on Right */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Step Sequencer & Editor (7 cols) */}
        <div className="col-span-7 space-y-4">
          <div className="bg-white border border-border-hairline rounded p-4">
            <div className="text-xs font-semibold text-text-muted mb-3">
              Onboarding Script Sequence ({script.steps.length} Steps)
            </div>

            <div className="space-y-2">
              {script.steps.map((st, i) => (
                <div
                  key={st.stepNumber}
                  onClick={() => setActiveStepIndex(i)}
                  className={`p-3 rounded border text-xs cursor-pointer transition-colors ${
                    activeStepIndex === i
                      ? 'border-accent bg-accent-tint/20'
                      : 'border-border-hairline hover:bg-bg-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      Step {st.stepNumber}: {st.key}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {st.required ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-text-muted mt-1 truncate">
                    {st.promptText[selectedLanguage] || st.promptText.English}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Step Editor */}
          {activeStep && (
            <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                <h3 className="font-semibold text-sm text-text-primary">
                  Editing Step {activeStep.stepNumber} ({selectedLanguage})
                </h3>
                <span className="text-xs text-text-muted">Key: {activeStep.key}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Prompt Copy ({selectedLanguage})
                </label>
                <textarea
                  rows={4}
                  value={
                    editingStep?.stepNumber === activeStep.stepNumber
                      ? editingStep.promptText[selectedLanguage] || ''
                      : activeStep.promptText[selectedLanguage] || ''
                  }
                  onChange={(e) => {
                    const current = editingStep || { ...activeStep, promptText: { ...activeStep.promptText } };
                    setEditingStep({
                      ...current,
                      promptText: {
                        ...current.promptText,
                        [selectedLanguage]: e.target.value,
                      },
                    });
                  }}
                  className="w-full text-xs p-3 bg-bg-subtle border border-border-hairline rounded focus:bg-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingStep(null)}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveStep}
                  disabled={!editingStep}
                >
                  Submit Step for Approval
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Interactive Phone Simulator Preview (5 cols) */}
        <div className="col-span-5">
          <div className="bg-bg-subtle border border-border-hairline rounded-2xl p-4 max-w-sm mx-auto">
            {/* Phone Bezel Top */}
            <div className="flex justify-between items-center px-4 py-1 text-[10px] tabular-nums text-text-muted border-b border-border-hairline pb-2">
              <span>9:41 AM</span>
              <div className="w-16 h-3 bg-border-hairline rounded-full" />
              <span>5G 100%</span>
            </div>

            {/* Chat Header */}
            <div className="p-3 bg-white border-b border-border-hairline flex items-center gap-3 mt-2 rounded-t-lg">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold">
                V
              </div>
              <div>
                <div className="font-semibold text-xs text-text-primary">Vayoh Vikas Eldercare</div>
                <div className="text-[10px] text-accent">Active WhatsApp Bot</div>
              </div>
            </div>

            {/* Simulated Chat Feed */}
            <div className="p-4 bg-surface-subtle space-y-3 min-h-[360px] max-h-[420px] overflow-y-auto rounded-b-lg">
              <div className="text-[10px] text-center text-text-muted">Today</div>

              {script.steps.slice(0, activeStepIndex + 1).map((st) => (
                <div key={st.stepNumber} className="space-y-2">
                  {/* Bot Message Bubble */}
                  <div className="max-w-[85%] bg-white p-3 rounded-lg border border-border text-xs text-text">
                    <p>{st.promptText[selectedLanguage] || st.promptText.English}</p>
                    <span className="text-[9px] text-text-muted block text-right mt-1">9:42 AM</span>
                  </div>

                  {/* Simulated Senior Reply (Placeholder preview) */}
                  {st.stepNumber <= activeStepIndex && (
                    <div className="max-w-[80%] ml-auto bg-surface-selected p-2.5 rounded-lg text-xs text-text text-right">
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
                      <span className="text-[9px] text-accent block mt-0.5">✓✓ 9:43 AM</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 text-center text-[11px] text-text-muted">
              Live Phone Frame Preview · {selectedLanguage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
