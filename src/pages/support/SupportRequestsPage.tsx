import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, AlertTriangle, Clock, Search, ArrowRight, UserCheck } from 'lucide-react';

export const SupportRequestsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived health-related requests from escalations and intake
  const requests = data.escalations.filter((esc) => {
    // Scope: Care Team (CT) sees assigned cases
    if (user?.role === 'CT' && esc.assignedExpertId !== user.id) {
      return false;
    }
    // Centre Coordinator (CC) sees centre cases
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(esc.centreId)) {
        return false;
      }
    }

    if (urgencyFilter !== 'all' && esc.severity !== urgencyFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return esc.memberName.toLowerCase().includes(q) || esc.summary.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Health-Related Support & Triage Requests"
        description="Non-clinical routing of elder medical or distress requests to qualified human care professionals (FR-39)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Health Support Requests' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/support/escalations">
              <Button variant="primary" size="sm">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Active Escalations Queue ({data.escalations.filter((e) => e.status !== 'Resolved' && e.status !== 'Closed').length})
              </Button>
            </Link>
          </div>
        }
      />

      {/* Mandatory Non-Clinical Notice (Hard constraint) */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded flex items-start gap-3 text-xs text-text-muted">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Strict Non-Clinical Scope Notice:</strong> Vayoshreshtha does not diagnose or give clinical advice.
          Health-related requests are routed to qualified professionals and approved partner clinics. Technology provides triage intake;
          licensed human professionals manage care.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior or symptoms mentioned..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Immediate', 'High', 'Standard'].map((sev) => (
              <button
                key={sev}
                onClick={() => setUrgencyFilter(sev)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  urgencyFilter === sev
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {sev === 'all' ? 'All Severities' : sev}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{requests.length}</strong> active health intake cases
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Intake Source</th>
              <th className="py-3 px-4">Severity & SLA</th>
              <th className="py-3 px-4">Observations Summary</th>
              <th className="py-3 px-4">Assigned Expert</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  No health support requests found in this view.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-mono text-text-muted">{r.id}</td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">
                    <Link to={`/members/${r.memberId}`} className="hover:text-accent underline decoration-dotted">
                      {r.memberName}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{r.source}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.severity === 'Immediate'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : r.severity === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {r.severity} ({r.slaHours}h SLA)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-text-muted">
                    <div className="line-clamp-2">{r.summary}</div>
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {r.assignedExpertName || 'Care Team Triage'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/support/escalations/${r.id}`} className="text-accent font-semibold hover:underline">
                      View Case →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
