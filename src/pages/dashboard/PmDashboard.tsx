import React from 'react';
import { BarChart3, Users, Calendar, Briefcase, AlertCircle, Clock } from 'lucide-react';
import { KpiTile } from '@/components/ui/KpiTile';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const PmDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Programme overview"
        subtitle="Organisation-wide programme delivery, session schedules, and partner operations"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/programmes/new">
              <Button variant="primary">New programme</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="Active programmes"
          value="24"
          icon={<BarChart3 size={20} />}
          status="neutral"
        />
        <KpiTile
          label="Sessions scheduled"
          value="186"
          icon={<Calendar size={20} />}
          status="neutral"
        />
        <KpiTile
          label="Active participants"
          value="1,243"
          icon={<Users size={20} />}
          status="neutral"
        />
        <KpiTile
          label="Service partners"
          value="12"
          icon={<Briefcase size={20} />}
          status="neutral"
        />
      </div>

      <Card title="Needs attention">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded bg-[var(--negative-tint)] border border-[var(--border)]">
            <AlertCircle size={18} className="text-[var(--negative)] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text)]">3 sessions have unsubmitted attendance</div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Attendance rosters for Pune Hub (Digital Literacy) and Nashik Hub (Yoga for Elders) are overdue by &gt;48 hours.
              </p>
            </div>
            <Link to="/attendance/corrections">
              <Button size="sm" variant="secondary">Review</Button>
            </Link>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded bg-[var(--critical-tint)] border border-[var(--border)]">
            <Clock size={18} className="text-[var(--critical)] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[var(--text)]">2 new programmes awaiting approval</div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Submitted by Pune Hub coordinator for Q4 cycle.
              </p>
            </div>
            <Link to="/programmes">
              <Button size="sm" variant="secondary">Open</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

