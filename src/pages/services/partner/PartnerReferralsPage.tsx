import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Search, ArrowRight, ShieldAlert } from 'lucide-react';

export const PartnerReferralsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const partner = data.servicePartners.find((p) => p.id === user?.partnerId || p.name.includes('Sanctuary')) || data.servicePartners[0];
  const myReferrals = data.referrals.filter((r) => r.partnerId === partner?.id || r.partnerName.includes(partner?.name));

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = myReferrals.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.memberName.toLowerCase().includes(q) || r.serviceName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Assigned Community Referrals"
        description="Confidential elder consultation cases referred to your organization by Vayoh Vikas coordinators"
        breadcrumb={[
          { label: 'Partner Portal', href: '/partner/home' },
          { label: 'Referrals' },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by elder name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'Sent', 'Accepted', 'InProgress', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {st === 'all' ? 'All Cases' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filtered.length}</strong> referral case{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Requested Service</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4">Referred Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  No referral cases found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((ref) => (
                <tr key={ref.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-mono text-text-muted">{ref.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-text-primary">{ref.memberName}</div>
                    <div className="text-[11px] text-text-muted">Age Band: {ref.memberAgeBand}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">{ref.serviceName}</td>
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
                      variant={ref.status === 'Closed' ? 'neutral' : ref.status === 'InProgress' ? 'active' : 'warning'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{ref.createdAt.split('T')[0]}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/referrals/${ref.id}`} className="text-accent font-semibold hover:underline">
                      Update Status →
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
