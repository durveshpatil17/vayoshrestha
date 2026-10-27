import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockStore } from '@/mock/store';
import { Award, CheckCircle2, HeartPulse, Clock } from 'lucide-react';

export const OutcomesReportPage: React.FC = () => {
  const data = mockStore.getData();

  const totalReferrals = data.referrals.length;
  const closedReferrals = data.referrals.filter((r) => r.status === 'Closed').length;
  const totalEscalations = data.escalations.length;
  const resolvedEscalations = data.escalations.filter((e) => e.status === 'Resolved' || e.status === 'Closed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Community Care & Referral Outcomes"
        description="Resolution velocity, clinical triage handover completion, and partner service outcomes (FR-47)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Care Outcomes' },
        ]}
      />

      {/* Headline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Referrals Generated</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{totalReferrals}</div>
          <div className="text-xs text-text-muted mt-0.5">Assigned to approved partners</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Closed-Loop Referral Resolution</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">
            {Math.round((closedReferrals / totalReferrals) * 100)}%
          </div>
          <div className="text-xs text-text-muted mt-0.5">{closedReferrals} documented completions</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Distress Escalations Resolved</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">
            {resolvedEscalations} / {totalEscalations}
          </div>
          <div className="text-xs text-text-muted mt-0.5">Clinical specialist handovers</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">SLA Compliance Fidelity</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">96.8%</div>
          <div className="text-xs text-text-muted mt-0.5">Within assigned response window</div>
        </div>
      </div>

      {/* Outcome Breakdown Table */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
        <h4 className="font-serif text-sm font-semibold text-text-primary">Referral Outcomes by Specialty</h4>

        <table className="w-full text-left text-xs">
          <thead className="bg-bg-subtle text-text-muted font-medium border-b border-border-hairline">
            <tr>
              <th className="py-2.5 px-4">Partner Specialty</th>
              <th className="py-2.5 px-4">Total Referred</th>
              <th className="py-2.5 px-4">Resolved Successfully</th>
              <th className="py-2.5 px-4">Average Resolution Days</th>
              <th className="py-2.5 px-4 text-right">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary">
            <tr className="hover:bg-bg-subtle/50">
              <td className="py-2.5 px-4 font-medium">Geriatric Clinics & Assessment</td>
              <td className="py-2.5 px-4">120</td>
              <td className="py-2.5 px-4">112</td>
              <td className="py-2.5 px-4 text-text-muted">3.4 Days</td>
              <td className="py-2.5 px-4 text-right font-semibold text-accent">93%</td>
            </tr>
            <tr className="hover:bg-bg-subtle/50">
              <td className="py-2.5 px-4 font-medium">Eye Care & Cataract Triage</td>
              <td className="py-2.5 px-4">85</td>
              <td className="py-2.5 px-4">81</td>
              <td className="py-2.5 px-4 text-text-muted">4.1 Days</td>
              <td className="py-2.5 px-4 text-right font-semibold text-accent">95%</td>
            </tr>
            <tr className="hover:bg-bg-subtle/50">
              <td className="py-2.5 px-4 font-medium">Physiotherapy & Mobility</td>
              <td className="py-2.5 px-4">95</td>
              <td className="py-2.5 px-4">88</td>
              <td className="py-2.5 px-4 text-text-muted">2.8 Days</td>
              <td className="py-2.5 px-4 text-right font-semibold text-accent">92%</td>
            </tr>
            <tr className="hover:bg-bg-subtle/50">
              <td className="py-2.5 px-4 font-medium">Legal Aid & Pension Helpdesk</td>
              <td className="py-2.5 px-4">50</td>
              <td className="py-2.5 px-4">44</td>
              <td className="py-2.5 px-4 text-text-muted">6.5 Days</td>
              <td className="py-2.5 px-4 text-right font-semibold text-accent">88%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
