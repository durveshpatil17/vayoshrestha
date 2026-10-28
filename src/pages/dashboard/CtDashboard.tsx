import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { maskPhoneNumber } from '@/domain/masking';
import {
  AlertOctagon,
  Clock,
  Shield,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Care Team & Emergency Responder Caseload"
          description="Assigned high-urgency SOS cases, critical-band vital escalation, and compassionate elder triage."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/health/rules')}
            className="text-xs"
          >
            Propose Thresholds
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/sos')}
            className="text-xs gap-1.5 bg-danger hover:bg-danger/90 text-white font-bold"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Live SOS Board ({openCases.length})
          </Button>
        </div>
      </div>

      {/* 24-Hour Access Expiry Notice */}
      <div className="p-3 bg-surface-subtle border border-border-hairline rounded text-xs text-text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>
            <strong>Case-Limited Data Isolation:</strong> Responder access to senior contact details is
            granted strictly during an active emergency case and automatically terminates 24 hours
            following case resolution.
          </span>
        </div>
        <StatusChip status="neutral" label="Case-Limited" />
      </div>

      {/* Caseload Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Active SOS Caseload</span>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              openCases.length > 0 ? 'text-danger' : 'text-text-primary'
            }`}
          >
            {openCases.length}
          </div>
          <span className="text-[10px] text-text-muted">Awaiting response or in progress</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Critical Vital Flags</span>
          <div className="text-2xl font-bold font-mono text-warning mt-1">
            {criticalFlags.length}
          </div>
          <span className="text-[10px] text-text-muted">BP &gt;= 180 or Glucose &gt;= 300</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Resolved Cases</span>
          <div className="text-2xl font-bold font-mono text-success mt-1">
            {resolvedCases.length}
          </div>
          <span className="text-[10px] text-text-muted">Confirmed safe & closed</span>
        </div>
      </div>

      {/* Active Urgent Caseload Queue */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Active Emergency Caseload (Sorted by Urgency)
          </h3>
          <span className="text-xs text-text-muted">SLA Countdown &lt; 2 min</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Senior Citizen</th>
                <th className="py-2.5 px-4">Chapter</th>
                <th className="py-2.5 px-4">Triggered At</th>
                <th className="py-2.5 px-4">Cellular SMS</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {openCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted">
                    <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-1.5" />
                    No active emergency cases in your assigned queue.
                  </td>
                </tr>
              ) : (
                openCases.map((ev) => {
                  const senior = data.seniorCitizens.find((s) => s.id === ev.seniorId);

                  return (
                    <tr
                      key={ev.id}
                      className={`hover:bg-surface-subtle ${
                        ev.status === 'TRIGGERED' ? 'bg-danger-surface/30 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 font-mono font-bold text-text-primary">{ev.id}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-text-primary block">
                          {senior?.fullName || 'Senior'}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {senior ? maskPhoneNumber(senior.phoneNumber) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-text-primary">{ev.chapterId}</td>
                      <td className="py-2.5 px-4 font-mono text-text-muted">
                        {new Date(ev.triggeredAt).toLocaleTimeString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                        })}
                      </td>
                      <td className="py-2.5 px-4">
                        {ev.cellularFallbackTriggered ? (
                          <span className="text-accent font-medium text-[11px]">SMS Dispatched</span>
                        ) : (
                          <span className="text-text-muted text-[11px]">Data OK</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusChip
                          status={ev.status === 'TRIGGERED' ? 'danger' : 'warning'}
                          label={ev.status}
                        />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/sos/${ev.id}`)}
                          className="text-xs px-2.5 py-1 h-7 gap-1 bg-accent"
                        >
                          <Eye className="w-3 h-3" />
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
      </div>
    </div>
  );
};
