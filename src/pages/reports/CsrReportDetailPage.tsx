import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { suppressSmallNumber } from '@/domain/masking';
import { Printer, ArrowLeft, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

export const CsrReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:p-0">
      <div className="print:hidden">
        <PageHeader
          title="Print-Ready CSR Donor Report"
          description="Institutional aggregate layout ready for donor presentation and print export"
          breadcrumb={[
            { label: 'Reports', href: '/reports' },
            { label: 'CSR Reports', href: '/reports/csr' },
            { label: 'Print View' },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Link to="/reports/csr">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1.5" />
                Print / Save as PDF
              </Button>
            </div>
          }
        />
      </div>

      {/* Institutional Document Container */}
      <div className="bg-white border border-border-hairline p-8 md:p-12 rounded-lg shadow-sm print:border-none print:shadow-none space-y-8 font-sans text-text-primary">
        {/* Document Header */}
        <div className="border-b-2 border-accent pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="font-serif text-2xl font-bold tracking-tight text-text-primary">
              Vayoh Vikas
            </div>
            <div className="text-sm font-serif text-accent font-semibold">
              Vayoshrestha Digital Senior-Care Ecosystem
            </div>
            <div className="text-xs text-text-muted">
              90-Day Pilot Outcomes Report • Prepared for CSR & Donor Reviewers
            </div>
          </div>

          <div className="text-right text-xs text-text-muted space-y-1">
            <StatusChip label="Officially Released" variant="active" />
            <div>Document Ref: VV-CSR-2026-Q3</div>
            <div>Date: 27 October 2026</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-text-primary">1. Executive Overview</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            The Vayoshrestha pilot was initiated to demonstrate human-centered, digitally enabled senior citizen engagement
            across community-based Ekta Hubs. Across Maharashtra and surrounding regions, the programme has successfully onboarded
            and actively supported vulnerable senior citizens with structured health circles, digital literacy, and community care referrals.
          </p>
        </div>

        {/* Aggregate Indicator Table with Small-Number Suppression */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-text-primary">2. Key Programme Indicators (Aggregates)</h2>
          <table className="w-full text-left text-xs border border-border-hairline">
            <thead className="bg-bg-subtle text-text-muted font-semibold border-b border-border-hairline">
              <tr>
                <th className="py-2.5 px-4">Performance Indicator</th>
                <th className="py-2.5 px-4">Pilot Target</th>
                <th className="py-2.5 px-4 text-right">Achieved Value</th>
                <th className="py-2.5 px-4 text-right">Fidelity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              <tr>
                <td className="py-2.5 px-4 font-medium">Total Registered Senior Citizens</td>
                <td className="py-2.5 px-4">1,000</td>
                <td className="py-2.5 px-4 text-right font-bold">1,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-800 font-semibold">100% Target Met</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Active Senior Attendees (30-Day Window)</td>
                <td className="py-2.5 px-4">700</td>
                <td className="py-2.5 px-4 text-right font-bold">780</td>
                <td className="py-2.5 px-4 text-right text-emerald-800 font-semibold">111% Fidelity</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Cumulative Attendance Marks Recorded</td>
                <td className="py-2.5 px-4">2,500</td>
                <td className="py-2.5 px-4 text-right font-bold">3,240</td>
                <td className="py-2.5 px-4 text-right text-emerald-800 font-semibold">Exceeded Benchmark</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Distinct Unique Individuals Attended</td>
                <td className="py-2.5 px-4">800</td>
                <td className="py-2.5 px-4 text-right font-bold">850</td>
                <td className="py-2.5 px-4 text-right text-emerald-800 font-semibold">High Repeat Reach</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Centres with Specialized Palliative Care Referrals</td>
                <td className="py-2.5 px-4">All</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono">
                  {suppressSmallNumber(3)} {/* Suppressed under <5 rule */}
                </td>
                <td className="py-2.5 px-4 text-right text-text-muted">Small Number Suppressed</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mandatory Definitions Footer (Section 1) */}
        <div className="pt-6 border-t border-border-hairline text-[11px] text-text-muted space-y-1">
          <div className="font-semibold text-text-primary">Institutional Measurement Standards (Section 1):</div>
          <div>• <strong>Registered</strong>: Senior citizen with a validated membership ID record.</div>
          <div>• <strong>Active</strong>: Senior citizen who attended at least one programme session in the last 30 calendar days.</div>
          <div>• <strong>Total Attendance</strong>: Cumulative count of all physical attendance marks.</div>
          <div>• <strong>Unique Participants</strong>: Count of distinct individual seniors who attended at least one session.</div>
          <div>• <strong>Small Number Suppression</strong>: Cohorts under 5 individuals are designated "&lt;5" to uphold privacy.</div>
        </div>

        {/* Verification Sign-Off */}
        <div className="pt-8 border-t border-border-hairline flex justify-between text-xs text-text-muted">
          <div>
            <div>Authorized by: <strong>Vikramaditya Rao</strong></div>
            <div>Title: Executive Director, Vayoh Vikas (NM)</div>
          </div>
          <div className="text-right">
            <div>Cryptographic Verification Hash:</div>
            <div className="font-mono text-[10px]">7f8b91a24d081e79c2934812be4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
