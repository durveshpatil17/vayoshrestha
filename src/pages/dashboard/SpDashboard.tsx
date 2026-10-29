import React from 'react';
import { ClipboardList, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { KpiTile } from '@/components/ui/KpiTile';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const SpDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner portal"
        subtitle="HealthBridge Care — assigned senior referrals, consultations, and outcomes"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="Open referrals"
          value="8"
          icon={<ClipboardList size={20} />}
          status="neutral"
        />
        <KpiTile
          label="Pending initial visit"
          value="3"
          icon={<Clock size={20} />}
          status="warning"
        />
        <KpiTile
          label="Completed this month"
          value="14"
          icon={<CheckCircle2 size={20} />}
          status="positive"
        />
        <KpiTile
          label="Active MOU status"
          value="Verified"
          icon={<Building2 size={20} />}
          status="neutral"
        />
      </div>

      <Card title="Assigned referrals awaiting action">
        <div className="divide-y divide-border-subtle">
          {[
            {
              id: 'REF-2026-081',
              senior: 'Kamala Devi (72y)',
              hub: 'Pune Hub',
              service: 'Physiotherapy & Mobility Assessment',
              date: '27 Oct 2026',
              urgency: 'Medium',
            },
            {
              id: 'REF-2026-084',
              senior: 'Rameshwar Patil (78y)',
              hub: 'Pune Hub',
              service: 'Hearing Aid Calibration',
              date: '26 Oct 2026',
              urgency: 'Standard',
            },
            {
              id: 'REF-2026-089',
              senior: 'Savitri Bai (69y)',
              hub: 'Nashik Hub',
              service: 'Diabetic Foot Screening',
              date: '25 Oct 2026',
              urgency: 'Standard',
            },
          ].map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text">{item.senior} — {item.service}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  ID: <span className="tabular-nums">{item.id}</span> • Chapter: {item.hub} • Referred: {item.date}
                </div>
              </div>
              <Link to={`/partner/referrals`}>
                <Button size="sm" variant="outline">Update status</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

