import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const SpDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const partnerId = user?.partnerOrganisationId || 'sp-1';
  const partner = data.servicePartners.find((p) => p.id === partnerId) || data.servicePartners[0];

  const assignedReferrals = data.referrals.filter((r) => r.partnerId === partnerId);
  const newReferrals = assignedReferrals.filter((r) => r.status === 'Sent' || r.status === 'Created');
  const inProgress = assignedReferrals.filter((r) => r.status === 'InProgress' || r.status === 'Accepted');
  const closedCount = assignedReferrals.filter((r) => r.status === 'Closed').length;

  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${partner.name} · Partner Portal`}
        description={`Empanelled Community Partner · Category: ${partner.category} · ${partner.city}.`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Partner Portal' }]}
        primaryAction={
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">Accepting New Referrals:</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                isAvailable
                  ? 'bg-success-bg text-success border-success/30'
                  : 'bg-bg-subtle text-text-muted border-border-hairline'
              }`}
            >
              {isAvailable ? 'Available' : 'Slots Full'}
            </button>
          </div>
        }
      />

      {/* Scope Disclaimer */}
      <div className="p-3 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Partner Privacy Protocol: Demographic records are limited to age bands and non-clinical referral summaries.</span>
        </div>
        <StatusChip label="Minimal Shared Fields" variant="neutral" />
      </div>

      {/* 4 Partner Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">New Referrals</span>
          <div className="text-2xl font-bold font-serif text-accent tabular-nums">
            {newReferrals.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Awaiting acceptance</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">In-Progress Consultations</span>
          <div className="text-2xl font-bold font-serif text-warning tabular-nums">
            {inProgress.length}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Ongoing care plans</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Closed This Month</span>
          <div className="text-2xl font-bold font-serif text-success tabular-nums">
            {closedCount}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Resolved elder inquiries</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Average Turnaround</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            3.2 Days
          </div>
          <span className="text-[11px] text-success block mt-1">Compliant with 7-day SLA</span>
        </div>
      </div>

      {/* Actionable Referrals Queue */}
      <div className="p-5 bg-bg-base border border-border-hairline rounded">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-hairline">
          <div>
            <h3 className="font-serif text-base font-semibold text-text-primary">
              Assigned Referral Consultations
            </h3>
            <p className="text-xs text-text-muted">Review, accept, and update consultation milestones.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/partner/referrals')}>
            View All
          </Button>
        </div>

        <div className="divide-y divide-border-hairline text-xs">
          {assignedReferrals.slice(0, 5).map((ref) => (
            <div key={ref.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-primary">{ref.memberName}</span>
                  <span className="text-text-muted">({ref.memberAgeBand})</span>
                  <StatusChip
                    label={ref.status}
                    variant={ref.status === 'Closed' ? 'active' : ref.status === 'InProgress' ? 'in-progress' : 'pending'}
                  />
                  <span className="text-[10px] text-text-muted">Centre: {ref.centreId}</span>
                </div>
                <p className="text-text-muted leading-relaxed max-w-xl">{ref.nonClinicalReason}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/partner/referrals/${ref.id}`)}
              >
                Update Status
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
