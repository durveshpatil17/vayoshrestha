import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface WizardStep {
  id: string | number;
  title: string;
  description?: string;
  content: React.ReactNode;
  isOptional?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  activeStepIndex: number;
  onStepChange?: (index: number) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  activeStepIndex,
  onStepChange,
  onCancel,
  onSubmit,
  onNext,
  onPrevious,
  isLoading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  className = '',
}) => {
  const currentStep = steps[activeStepIndex] || steps[0];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit?.();
    } else if (onNext) {
      onNext();
    } else {
      onStepChange?.(activeStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstStep) return;
    if (onPrevious) {
      onPrevious();
    } else {
      onStepChange?.(activeStepIndex - 1);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Step Navigation (AWS Cloudscape Wizard Rail) */}
        <nav
          aria-label="Wizard steps"
          className="lg:col-span-3 bg-surface border border-border rounded-container p-4 select-none"
        >
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-normal mb-3 px-2">
            Steps
          </div>
          <ol className="space-y-1">
            {steps.map((s, idx) => {
              const isCompleted = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isPending = idx > activeStepIndex;

              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onStepChange?.(idx)}
                    className={`w-full text-left px-3 py-2 rounded-control flex items-center gap-3 text-xs transition-colors ${
                      isCurrent
                        ? 'bg-accent-tint text-accent font-semibold'
                        : isCompleted
                        ? 'text-positive hover:bg-surface-hover cursor-pointer'
                        : 'text-text-disabled cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] tabular-nums shrink-0 ${
                        isCurrent
                          ? 'border border-accent text-accent font-semibold'
                          : isCompleted
                          ? 'bg-positive text-white'
                          : 'border border-border text-text-disabled'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2]" /> : idx + 1}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Center Step Content */}
        <div className="lg:col-span-9 bg-surface border border-border rounded-container p-6 space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-lg font-semibold text-text">
              {currentStep.title}
            </h2>
            {currentStep.description && (
              <p className="text-xs text-text-secondary mt-1">
                {currentStep.description}
              </p>
            )}
          </div>

          <div className="min-h-[280px]">
            {currentStep.content}
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <footer className="sticky bottom-0 z-20 bg-surface border border-border rounded-container px-6 py-3.5 flex items-center justify-between gap-4 shadow-overlay">
        {onCancel ? (
          <Button variant="outline" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrevious}
            disabled={isFirstStep || isLoading}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLastStep ? submitLabel : 'Next'}
          </Button>
        </div>
      </footer>
    </div>
  );
};
