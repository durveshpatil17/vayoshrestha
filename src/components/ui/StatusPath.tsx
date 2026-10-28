import React from 'react';
import { Checkmark12Regular } from '@fluentui/react-icons';

export interface PathStep {
  id: string;
  label: string;
  guidance?: string;
}

export interface StatusPathProps {
  steps: PathStep[];
  currentStepId: string;
  onStepSelect?: (stepId: string) => void;
  className?: string;
}

export const StatusPath: React.FC<StatusPathProps> = ({
  steps,
  currentStepId,
  onStepSelect,
  className = '',
}) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  const currentStep = steps[currentIndex] || steps[0];

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Path Rail */}
      <div className="flex items-center w-full bg-surface-subtle border border-border rounded-control p-1 gap-1 overflow-x-auto">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect?.(step.id)}
              disabled={!onStepSelect}
              className={`flex-1 min-w-[120px] h-7 px-2.5 rounded-control flex items-center justify-center gap-1.5 text-xs font-medium transition-colors select-none ${
                isCompleted
                  ? 'bg-surface text-positive hover:bg-surface-hover'
                  : isCurrent
                  ? 'bg-accent-tint text-accent border border-accent/30'
                  : 'text-text-disabled hover:text-text-secondary'
              }`}
            >
              {isCompleted ? (
                <Checkmark12Regular className="text-positive shrink-0" />
              ) : (
                <span
                  className={`w-3.5 h-3.5 rounded-full text-[10px] flex items-center justify-center shrink-0 border ${
                    isCurrent
                      ? 'border-accent text-accent font-semibold'
                      : 'border-border-strong text-text-disabled'
                  }`}
                >
                  {idx + 1}
                </span>
              )}
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Guidance */}
      {currentStep?.guidance && (
        <div className="text-caption text-text-secondary bg-surface-subtle border border-border-subtle rounded-control px-3 py-2 flex items-center justify-between">
          <span>{currentStep.guidance}</span>
          <span className="text-xs text-accent font-medium">Active Step</span>
        </div>
      )}
    </div>
  );
};

