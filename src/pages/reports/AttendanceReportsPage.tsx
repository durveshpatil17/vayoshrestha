import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const AttendanceReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/reports" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Attendance</span>
      </div>

      <PageHeader
        title="Attendance & session compliance reports"
        subtitle="Roster submission timeliness, 24-hour auto-lock compliance, and repeat absence patterns"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export summary
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Average attendance per session</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">22.4 elders</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Roster lock compliance (&lt;24h)</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">98.2%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Total session visits (Q3-Q4)</span>
          <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">14,280</span>
        </div>
      </div>
    </div>
  );
};
