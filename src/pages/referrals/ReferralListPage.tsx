import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUpRight, Building2 } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';

export const ReferralListPage: React.FC = () => {
  const data = mockStore.getData();
  const referrals = data.referrals || [];
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filtered = referrals.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals management"
        subtitle="Clinical, diagnostic, and legal referrals to vetted partner organisations"
        actions={
          <Link to="/referrals/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              New referral
            </Button>
          </Link>
        }
      />

      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
        searchPlaceholder="Filter referrals..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { label: 'All statuses', value: 'ALL' },
              { label: 'Requested', value: 'Requested' },
              { label: 'In Progress', value: 'In_Progress' },
              { label: 'Completed', value: 'Completed' },
            ],
          },
        ]}
      />

      <Card title="Referrals registry">
        <div className="divide-y divide-[var(--border-subtle)]">
          {filtered.map((ref) => (
            <div key={ref.id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text font-sans">
                  {ref.seniorName} — {ref.serviceName}
                </h3>
                <div className="text-xs text-text-secondary mt-0.5">
                  ID: <span className="tabular-nums font-semibold">{ref.id}</span> • Assigned Partner: <strong>{ref.partnerName}</strong>
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Referred on: {new Date(ref.referredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={ref.status.replace('_', ' ')}
                  status={ref.status === 'Completed' ? 'active' : ref.status === 'In_Progress' ? 'info' : 'warning'}
                />
                <Link to={`/referrals/${ref.id}`}>
                  <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

