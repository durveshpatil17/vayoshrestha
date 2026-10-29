import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Building2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const CsrReportBuilderPage: React.FC = () => {
  const [donor, setDonor] = useState('Tata Trusts');
  const [cycle, setCycle] = useState('Q3-Q4 FY 2026-27');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/reports" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">CSR reporting</span>
      </div>

      <PageHeader
        title="CSR donor compliance report builder"
        subtitle="Schedule VII Companies Act compliant audit reports for corporate donors"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
              Print report
            </Button>
            <Button variant="primary" size="sm" icon={<Download size={14} />}>
              Download signed PDF
            </Button>
          </div>
        }
      />

      <Card title="Report parameters">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Donor organization</label>
            <select
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="Tata Trusts">Tata Trusts (Elder Wellbeing Initiative)</option>
              <option value="Infosys Foundation">Infosys Foundation (Aarogya Track)</option>
              <option value="Azim Premji Philanthropic Initiatives">Azim Premji Philanthropic Initiatives</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Reporting cycle</label>
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="Q3-Q4 FY 2026-27">Q3-Q4 FY 2026-27 (Pilot Phase)</option>
              <option value="Q1-Q2 FY 2026-27">Q1-Q2 FY 2026-27</option>
              <option value="Full Year FY 2026-27">Full Year FY 2026-27</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Generated Report Preview (Printable) */}
      <div className="p-8 rounded-xl bg-surface border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-start justify-between">
          <div>
            <span className="text-xs text-text-secondary font-semibold block">Vayoh Vikas NGO</span>
            <h2 className="text-xl font-semibold text-text mt-1">CSR Impact & Milestone Compliance Report</h2>
            <div className="text-xs text-text-secondary mt-0.5">
              Grantee: <strong>Vayoh Vikas</strong> • Donor: <strong>{donor}</strong> • Period: <strong>{cycle}</strong>
            </div>
          </div>
          <div className="text-right text-xs text-text-secondary">
            <div>Date Generated: <strong>28 Oct 2026</strong></div>
            <div>Report Ref: <strong className="tabular-nums">CSR-VV-2026-Q4</strong></div>
          </div>
        </div>

        {/* Milestone Table */}
        <div>
          <h3 className="text-sm font-semibold text-text mb-3">Key Grant Milestones & Achievements</h3>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="py-2 font-semibold">Grant Milestone</th>
                <th className="py-2 font-semibold">Target</th>
                <th className="py-2 font-semibold">Delivered</th>
                <th className="py-2 font-semibold">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              <tr>
                <td className="py-2.5 font-semibold text-text">Senior Citizens Enrolled & Screened</td>
                <td className="py-2.5 tabular-nums">1,000 elders</td>
                <td className="py-2.5 tabular-nums font-semibold text-positive">1,000 elders</td>
                <td className="py-2.5 text-positive font-semibold">100% Achieved</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-text">Active Ekta Hub Chapters Operational</td>
                <td className="py-2.5 tabular-nums">4 hubs</td>
                <td className="py-2.5 tabular-nums font-semibold text-positive">4 hubs</td>
                <td className="py-2.5 text-positive font-semibold">100% Achieved</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-text">Average Session Retention Rate</td>
                <td className="py-2.5 tabular-nums">&gt; 80%</td>
                <td className="py-2.5 tabular-nums font-semibold text-positive">91.4%</td>
                <td className="py-2.5 text-positive font-semibold">Exceeded (+11.4%)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-text">Emergency SOS Median SLA Response</td>
                <td className="py-2.5 tabular-nums">&lt; 120 seconds</td>
                <td className="py-2.5 tabular-nums font-semibold text-positive">84 seconds</td>
                <td className="py-2.5 text-positive font-semibold">Compliant</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-text">Budget Deployed (INR)</td>
                <td className="py-2.5 tabular-nums">₹ 45,00,000</td>
                <td className="py-2.5 tabular-nums font-semibold">₹ 42,80,000</td>
                <td className="py-2.5 text-positive font-semibold">95.1% Utilised</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-text-secondary">
          <div>Verified by: <strong>Vandana Sharma (NGO Management)</strong></div>
          <div>Independent Auditor Sign-off: <strong>M/s Joshi & Deshpande LLP</strong></div>
        </div>
      </div>
    </div>
  );
};
