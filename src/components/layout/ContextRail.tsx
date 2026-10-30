import React from 'react';
import { ChevronRight, ChevronLeft, Clock, History, Zap, CheckCircle2 } from 'lucide-react';
import { ProcessStep } from '../workflow/ProcessFlow';

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface ContextRailProps {
  isOpen: boolean;
  onToggle: () => void;
  title?: string;
  entityName?: string;
  entityId?: string;
  statusBadge?: string;
  steps?: ProcessStep[];
  currentStepId?: string;
  activities?: ActivityItem[];
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'critical';
  }>;
  className?: string;
}

export const ContextRail: React.FC<ContextRailProps> = ({
  isOpen,
  onToggle,
  title = 'Context & Actions',
  entityName,
  entityId,
  statusBadge,
  steps = [],
  currentStepId,
  activities = [],
  actions = [],
  className = '',
}) => {
  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-start py-3 border-l border-border bg-surface w-10 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-control text-text-secondary hover:text-text hover:bg-surface-hover"
          title="Open Context Rail"
          aria-label="Open Context Rail"
        >
          <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={`w-80 shrink-0 border-l border-border bg-surface flex flex-col h-full overflow-hidden ${className}`}
      aria-label="Context Rail"
    >
      {/* Header */}
      <div className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-body font-semibold text-text truncate">{title}</span>
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-control text-text-secondary hover:text-text hover:bg-surface-hover"
          title="Collapse Context Rail"
          aria-label="Collapse Context Rail"
        >
          <ChevronRight className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Record Overview */}
        {(entityName || entityId) && (
          <div className="bg-surface-subtle border border-border-subtle rounded-container p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-caption text-text-muted tabular-nums">{entityId}</span>
              {statusBadge && (
                <span className="text-caption font-semibold px-2 py-0.5 rounded-control bg-accent-tint text-accent border border-accent/20">
                  {statusBadge}
                </span>
              )}
            </div>
            {entityName && (
              <div className="text-body font-semibold text-text truncate">{entityName}</div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-caption font-semibold text-text-secondary mb-2">
              <Zap className="w-3.5 h-3.5 stroke-[1.5] text-accent" />
              <span>Available Actions</span>
            </div>
            <div className="flex flex-col gap-2">
              {actions.map((act, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={act.onClick}
                  className={`w-full h-8 px-3 rounded-control text-caption font-semibold flex items-center justify-center transition-colors ${
                    act.variant === 'primary'
                      ? 'bg-accent text-surface hover:bg-accent-hover'
                      : act.variant === 'critical'
                      ? 'bg-negative text-surface hover:bg-negative/90'
                      : 'bg-surface border border-border text-text hover:bg-surface-hover'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Process Flow Progress */}
        {steps.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-caption font-semibold text-text-secondary mb-2">
              <Clock className="w-3.5 h-3.5 stroke-[1.5] text-accent" />
              <span>Process Timeline</span>
            </div>
            <div className="space-y-2 border-l-2 border-border ml-2 pl-3">
              {steps.map((st) => {
                const isCur = st.id === currentStepId || st.status === 'Current';
                const isDone = st.status === 'Completed';

                return (
                  <div key={st.id} className="relative py-1">
                    <span
                      className={`absolute -left-[19px] top-2 w-2.5 h-2.5 rounded-full border-2 ${
                        isDone
                          ? 'bg-positive border-positive'
                          : isCur
                          ? 'bg-accent border-accent ring-2 ring-accent-tint'
                          : 'bg-surface border-border'
                      }`}
                    />
                    <div className="text-caption font-semibold text-text flex items-center justify-between">
                      <span className={isCur ? 'text-accent' : ''}>{st.name}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-positive stroke-[2]" />}
                    </div>
                    <div className="text-caption text-text-muted flex items-center gap-2 mt-0.5">
                      <span>{st.role}</span>
                      {st.sla && <span>• {st.sla}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Log */}
        {activities.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-caption font-semibold text-text-secondary mb-2">
              <History className="w-3.5 h-3.5 stroke-[1.5] text-accent" />
              <span>Audit Trail</span>
            </div>
            <div className="space-y-2">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-control bg-surface-subtle border border-border-subtle text-caption space-y-0.5"
                >
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="font-semibold text-text">{item.actor}</span>
                    <span className="tabular-nums">{item.timestamp}</span>
                  </div>
                  <div className="text-text-secondary">{item.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
