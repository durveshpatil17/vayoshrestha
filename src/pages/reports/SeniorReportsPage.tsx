import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SeniorReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/reports" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Seniors</span>
      </div>

      <PageHeader
        title="Senior demographic & health profiles"
        subtitle="Vulnerability distributions, age brackets, living arrangements, and chronic disease prevalence"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export demographics
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Average age</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">71.4 yrs</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Female / Male ratio</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">54% / 46%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Living alone (High vulnerability)</span>
          <span className="text-2xl font-semibold text-[var(--negative)] tabular-nums">28% (284 elders)</span>
        </div>
      </div>

      <Card title="Prevalence of chronic conditions (Pilot cohort N=1,000)">
        <div className="space-y-3 text-xs">
          {[
            { condition: 'Hypertension (High BP)', count: 642, pct: '64.2%' },
            { condition: 'Type-2 Diabetes Mellitus', count: 485, pct: '48.5%' },
            { condition: 'Osteoarthritis / Mobility Limitation', count: 320, pct: '32.0%' },
            { condition: 'Cataract / Visual Impairment', count: 215, pct: '21.5%' },
            { condition: 'Chronic Kidney Disease (Stage 1-2)', count: 78, pct: '7.8%' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between font-semibold text-[var(--text)]">
                <span>{item.condition}</span>
                <span className="tabular-nums">{item.count} elders ({item.pct})</span>
              </div>
              <div className="w-full bg-[var(--surface-subtle)] h-2 rounded overflow-hidden">
                <div className="bg-[var(--accent)] h-full rounded" style={{ width: item.pct }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
