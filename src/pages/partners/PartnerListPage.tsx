import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building2, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const PartnerListPage: React.FC = () => {
  const data = mockStore.getData();
  const partners = data.partners || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner organisations"
        subtitle="Vetted specialist healthcare, diagnostic, mobility, and legal organisations under active MOU"
        actions={
          <Link to="/partners/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Register partner
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {partners.map((p) => (
          <Card key={p.id} className="hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--surface-selected)] px-2 py-0.5 rounded">
                  {p.type}
                </span>
                <StatusChip label={p.mouStatus.replace('_', ' ')} status={p.mouStatus === 'Active' ? 'active' : 'info'} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] font-sans mb-1.5">{p.name}</h3>
              <div className="text-xs text-[var(--text-secondary)] space-y-1 mb-3">
                <div>City: <strong>{p.city}</strong></div>
                <div>Contact: {p.contactPerson} ({p.phone})</div>
              </div>
            </div>

            <div>
              <div className="py-2.5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-center justify-between mb-3">
                <span>Active referrals</span>
                <span className="font-semibold text-[var(--text)] tabular-nums">{p.activeReferralsCount} cases</span>
              </div>
              <Link to={`/partners/${p.id}`}>
                <Button size="sm" variant="outline" className="w-full justify-between" icon={<ArrowUpRight size={14} />}>
                  Partner profile
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

