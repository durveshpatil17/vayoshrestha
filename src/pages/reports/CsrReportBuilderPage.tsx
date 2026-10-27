import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { FileText, Plus, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

export interface CsrReport {
  id: string;
  title: string;
  period: string;
  centres: string[];
  totalSeniorBeneficiaries: number;
  femaleTurnoutPct: number;
  totalSessionMarks: number;
  status: 'Draft' | 'Released';
  releasedBy?: string;
  releasedAt?: string;
  narrative: string;
}

export const CsrReportBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [reports, setReports] = useState<CsrReport[]>([
    {
      id: 'csr-q3-2026',
      title: 'Vayoshrestha Q3 2026 Pilot Milestone & Impact Report',
      period: 'August 1 – October 25, 2026',
      centres: ['ALL (6 Ekta Hubs)'],
      totalSeniorBeneficiaries: 1000,
      femaleTurnoutPct: 58,
      totalSessionMarks: 3240,
      status: 'Released',
      releasedBy: 'Vikramaditya Rao (NM)',
      releasedAt: '2026-10-26T14:00:00Z',
      narrative: 'Across the 90-day pilot timeframe, Vayoshrestha established active senior engagement across 6 hubs with 100% target registration.',
    },
    {
      id: 'csr-pune-oct-2026',
      title: 'Pune & Nashik Model Cluster Mid-Pilot Report',
      period: 'October 1 – October 27, 2026',
      centres: ['HUB-PUN', 'HUB-NSK'],
      totalSeniorBeneficiaries: 380,
      femaleTurnoutPct: 61,
      totalSessionMarks: 1150,
      status: 'Draft',
      narrative: 'Targeted focus on mobility circles and digital banking fraud awareness.',
    },
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [period, setPeriod] = useState('October 2026');
  const [narrative, setNarrative] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: CsrReport = {
      id: `csr-${Date.now()}`,
      title: reportTitle,
      period,
      centres: ['ALL (6 Ekta Hubs)'],
      totalSeniorBeneficiaries: 1000,
      femaleTurnoutPct: 58,
      totalSessionMarks: 3240,
      status: 'Draft',
      narrative,
    };

    setReports([newReport, ...reports]);
    setShowNewModal(false);
    setReportTitle('');
    setNarrative('');

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Programme Manager',
      'PM',
      'CREATE',
      'CsrReport',
      newReport.id,
      `Drafted CSR impact report: ${reportTitle}`,
      null,
      newReport,
      undefined
    );
  };

  const handleReleaseReport = (reportId: string) => {
    if (user?.role !== 'NM') {
      alert('Only NGO Management (NM) has governance authority to release CSR donor reports.');
      return;
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'Released',
              releasedBy: user.fullName,
              releasedAt: new Date().toISOString(),
            }
          : r
      )
    );

    mockStore.writeAudit(
      user.id,
      user.fullName,
      'NM',
      'APPROVE',
      'CsrReport',
      reportId,
      'Formally approved and released CSR Donor Impact Report',
      { status: 'Draft' },
      { status: 'Released' },
      undefined
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="CSR & Donor Aggregate Reports"
        description="Governed aggregate impact summaries with small-number suppression (<5) and NM release authorization (FR-48)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'CSR Reports' },
        ]}
        actions={
          <Can capability="csrReports" action="create">
            <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Draft New CSR Report
            </Button>
          </Can>
        }
      />

      {/* Small Number Suppression & Privacy Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Differential Privacy & Small-Number Suppression (FR-48):</strong> In accordance with DPDP regulations,
          all released donor reports strictly exclude personal identifiability. Any cohort aggregate with fewer than 5 individuals is reported as
          <span className="font-mono font-semibold text-text-primary"> "&lt;5"</span> to prevent re-identification through demographic deduction.
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 hover:border-border-strong transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-border-hairline pb-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-text-primary">{r.title}</h3>
                <div className="text-xs text-text-muted mt-0.5 font-mono">
                  Reporting Window: {r.period} • Scope: {r.centres.join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  label={r.status}
                  variant={r.status === 'Released' ? 'active' : 'warning'}
                />

                {r.status === 'Draft' && user?.role === 'NM' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReleaseReport(r.id)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Authorize & Release to Donors
                  </Button>
                )}

                <Link to={`/reports/csr/${r.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    View Print-Ready Layout
                  </Button>
                </Link>
              </div>
            </div>

            {/* Headline Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 text-xs bg-bg-subtle p-3 rounded border border-border-hairline">
              <div>
                <span className="text-text-muted block">Total Senior Beneficiaries</span>
                <span className="font-bold text-base text-text-primary">{r.totalSeniorBeneficiaries}</span>
              </div>
              <div>
                <span className="text-text-muted block">Female Senior Turnout</span>
                <span className="font-bold text-base text-accent">{r.femaleTurnoutPct}%</span>
              </div>
              <div>
                <span className="text-text-muted block">Total Attendance Marks</span>
                <span className="font-bold text-base text-text-primary">{r.totalSessionMarks}</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {r.narrative}
            </p>

            {r.releasedAt && (
              <div className="text-[11px] text-text-muted pt-2 border-t border-border-hairline">
                Released by {r.releasedBy} on {r.releasedAt.split('T')[0]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Draft Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Draft CSR Donor Impact Report</h3>
              <button onClick={() => setShowNewModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="font-medium text-text-primary block mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 2026 Senior Citizen Engagement Outcome Brief"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="font-medium text-text-primary block mb-1">Reporting Period</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 August - 31 October 2026"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="font-medium text-text-primary block mb-1">Executive Summary Narrative</label>
                <textarea
                  rows={4}
                  required
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Summarize key qualitative achievements, volunteer impact, and community testimonials..."
                  className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" disabled={!reportTitle || !narrative}>
                  Save Draft Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
