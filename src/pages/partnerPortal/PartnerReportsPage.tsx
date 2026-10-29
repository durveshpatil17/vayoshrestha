import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const PartnerReportsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/partner/home" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Partner portal
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Reports</span>
      </div>

      <PageHeader
        title="Partner impact & referral reports"
        subtitle="Monthly consultation logs and outcome audit packages for Vayoh Vikas leadership"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export PDF summary
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Completed consultations</span>
          <span className="text-2xl font-semibold text-positive tabular-nums">42</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Average SLA response time</span>
          <span className="text-2xl font-semibold text-text tabular-nums">18.4 hrs</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Patient satisfaction</span>
          <span className="text-2xl font-semibold text-accent tabular-nums">4.9 / 5.0</span>
        </div>
      </div>

      <Card title="Monthly report submissions">
        <div className="divide-y divide-[var(--border-subtle)] text-xs">
          {[
            { month: 'October 2026', cases: 14, submittedAt: '28 Oct 2026', status: 'Generated' },
            { month: 'September 2026', cases: 18, submittedAt: '30 Sep 2026', status: 'Approved' },
            { month: 'August 2026', cases: 10, submittedAt: '31 Aug 2026', status: 'Approved' },
          ].map((rep, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-text">{rep.month} Consultation Log</span>
                <div className="text-text-secondary mt-0.5">
                  {rep.cases} cases fulfilled • Submitted on {rep.submittedAt}
                </div>
              </div>
              <Button size="sm" variant="outline" icon={<Download size={13} />}>
                Download report
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

