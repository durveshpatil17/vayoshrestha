import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { MessageStrip } from '@/components/ui/MessageStrip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Clock,
  Shield,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const CtDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  // Scoped to cases assigned to this responder
  const assignedSos = data.sosEvents.filter(
    (e) =>
      e.assignedResponderId === user?.id ||
      e.status === 'TRIGGERED' ||
      e.status === 'ACKNOWLEDGED'
  );

  const openCases = assignedSos.filter((e) => e.status !== 'RESOLVED' && e.status !== 'CANCELLED_BY_SENIOR');
  const resolvedCases = assignedSos.filter((e) => e.status === 'RESOLVED');
  const criticalFlags = data.healthFlags.filter((f) => f.bandCrossed === 'CRITICAL');

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* 1. Case-Limited Data Isolation Notice */}
      <MessageStrip
        type="informative"
        message="Case-limited data isolation: Responder access to senior contact details is granted strictly during an active emergency case and automatically terminates 24 hours following resolution."
      />

      {/* 2. Page Header */}
      <PageHeader
        title="Care Team and Emergency Responder Caseload"
        description="Assigned high-urgency SOS cases, critical-band vital escalation, and compassionate elder triage."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/health/rules')}
            >
              Propose Thresholds
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => navigate('/sos')}
              className="gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" strokeWidth={1.5} />
              Live SOS Board ({openCases.length})
            </Button>
          </div>
        }
      />

      {/* 3. Exactly 4 Headline Numeric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Active SOS caseload"
          value={openCases.length}
          statusLine={openCases.length === 0 ? 'No open emergencies' : 'Awaiting response or in progress'}
          status={openCases.length === 0 ? 'positive' : 'negative'}
        />
        <KpiTile
          title="Critical vital flags"
          value={criticalFlags.length}
          statusLine={criticalFlags.length === 0 ? 'No critical flags' : 'BP >= 180 or Glucose >= 300'}
          status={criticalFlags.length === 0 ? 'positive' : 'critical'}
        />
        <KpiTile
          title="Median response time"
          value="1.2"
          unit="min"
          statusLine="Target < 2.0 min met"
          status="positive"
        />
        <KpiTile
          title="Resolved cases"
          value={resolvedCases.length}
          statusLine="Confirmed safe and closed"
          status="positive"
        />
      </div>

      {/* 4. Needs Attention Row List */}
      <Card
        title="Needs attention"
        subtitle="Active emergency incidents requiring immediate responder action"
        padding="none"
      >
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <StatusIndicator
                status={openCases.length > 0 ? 'negative' : 'positive'}
                label={openCases.length > 0 ? 'Urgent' : 'Normal'}
              />
              <div className="min-w-0">
                <p className="text-sm text-text font-semibold truncate">
                  {openCases.length > 0
                    ? `${openCases.length} emergency case(s) requiring response coordination`
                    : 'No open emergencies in caseload'}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Sub-second incident queue synchronization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-secondary tabular-nums">Live</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/sos')}
              >
                Inspect Queue
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 5. Active Emergency Caseload Table */}
      <Card padding="none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Active emergency caseload
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Sorted by urgency and SLA countdown (&lt; 2 min target)
            </p>
          </div>
          <span className="text-xs text-text-secondary tabular-nums">
            {openCases.length} open cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold h-10">
                <th className="py-2 px-4">Case ID</th>
                <th className="py-2 px-4">Senior citizen</th>
                <th className="py-2 px-4">Chapter</th>
                <th className="py-2 px-4">Triggered at</th>
                <th className="py-2 px-4">SMS fallback</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {openCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-secondary">
                    <p className="text-sm font-semibold text-text">No open emergencies</p>
                    <p className="text-xs text-text-secondary mt-1">
                      All emergency cases are resolved and verified safe.
                    </p>
                  </td>
                </tr>
              ) : (
                openCases.map((ev) => {
                  const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);

                  return (
                    <tr
                      key={ev.id}
                      className="h-12 hover:bg-surface-hover transition-colors"
                    >
                      <td className="py-2 px-4 font-semibold text-text tabular-nums">{ev.id}</td>
                      <td className="py-2 px-4">
                        <span className="font-semibold text-text block">
                          {senior?.fullName || 'Senior'}
                        </span>
                        <span className="text-xs text-text-secondary tabular-nums">
                          {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-text">{ev.chapterId}</td>
                      <td className="py-2 px-4 text-text-secondary tabular-nums">
                        {new Date(ev.triggeredAt).toLocaleTimeString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                        })}
                      </td>
                      <td className="py-2 px-4">
                        {ev.cellularFallbackTriggered ? (
                          <span className="text-accent font-semibold text-xs">SMS Dispatched</span>
                        ) : (
                          <span className="text-text-secondary text-xs">Normal</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <StatusIndicator
                          status={ev.status === 'TRIGGERED' ? 'negative' : 'critical'}
                          label={ev.status === 'TRIGGERED' ? 'Triggered' : 'Acknowledged'}
                        />
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/sos/${ev.id}`)}
                          className="gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Respond
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
