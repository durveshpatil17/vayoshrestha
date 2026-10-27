import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Plus, Search, LayoutGrid, Table, Building2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Referral } from '@/api/contracts';

export const ReferralListPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scoped referrals based on role
  const referrals = data.referrals.filter((ref) => {
    // If SP: only referrals assigned to their organization
    if (user?.role === 'SP') {
      if (ref.partnerId !== user.partnerId && !ref.partnerName.includes(user.fullName)) {
        return false;
      }
    }
    // If CC: assigned centre only
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(ref.centreId)) {
        return false;
      }
    }

    if (statusFilter !== 'all' && ref.status !== statusFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ref.memberName.toLowerCase().includes(q) ||
        ref.partnerName.toLowerCase().includes(q) ||
        ref.serviceName.toLowerCase().includes(q) ||
        ref.nonClinicalReason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stages: Referral['status'][] = ['Created', 'Sent', 'Accepted', 'InProgress', 'Closed'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Community Referrals Pipeline"
        description="Structured external care referrals with partner routing, data-minimization, and closed-loop follow-up (FR-32 & FR-33)"
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Referrals' }]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border-hairline rounded overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 text-xs ${viewMode === 'table' ? 'bg-accent text-white' : 'bg-bg-base text-text-muted hover:text-text-primary'}`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 text-xs ${viewMode === 'board' ? 'bg-accent text-white' : 'bg-bg-base text-text-muted hover:text-text-primary'}`}
                title="Pipeline Kanban Board"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Can capability="referrals" action="create">
              <Link to="/referrals/new">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Initiate Referral
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      {/* Mandatory Non-Clinical Notice */}
      <div className="p-3 bg-bg-subtle border border-border-hairline rounded flex items-center gap-2 text-xs text-text-muted">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
        <span>
          <strong>Non-Clinical Safeguard:</strong> All referral reasons are recorded using non-clinical observational wording.
          Only minimal required profile data is shared with approved community partners upon explicit consent.
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior, partner, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Created', 'Sent', 'Accepted', 'InProgress', 'Closed'].map((st) => (
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
          Showing <strong>{referrals.length}</strong> referral case{referrals.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* View Display: Table or Kanban Board */}
      {viewMode === 'table' ? (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
              <tr>
                <th className="py-3 px-4">Referral ID</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Specialty & Partner</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Age in Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No referrals found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-bg-subtle/40">
                    <td className="py-3.5 px-4 font-mono text-text-muted">{ref.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-text-primary">{ref.memberName}</div>
                      <div className="text-[11px] text-text-muted">Age Band: {ref.memberAgeBand}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-text-primary">{ref.serviceName}</div>
                      <div className="text-[11px] text-text-muted">{ref.partnerName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          ref.urgency === 'Immediate'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : ref.urgency === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {ref.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip
                        label={ref.status}
                        variant={ref.status === 'Closed' ? 'neutral' : ref.status === 'InProgress' || ref.status === 'Accepted' ? 'active' : 'warning'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {ref.status !== 'Closed' ? '3 days' : 'Resolved'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/referrals/${ref.id}`} className="text-accent font-semibold hover:underline">
                        View & Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Kanban Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((st) => {
            const stageRefs = referrals.filter((r) => r.status === st);

            return (
              <div key={st} className="bg-bg-subtle rounded border border-border-hairline p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border-hairline pb-2">
                  <span className="font-serif text-xs font-semibold text-text-primary">{st}</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-bg-base border border-border-hairline rounded text-text-muted">
                    {stageRefs.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {stageRefs.map((r) => (
                    <Link
                      key={r.id}
                      to={`/referrals/${r.id}`}
                      className="block bg-bg-base border border-border-hairline hover:border-border-strong rounded p-3 text-xs space-y-1.5 shadow-xs transition-all"
                    >
                      <div className="font-medium text-text-primary line-clamp-1">{r.memberName}</div>
                      <div className="text-text-muted text-[11px] line-clamp-1">{r.serviceName}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-border-hairline text-[10px] text-text-muted">
                        <span>{r.partnerName.slice(0, 15)}...</span>
                        <span className={r.urgency === 'Immediate' ? 'text-rose-700 font-bold' : ''}>{r.urgency}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
