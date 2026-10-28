import React from 'react';
import { Heart, Phone, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const FmPortal: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Family portal"
        subtitle="Keep track of your elder's wellbeing and community activities with explicit consent"
      />

      <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--surface-selected)] border border-[var(--border)]">
        <ShieldCheck size={20} className="text-[var(--accent)] shrink-0" />
        <div className="text-sm text-[var(--text)]">
          Family access granted by <strong>Kamala Devi</strong> (Mother) on 12 Sep 2026. Only permitted wellness records and activity summaries are visible.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Elder status snapshot">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Senior:</span>
              <span className="font-semibold text-[var(--text)]">Kamala Devi (72y)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Hub:</span>
              <span className="font-semibold text-[var(--text)]">Pune Ekta Hub</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Last check-in call:</span>
              <span className="text-[var(--positive)] font-semibold">27 Oct 2026 (Completed)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Active SOS:</span>
              <span className="text-[var(--positive)] font-semibold">None (Normal)</span>
            </div>
          </div>
        </Card>

        <Card title="Quick actions">
          <div className="space-y-3">
            <Link to="/family/senior-001" className="block">
              <Button variant="outline" className="w-full justify-start" icon={<Heart size={16} />}>
                Senior wellbeing summary
              </Button>
            </Link>
            <Link to="/family/links" className="block">
              <Button variant="outline" className="w-full justify-start" icon={<Phone size={16} />}>
                Emergency contact details
              </Button>
            </Link>
            <Link to="/family/senior-001" className="block">
              <Button variant="outline" className="w-full justify-start" icon={<FileText size={16} />}>
                View activity log
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Ekta Hub contact">
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p><strong>Coordinator:</strong> Suresh Kulkarni</p>
            <p><strong>Phone:</strong> +91 98200 11223</p>
            <p><strong>Hours:</strong> Mon – Sat, 9:00 AM – 6:00 PM</p>
            <a href="tel:+919820011223" className="block mt-4">
              <Button variant="primary" size="sm" icon={<Phone size={16} />}>
                Call coordinator
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};
