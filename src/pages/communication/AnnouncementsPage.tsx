import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Send, CheckCheck, Users, Clock } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const AnnouncementsPage: React.FC = () => {
  const broadcasts = [
    {
      id: 'BCAST-001',
      title: 'Diwali Festival Timings & Hub Holidays',
      chapter: 'All Chapters (Pune, Nashik, Bengaluru)',
      recipientsCount: 420,
      deliveredCount: 416,
      sentAt: '25 Oct 2026, 10:00 AM',
      status: 'Completed',
    },
    {
      id: 'BCAST-002',
      title: 'Free Geriatric Eye Checkup Camp — Dr. Sen Visit',
      chapter: 'Nashik Ekta Hub',
      recipientsCount: 85,
      deliveredCount: 84,
      sentAt: '26 Oct 2026, 09:30 AM',
      status: 'Completed',
    },
    {
      id: 'BCAST-003',
      title: 'Seasonal Flu Vaccine Drive Next Tuesday',
      chapter: 'Pune Ekta Hub',
      recipientsCount: 140,
      deliveredCount: 0,
      sentAt: 'Scheduled for 29 Oct 2026, 08:00 AM',
      status: 'Scheduled',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/communication" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Communication
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Announcements</span>
      </div>

      <PageHeader
        title="Broadcast announcements"
        subtitle="Audience-targeted bulletins sent through WhatsApp Interactive and SMS gateways"
        actions={
          <Link to="/communication/announcements/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              New announcement
            </Button>
          </Link>
        }
      />

      <Card title="Past & scheduled broadcasts">
        <div className="divide-y divide-[var(--border-subtle)]">
          {broadcasts.map((b) => (
            <div key={b.id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text font-sans">{b.title}</h3>
                <div className="text-xs text-text-secondary mt-0.5">
                  Target: <strong>{b.chapter}</strong> • {b.sentAt}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-text-secondary block">Delivered / Target</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {b.deliveredCount > 0 ? `${b.deliveredCount} / ${b.recipientsCount}` : `${b.recipientsCount} recipients`}
                  </span>
                </div>
                <StatusChip
                  label={b.status}
                  status={b.status === 'Completed' ? 'active' : 'info'}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

