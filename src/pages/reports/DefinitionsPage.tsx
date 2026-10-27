import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DefinitionsPage: React.FC = () => {
  const definitions = [
    {
      term: 'Registered Senior Citizen',
      canonical: 'A senior citizen aged 60 and above who possesses a validated, unique Vayoshrestha membership ID (e.g. VV-PUN-26-00042) on file.',
      rule: 'Count of all SeniorCitizen records with status != Suspended.',
      example: 'Kamala Deshpande has a profile created on 10 Aug 2026. She is counted as Registered.',
    },
    {
      term: 'Active Member',
      canonical: 'A registered senior citizen who has attended at least one programme session in the last 30 calendar days (rolling window configurable in Admin Settings).',
      rule: 'SeniorCitizen with isActive == true (computed by attendance timestamp within 30 days).',
      example: 'Senior attended gentle yoga 12 days ago: Active. Senior last attended 45 days ago: Inactive (Drop-off list).',
    },
    {
      term: 'Participant',
      canonical: 'A registered senior citizen who attended at least one programme session within the specifically selected reporting period filter.',
      rule: 'Distinct count of memberIds appearing in attendance records between Period Start and Period End.',
      example: 'In the month of September, Mohan attended 3 sessions. He counts as 1 Participant for September.',
    },
    {
      term: 'Total Attendance',
      canonical: 'The cumulative count of physical attendance marks recorded across all sessions and hubs in the selected period.',
      rule: 'Count of AttendanceRecord entries where status == "Present".',
      example: 'If 20 elders attend Monday yoga and 15 elders attend Friday yoga, Total Attendance = 35 marks.',
    },
    {
      term: 'Unique Participants',
      canonical: 'The count of distinct individual human senior citizens who attended at least one session in the selected period.',
      rule: 'Unique Set size of memberIds who have at least one "Present" mark.',
      example: 'If the same 15 elders attended both Monday and Friday, Total Attendance = 30, but Unique Participants = 15.',
    },
    {
      term: 'Small-Number Suppression (<5)',
      canonical: 'A strict DPDP statistical disclosure control rule where any aggregate cell with a count between 1 and 4 is replaced with "<5".',
      rule: 'If count > 0 and count < 5, render as "<5" in all CSR/Donor views.',
      example: 'A centre with 3 legal aid cases will display "<5" in donor reports to prevent re-identifying individuals.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Institutional Measurement Definitions & Standards"
        description="Canonical mathematical definitions governing all dashboards, charts, and donor reports (Section 1 Source of Truth)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Metric Definitions' },
        ]}
      />

      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Cardinal Rule:</strong> Total Attendance and Unique Participants must never be mixed up
          in any chart or report label. Every indicator in Vayoshrestha strictly computes against these canonical definitions.
        </div>
      </div>

      <div className="space-y-4">
        {definitions.map((def) => (
          <div
            key={def.term}
            className="bg-bg-base border border-border-hairline rounded p-5 space-y-3 hover:border-border-strong transition-all shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <h3 className="font-serif text-base font-bold text-text-primary">{def.term}</h3>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-bg-subtle text-accent rounded font-medium">
                Standard Metric
              </span>
            </div>

            <p className="text-xs text-text-primary leading-relaxed">
              <strong>Definition:</strong> {def.canonical}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-bg-subtle p-3 rounded border border-border-hairline">
              <div>
                <span className="text-text-muted block font-medium">Computation Logic:</span>
                <span className="font-mono text-[11px] text-text-primary">{def.rule}</span>
              </div>
              <div>
                <span className="text-text-muted block font-medium">Concrete Example:</span>
                <span className="text-text-muted">{def.example}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
