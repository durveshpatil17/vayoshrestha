import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const ServiceRequestsPage: React.FC = () => {
  const data = mockStore.getData();
  const referrals = data.referrals || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/services" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Services
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Service requests</span>
      </div>

      <PageHeader
        title="Service requests & assignments"
        subtitle="Manage senior service inquiries, partner coordination, and fulfillment status"
        actions={
          <Link to="/referrals/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Create request
            </Button>
          </Link>
        }
      />

      <Card title="Active service requests queue">
        <div className="divide-y divide-[var(--border-subtle)]">
          {referrals.map((ref) => (
            <div key={ref.id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text font-sans">
                  {ref.seniorName} — {ref.serviceName}
                </h3>
                <div className="text-xs text-text-secondary mt-0.5">
                  ID: <span className="tabular-nums font-semibold">{ref.id}</span> • Partner: <strong>{ref.partnerName}</strong> • Requested on: {new Date(ref.referredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
                <p className="text-xs text-text-secondary mt-1">"{ref.notes}"</p>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={ref.status.replace('_', ' ')}
                  status={ref.status === 'Completed' ? 'active' : ref.status === 'In_Progress' ? 'info' : 'warning'}
                />
                <Link to={`/referrals/${ref.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

