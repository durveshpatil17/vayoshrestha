import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Building2, Calendar, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const PartnerHomePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const partner = data.servicePartners.find((p) => p.id === user?.partnerId || p.name.includes('Sanctuary')) || data.servicePartners[0];
  const myReferrals = data.referrals.filter((r) => r.partnerId === partner?.id || r.partnerName.includes(partner?.name));

  const newCount = myReferrals.filter((r) => r.status === 'Created' || r.status === 'Sent').length;
  const inProgressCount = myReferrals.filter((r) => r.status === 'Accepted' || r.status === 'InProgress').length;
  const closedCount = myReferrals.filter((r) => r.status === 'Closed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Partner Portal: ${partner?.name}`}
        description="Assigned community referrals, senior consultations, and organization service availability (FR-34 & FR-54)"
        breadcrumb={[{ label: 'Home', href: '/partner/home' }]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/partner/referrals">
              <Button variant="primary" size="sm">
                View Assigned Referrals ({myReferrals.length})
              </Button>
            </Link>
          </div>
        }
      />

      {/* Mandatory Non-Clinical / Data Minimization Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded flex items-start gap-3 text-xs text-text-muted">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Data Minimization Protected Environment:</strong> As an approved partner organization,
          you have access strictly to senior citizens who have given explicit digital consent to share their contact information for your services.
          Senior profile details outside your assigned cases are completely isolated and inaccessible.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">New Referral Requests</div>
          <div className="text-2xl font-serif font-bold text-amber-700 mt-1">{newCount}</div>
          <div className="text-xs text-text-muted mt-0.5">Awaiting acknowledgement</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">In Consultation / Scheduled</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">{inProgressCount}</div>
          <div className="text-xs text-text-muted mt-0.5">Active case load</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Completed Consultations</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{closedCount}</div>
          <div className="text-xs text-text-muted mt-0.5">Resolved with outcome note</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Approval Status</div>
          <div className="mt-2">
            <StatusChip label={partner?.approvalStatus || 'Approved'} variant="active" />
          </div>
          <div className="text-xs text-text-muted mt-1">{partner?.category}</div>
        </div>
      </div>

      {/* Referral Queue Table */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <h3 className="font-serif text-base font-semibold text-text-primary">Active Cases Needing Attention</h3>
          <Link to="/partner/referrals" className="text-xs text-accent font-semibold hover:underline">
            View All ({myReferrals.length}) →
          </Link>
        </div>

        <div className="divide-y divide-border-hairline">
          {myReferrals.slice(0, 5).map((ref) => (
            <div key={ref.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-medium text-text-primary">{ref.memberName} ({ref.memberAgeBand})</div>
                <div className="text-text-muted">{ref.serviceName} • Urgency: <strong>{ref.urgency}</strong></div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={ref.status}
                  variant={ref.status === 'Closed' ? 'neutral' : ref.status === 'InProgress' ? 'active' : 'warning'}
                />
                <Link to={`/referrals/${ref.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Review Case <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
