import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export interface ProcessStep {
  id: string;
  name: string;
  role: string;
  sla?: string;
  status: 'Completed' | 'Current' | 'Pending' | 'Blocked';
  description?: string;
}

export interface ProcessFlowProps {
  processName?: string;
  processId?: string;
  steps: ProcessStep[];
  currentStepId?: string;
  onStepClick?: (step: ProcessStep) => void;
  className?: string;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  processName,
  processId,
  steps,
  currentStepId,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`w-full bg-surface border border-border rounded-container p-4 ${className}`}>
      {processName && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold text-text-secondary">
              {processId ? `Process ${processId}` : 'Process Flow'}
            </span>
            <span className="text-body font-semibold text-text">{processName}</span>
          </div>
          <span className="text-caption text-text-muted">
            {steps.filter((s) => s.status === 'Completed').length} of {steps.length} completed
          </span>
        </div>
      )}

      {/* Stepped Progress Bar */}
      <div className="relative flex items-center justify-between gap-2 overflow-x-auto py-1">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'Completed';
          const isCurrent = step.status === 'Current' || step.id === currentStepId;
          const isBlocked = step.status === 'Blocked';

          return (
            <div
              key={step.id}
              className="flex-1 min-w-36 flex flex-col items-center text-center relative group"
              data-stage={step.id}
              data-testid={`stage-${step.id}`}
            >
              {/* Connector line behind */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 ${
                    isCompleted ? 'bg-positive' : 'bg-border'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator node */}
              <button
                type="button"
                onClick={() => onStepClick?.(step)}
                disabled={!onStepClick}
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-caption font-semibold transition-all ${
                  isCompleted
                    ? 'bg-positive text-surface'
                    : isCurrent
                    ? 'bg-accent text-surface ring-4 ring-accent-tint'
                    : isBlocked
                    ? 'bg-negative text-surface'
                    : 'bg-surface-subtle border border-border text-text-muted hover:border-text-secondary'
                }`}
                title={`${step.name} (${step.status})`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2]" />
                ) : isBlocked ? (
                  <AlertCircle className="w-4 h-4 stroke-[2]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>

              {/* Step Label & Role */}
              <div className="mt-2 flex flex-col items-center">
                <span
                  className={`text-caption font-semibold leading-tight line-clamp-2 ${
                    isCurrent ? 'text-accent' : isCompleted ? 'text-text' : 'text-text-secondary'
                  }`}
                >
                  {step.name}
                </span>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-caption text-text-muted px-1.5 py-0.5 rounded-control bg-surface-subtle border border-border-subtle">
                    {step.role}
                  </span>
                  {step.sla && (
                    <span className="inline-flex items-center gap-0.5 text-caption text-text-muted">
                      <Clock className="w-3 h-3 stroke-[1.5]" />
                      {step.sla}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

