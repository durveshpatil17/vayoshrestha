import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { BarChart3, TrendingUp, Users, Calendar, Award, FileSpreadsheet, BookOpen, ArrowRight } from 'lucide-react';

export const ReportDirectoryPage: React.FC = () => {
  const { user } = useAuthStore();

  const reports = [
    {
      title: 'Operations & Management Overview',
      desc: 'Central pilot health, 1,000 senior registration target progress, and operational indicators (FR-43).',
      path: '/reports/overview',
      icon: BarChart3,
      tag: 'Executive',
    },
    {
      title: 'Ekta Hubs & Programme Analytics',
      desc: 'Centre-wise capacity utilization, session completion rates, and programme category popularity (FR-44).',
      path: '/reports/centres',
      icon: TrendingUp,
      tag: 'Centres & Programmes',
    },
    {
      title: 'Senior Citizen Demographics & Cohorts',
      desc: 'Cohort analysis by registration month, age band mix, gender representation, and language preferences (FR-45).',
      path: '/reports/members',
      icon: Users,
      tag: 'Members',
    },
    {
      title: 'Attendance & Repeat Participation',
      desc: 'Total attendance marks vs unique participants, frequency distributions, and weekday turnout (FR-46).',
      path: '/reports/attendance',
      icon: Calendar,
      tag: 'Participation',
    },
    {
      title: 'Community Care & Referral Outcomes',
      desc: 'Closed-loop referral resolutions, feedback theme distribution, and SLA resolution velocity (FR-47).',
      path: '/reports/outcomes',
      icon: Award,
      tag: 'Impact',
    },
    {
      title: 'CSR & Donor Impact Reports',
      desc: 'Governed aggregate reports with small-number suppression (<5) and NM release workflow (FR-48).',
      path: '/reports/csr',
      icon: FileSpreadsheet,
      tag: 'Governance',
    },
    {
      title: 'Audit & Data Exports Directory',
      desc: 'Authorised CSV downloads with mandatory reason logging and PII-stripping (FR-49).',
      path: '/reports/exports',
      icon: FileSpreadsheet,
      tag: 'Compliance',
    },
    {
      title: 'Canonical Metric Definitions',
      desc: 'Institutional glossary defining Registered, Active, Participant, Total vs Unique (Section 1).',
      path: '/reports/definitions',
      icon: BookOpen,
      tag: 'Reference',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Analytics & Reporting Centre"
        description="Audited programme metrics, CSR aggregate impact releases, and canonical performance indicators (FR-43 – FR-49)"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Reports' }]}
        actions={
          <Link to="/reports/definitions">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Metric Definitions
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((rpt) => {
          const Icon = rpt.icon;

          return (
            <div
              key={rpt.path}
              className="bg-bg-base border border-border-hairline rounded p-5 flex flex-col justify-between hover:border-border-strong transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded bg-bg-subtle flex items-center justify-center text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-bg-subtle text-text-muted border border-border-hairline rounded">
                    {rpt.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-semibold text-text-primary">{rpt.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    {rpt.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border-hairline">
                <Link to={rpt.path} className="inline-flex items-center text-xs font-semibold text-accent hover:underline">
                  Open Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
