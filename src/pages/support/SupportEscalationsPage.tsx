import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const SupportEscalationsPage: React.FC = () => {
  const data = mockStore.getData();
  const escalations = data.escalations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/support/requests" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Health support
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Escalations</span>
      </div>

      <PageHeader
        title="Clinical escalations queue"
        subtitle="Tier-2 physician and geriatrician escalations triggered by persistent vital anomalies or health flags"
        actions={
          <Link to="/support/rules">
            <Button variant="outline">Escalation rules</Button>
          </Link>
        }
      />

      <Card title="Active escalations">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {escalations.map((esc) => (
            <div key={esc.id} className="py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text)] font-sans">{esc.seniorName}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--negative-tint)] text-[var(--negative)]">
                    {esc.severity}
                  </span>
                </div>
                <div className="text-[var(--text-secondary)] mt-0.5">
                  Trigger: <strong>{esc.triggeredBy}</strong>
                </div>
                <div className="text-[var(--text-tertiary)] mt-1">
                  Assigned doctor: {esc.assignedDoctorOrStaff} • Opened: {new Date(esc.openedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip label={esc.status} status={esc.status === 'Resolved' ? 'active' : 'warning'} />
                <Link to={`/support/escalations/${esc.id}`}>
                  <Button size="sm" variant="outline" icon={<ArrowUpRight size={14} />}>
                    Clinical view
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
