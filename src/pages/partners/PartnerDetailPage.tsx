import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Mail, FileCheck2, Users } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';

export const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const partner = data.partners.find((p) => p.id === id) || data.partners[0];

  if (!partner) {
    return (
      <div className="p-8 text-center">
        <h2>Partner not found</h2>
        <Link to="/partners">Back to partners</Link>
      </div>
    );
  }

  const assignedReferrals = (data.referrals || []).filter((r) => r.partnerId === partner.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/partners" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Partners
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{partner.name}</span>
      </div>

      <PageHeader
        title={partner.name}
        subtitle={`${partner.type} • City: ${partner.city}`}
        actions={
          <StatusChip label={partner.mouStatus.replace('_', ' ')} status={partner.mouStatus === 'Active' ? 'active' : 'info'} />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="MOU & organisation details">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[var(--text-secondary)] block">Legal entity type</span>
                <span className="text-sm font-semibold text-[var(--text)]">{partner.type}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">MOU status</span>
                <span className="text-sm font-semibold text-[var(--positive)]">{partner.mouStatus.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Primary contact</span>
                <span className="text-sm font-semibold text-[var(--text)]">{partner.contactPerson}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Official email</span>
                <span className="text-sm font-semibold text-[var(--text)]">{partner.email}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Direct phone</span>
                <span className="text-sm font-semibold text-[var(--text)]">{partner.phone}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block">Operating city</span>
                <span className="text-sm font-semibold text-[var(--text)]">{partner.city}</span>
              </div>
            </div>
          </Card>

          <Card title={`Active referrals assigned to partner (${assignedReferrals.length})`}>
            <div className="divide-y divide-[var(--border-subtle)] text-xs">
              {assignedReferrals.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-[var(--text)]">{r.seniorName}</span>
                    <div className="text-[var(--text-secondary)] mt-0.5">{r.serviceName} • {r.id}</div>
                  </div>
                  <StatusChip
                    label={r.status.replace('_', ' ')}
                    status={r.status === 'Completed' ? 'active' : 'info'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Partner portal login">
            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              <p>
                Service partners log into their dedicated external dashboard to view assigned senior referrals and submit consultation outcomes.
              </p>
              <Link to="/partner/home" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Preview partner portal
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

