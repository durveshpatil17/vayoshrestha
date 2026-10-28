import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Building2, BookOpen, Users, Calendar, Award, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ReportsOverviewPage: React.FC = () => {
  const sections = [
    {
      to: '/reports/pilot',
      icon: <Award size={20} className="text-[var(--accent)]" />,
      title: 'Pilot success scorecard',
      desc: 'Master evaluation dashboard against v3 core pilot milestones and SLAs.',
    },
    {
      to: '/reports/csr',
      icon: <FileSpreadsheet size={20} className="text-[var(--accent)]" />,
      title: 'CSR donor reporting',
      desc: 'Audit-ready CSR compliance packages for Tata Trusts, Infosys Foundation, and corporate partners.',
    },
    {
      to: '/reports/chapters',
      icon: <Building2 size={20} className="text-[var(--accent)]" />,
      title: 'Chapter performance reports',
      desc: 'Comparative throughput, volunteer-to-senior ratios, and Ekta Hub operational metrics.',
    },
    {
      to: '/reports/programmes',
      icon: <BookOpen size={20} className="text-[var(--accent)]" />,
      title: 'Programme efficacy & impact',
      desc: 'Curriculum completion rates, attendance retention, and elder skill acquisition.',
    },
    {
      to: '/reports/seniors',
      icon: <Users size={20} className="text-[var(--accent)]" />,
      title: 'Demographics & senior health trends',
      desc: 'Chronic disease prevalence, age band distributions, and vulnerability cohorts.',
    },
    {
      to: '/reports/attendance',
      icon: <Calendar size={20} className="text-[var(--accent)]" />,
      title: 'Attendance & engagement analysis',
      desc: 'Monthly participation frequency, drop-out risk rates, and walk-in ratios.',
    },
    {
      to: '/reports/outcomes',
      icon: <BarChart3 size={20} className="text-[var(--accent)]" />,
      title: 'Health outcome improvements',
      desc: 'Average blood pressure reductions, medication compliance scores, and SOS response times.',
    },
    {
      to: '/reports/exports',
      icon: <FileSpreadsheet size={20} className="text-[var(--accent)]" />,
      title: 'Data exports & raw CSVs',
      desc: 'Governed export center with PII masking options for research and audit.',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & analytics console"
        subtitle="Comprehensive operational, clinical, and donor governance analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => (
          <Link
            key={sec.to}
            to={sec.to}
            className="p-5 rounded-lg bg-surface border border-[var(--border)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-2.5 rounded bg-[var(--surface-subtle)] w-fit mb-3">
                {sec.icon}
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] font-sans mb-1">{sec.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sec.desc}</p>
            </div>
            <div className="pt-4 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>Open report</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

