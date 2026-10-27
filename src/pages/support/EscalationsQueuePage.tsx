import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { calculateSlaStatus } from '@/domain/escalation';
import { AlertOctagon, Clock, ShieldAlert, Search, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { HealthEscalation } from '@/api/contracts';

export const EscalationsQueuePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const escalations = data.escalations.filter((esc) => {
    // Care Team role sees assigned cases
    if (user?.role === 'CT' && esc.assignedExpertId !== user.id) {
      return false;
    }
    // Centre Coordinator role sees centre cases
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(esc.centreId)) {
        return false;
      }
    }

    if (statusFilter !== 'all' && esc.status !== statusFilter) return false;
    if (severityFilter !== 'all' && esc.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return esc.memberName.toLowerCase().includes(q) || esc.summary.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Governed Escalations Queue"
        description="High-priority distress alerts, keyword warning triggers, and SLA-bound professional clinical handovers (FR-40 & FR-42)"
        breadcrumb={[
          { label: 'Health Support', href: '/support/requests' },
          { label: 'Escalations Queue' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/support/rules">
              <Button variant="outline" size="sm">
                Warning Sign Trigger Rules
              </Button>
            </Link>
          </div>
        }
      />

      {/* Mandatory Non-Clinical Scope Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded flex items-start gap-3 text-xs text-text-muted">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Human Clinical Routing Protocol:</strong> Escalation cases require prompt human assessment by
          the designated Care Team specialist. System flags provide immediate triage alerts; all diagnoses, treatments, or hospital referrals
          must be made by licensed medical practitioners.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Open', 'Acknowledged', 'InProgress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{escalations.length}</strong> escalation case{escalations.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Escalation Queue Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">SLA Urgency Timer</th>
              <th className="py-3 px-4">Trigger Keywords / Symptoms</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {escalations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  Zero active escalation cases in this view.
                </td>
              </tr>
            ) : (
              escalations.map((esc) => {
                const sla = calculateSlaStatus(esc.createdAt, esc.slaHours);
                const isOverdue = sla.isBreached && esc.status !== 'Resolved' && esc.status !== 'Closed';

                return (
                  <tr key={esc.id} className="hover:bg-bg-subtle/40">
                    <td className="py-3.5 px-4 font-mono text-text-muted">{esc.id}</td>
                    <td className="py-3.5 px-4 font-medium">
                      <Link to={`/members/${esc.memberId}`} className="hover:text-accent underline decoration-dotted">
                        {esc.memberName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          esc.severity === 'Immediate'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : esc.severity === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {esc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {esc.status === 'Resolved' || esc.status === 'Closed' ? (
                        <span className="text-emerald-700 font-medium">Resolved within SLA</span>
                      ) : (
                        <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-rose-700 font-bold' : 'text-text-muted'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {sla.formattedRemaining}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {esc.triggerKeywords.map((kw) => (
                          <span key={kw} className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip
                        label={esc.status}
                        variant={esc.status === 'Resolved' || esc.status === 'Closed' ? 'active' : isOverdue ? 'danger' : 'warning'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/support/escalations/${esc.id}`} className="text-accent font-semibold hover:underline">
                        Review & Handover →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
