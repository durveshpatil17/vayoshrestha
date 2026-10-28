import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle2, Clock, User, FileText, ArrowUpRight } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const PartnerHomePage: React.FC = () => {
  const data = mockStore.getData();
  const referrals = data.referrals || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner portal — HealthBridge Care"
        subtitle="Assigned referrals, patient outcomes, and consultation reporting"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Open referrals</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">8</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Pending consultation</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Awaiting partner response</span>
          <span className="text-2xl font-semibold text-[var(--critical)] tabular-nums">3</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">SLA: 48 hours</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Completed this month</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">14</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Consultation completed</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">MOU standing</span>
          <span className="text-2xl font-semibold text-[var(--accent)]">Active</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Valid through Dec 2027</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card
            title="Assigned senior referrals"
            action={
              <Link to="/partner/referrals">
                <Button size="sm" variant="outline">View all</Button>
              </Link>
            }
          >
            <div className="divide-y divide-[var(--border-subtle)]">
              {referrals.map((ref) => (
                <div key={ref.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)] font-sans">
                      {ref.seniorName} — {ref.serviceName}
                    </h3>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      ID: <span className="tabular-nums font-semibold">{ref.id}</span> • Chapter: {ref.chapterId}
                    </div>
                  </div>
                  <Link to={`/partner/referrals/${ref.id}`}>
                    <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                      Update
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Quick actions">
            <div className="space-y-2">
              <Link to="/partner/referrals" className="block">
                <Button variant="outline" className="w-full justify-start" icon={<ClipboardList size={16} />}>
                  Manage all referrals
                </Button>
              </Link>
              <Link to="/partner/reports" className="block">
                <Button variant="outline" className="w-full justify-start" icon={<FileText size={16} />}>
                  Monthly service report
                </Button>
              </Link>
              <Link to="/partner/profile" className="block">
                <Button variant="outline" className="w-full justify-start" icon={<User size={16} />}>
                  Organisation profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
