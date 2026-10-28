import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Plus, ArrowUpRight, AlertTriangle, PhoneCall } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const SupportRequestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assisted health support requests"
        subtitle="Volunteer assisted health inquiries, doctor tele-consult requests, and home nurse dispatch"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/support/escalations">
              <Button variant="outline">Clinical escalations</Button>
            </Link>
            <Link to="/support/handover">
              <Button variant="outline">Shift handover</Button>
            </Link>
          </div>
        }
      />

      <Card title="Active health support tickets">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {[
            {
              id: 'HLT-REQ-101',
              senior: 'Kamala Devi (72y)',
              hub: 'Pune Ekta Hub',
              type: 'Medication Refill & Prescription Clarification',
              priority: 'Medium',
              status: 'Assigned',
              coordinator: 'Pooja Shinde (VF)',
            },
            {
              id: 'HLT-REQ-102',
              senior: 'Ramesh Kulkarni (78y)',
              hub: 'Pune Ekta Hub',
              type: 'Blood Glucose Meter Battery Replacement & Calibration',
              priority: 'Low',
              status: 'Open',
              coordinator: 'Sunita Patil (CM)',
            },
          ].map((req) => (
            <div key={req.id} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-[var(--text)]">{req.senior}</span>
                <div className="text-[var(--text-secondary)] mt-0.5">
                  Type: <strong>{req.type}</strong> • Hub: {req.hub} • Assigned to: {req.coordinator}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusChip label={req.status} status={req.status === 'Assigned' ? 'info' : 'warning'} />
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
