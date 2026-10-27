import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import { NON_CLINICAL_DISCLAIMER, calculateSlaStatus, formatSlaCountdown } from '@/domain/escalation';
import {
  HeartPulse,
  AlertTriangle,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const CtDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();
  const escalations = data.escalations;

  const urgentCases = escalations.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed');
  const resolvedCases = escalations.filter((e) => e.status === 'Resolved' || e.status === 'Closed');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Care Team & Triage Desk"
        description="Health-related eldercare requests, warning sign keyword alerts, and SLA escalation tracking."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Care Team' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/support/escalations')}
          >
            Open Active Caseload ({urgentCases.length})
          </Button>
        }
      />

      {/* Mandatory Non-Clinical Notice */}
      <div className="p-4 bg-info-bg border border-border-hairline rounded text-xs text-text-primary flex items-start gap-3">
        <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-accent font-semibold mb-0.5">Non-Clinical Statutory Notice:</strong>
          {NON_CLINICAL_DISCLAIMER}
        </div>
      </div>

      {/* SLA Triage Queue */}
      <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <div>
            <h3 className="font-serif text-base font-semibold text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              Active Triage Queue (Sorted by SLA Urgency)
            </h3>
            <p className="text-xs text-text-muted">Real-time countdown against severity response benchmarks.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-text-muted">
            {urgentCases.length} open cases
          </span>
        </div>

        <div className="divide-y divide-border-hairline text-xs">
          {urgentCases.slice(0, 5).map((c) => {
            const sla = calculateSlaStatus(c.createdAt, c.slaHours);
            const countdownStr = formatSlaCountdown(sla.remainingMinutes);

            return (
              <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary">{c.memberName}</span>
                    <span className="text-[11px] text-text-muted">({c.centreId})</span>
                    <StatusChip
                      label={c.severity}
                      variant={c.severity === 'Immediate' ? 'danger' : c.severity === 'High' ? 'pending' : 'neutral'}
                    />
                    <span className="text-[10px] bg-bg-subtle text-text-muted px-1.5 py-0.5 rounded border border-border-hairline font-mono">
                      Via {c.source}
                    </span>
                  </div>
                  <p className="text-text-muted leading-relaxed max-w-xl">{c.summary}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono text-xs font-bold mb-1.5 ${sla.isBreached ? 'text-danger' : 'text-accent'}`}>
                    {countdownStr}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/support/escalations/${c.id}`)}
                  >
                    Triage Case
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
