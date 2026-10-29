import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ExportsPage: React.FC = () => {
  const [dataset, setDataset] = useState('seniors');
  const [maskPii, setMaskPii] = useState(true);
  const [exported, setExported] = useState(false);

  const handleDownload = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/reports" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Data exports</span>
      </div>

      <PageHeader
        title="Governed data export centre"
        subtitle="Extract anonymised CSV datasets for academic research, health audits, and compliance"
      />

      <Card title="Export configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Select dataset</label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
            >
              <option value="seniors">Senior Citizen Demographics & Baseline Health</option>
              <option value="attendance">Session Attendance Roster & Heatmap Data</option>
              <option value="vitals">Clinical Biomarker Logs (BP & Glucose)</option>
              <option value="sos">Emergency SOS Incident & Escalation Log</option>
              <option value="feedback">Participant Feedback & NPS Survey Results</option>
            </select>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border flex items-start gap-3">
            <input
              type="checkbox"
              id="maskPii"
              checked={maskPii}
              onChange={(e) => setMaskPii(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-[var(--accent)]"
            />
            <label htmlFor="maskPii" className="text-xs text-text">
              <strong className="block font-semibold">Enforce PII Masking (Recommended)</strong>
              Masks direct identifiers (phone numbers, full addresses, next-of-kin names) per DPDP Act standards.
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            {exported && <span className="text-xs text-positive font-semibold">CSV export generated and downloaded!</span>}
            <Button variant="primary" onClick={handleDownload} icon={<Download size={16} />}>
              Generate & download CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

