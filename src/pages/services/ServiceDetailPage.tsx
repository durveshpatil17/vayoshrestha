import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Briefcase, Plus } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const service = data.services.find((s) => s.id === id) || data.services[0];

  if (!service) {
    return (
      <div className="p-8 text-center">
        <h2>Service not found</h2>
        <Link to="/services">Back to catalogue</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/services" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Services
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{service.name}</span>
      </div>

      <PageHeader
        title={service.name}
        subtitle={`${service.category} • Offered by ${service.partnerName}`}
        actions={
          <Link to="/referrals/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Refer elder to this service
            </Button>
          </Link>
        }
      />

      <Card title="Service overview">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text)] leading-relaxed">
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-[var(--border)]">
            <div>
              <span className="text-[var(--text-secondary)] block">Pricing structure</span>
              <span className="text-sm font-semibold text-[var(--text)]">{service.costType.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)] block">Partner organization</span>
              <span className="text-sm font-semibold text-[var(--text)]">{service.partnerName}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)] block">Lead contact</span>
              <span className="text-sm font-semibold text-[var(--text)]">{service.contactPerson}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)] block">Contact telephone</span>
              <span className="text-sm font-semibold text-[var(--text)]">{service.contactPhone}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

