import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { BarChart3, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export const PartnerReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const partner = data.servicePartners.find((p) => p.id === user?.partnerId || p.name.includes('Sanctuary')) || data.servicePartners[0];
  const myReferrals = data.referrals.filter((r) => r.partnerId === partner?.id || r.partnerName.includes(partner?.name));

  const totalAssigned = myReferrals.length;
  const closedCount = myReferrals.filter((r) => r.status === 'Closed').length;
  const completionRate = totalAssigned > 0 ? Math.round((closedCount / totalAssigned) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Partner Performance & Outcomes Summary"
        description="Aggregate consultation outcomes and turnaround metrics for your organization"
        breadcrumb={[
          { label: 'Partner Portal', href: '/partner/home' },
          { label: 'Reports' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Consultations Referred</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{totalAssigned}</div>
          <div className="text-xs text-text-muted mt-0.5">Across pilot timeline</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Completed & Closed Cases</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{closedCount}</div>
          <div className="text-xs text-text-muted mt-0.5">{completionRate}% resolution rate</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Average Turnaround Time</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">4.2 Days</div>
          <div className="text-xs text-text-muted mt-0.5">Well within 7-day routine SLA</div>
        </div>
      </div>
    </div>
  );
};
