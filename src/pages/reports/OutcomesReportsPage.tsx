import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, Heart, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const OutcomesReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/reports" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Outcomes</span>
      </div>

      <PageHeader
        title="Clinical outcomes & wellness improvements"
        subtitle="Pre- and post-intervention health improvements documented over the 90-day pilot cycle"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export outcome report
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Average systolic BP reduction</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">-8.4 mmHg</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Cohort with hypertension (N=642)</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Medication adherence increase</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">+24.6%</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Confirmed via interactive reminders</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">SOS median response time</span>
          <span className="text-2xl font-semibold text-[var(--accent)] tabular-nums">84 seconds</span>
          <span className="text-xs text-[var(--text-tertiary)] block mt-1">Well within 120s emergency SLA</span>
        </div>
      </div>
    </div>
  );
};
