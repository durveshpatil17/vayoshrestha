import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, ArrowUpRight, Building2, Phone } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterBar } from '@/components/data/FilterBar';

export const ServiceListPage: React.FC = () => {
  const data = mockStore.getData();
  const services = data.services || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services catalogue"
        subtitle="Vetted specialist services provided through healthcare and community partners"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/service-requests">
              <Button variant="outline">Service requests</Button>
            </Link>
            <Link to="/services/new">
              <Button variant="primary" icon={<Plus size={16} />}>
                Add service
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <Card key={srv.id} className="hover:border-[var(--border-strong)] transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--surface-selected)] px-2 py-0.5 rounded">
                  {srv.category}
                </span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {srv.costType.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] font-sans mb-1.5">{srv.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                {srv.description}
              </p>
            </div>

            <div>
              <div className="py-2.5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1 mb-3">
                <div>Partner: <strong>{srv.partnerName}</strong></div>
                <div>Contact: {srv.contactPerson} ({srv.contactPhone})</div>
              </div>

              <div className="flex items-center justify-between">
                <StatusChip label={srv.activeStatus} status={srv.activeStatus === 'Active' ? 'active' : 'inactive'} />
                <Link to={`/services/${srv.id}`}>
                  <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

