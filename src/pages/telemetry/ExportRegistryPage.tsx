import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getImpactPacks } from '@/domain/telemetry/packBuilder';

interface ExportRecord {
  id: string;
  code: string;
  title: string;
  format: 'PDF Dossier' | 'Aggregated CSV' | 'JSON Digest';
  targetAudience: string;
  cohortSize: number;
  sha256Hash: string;
  releasedAt: string;
  releasedBy: string;
}

export const ExportRegistryPage: React.FC = () => {
  const packs = getImpactPacks().filter((p) => p.status === 'released');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const exportRecords: ExportRecord[] = [
    ...packs.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      format: 'PDF Dossier' as const,
      targetAudience: p.audience,
      cohortSize: (p.metrics.activeSeniorsReached || p.metrics.screenedCohortSize || 1000) as number,
      sha256Hash: p.sha256Hash || '',
      releasedAt: p.releasedAt || p.createdAt,
      releasedBy: p.reviewedBy?.name || 'Dr. Anita Joshi',
    })),
    {
      id: 'exp-csv-01',
      code: 'VV-CSV-2026-Q3',
      title: 'Q3 2026 Chapter Aggregate CSV (k ≥ 5)',
      format: 'Aggregated CSV',
      targetAudience: 'Research',
      cohortSize: 2450,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      releasedAt: '2026-10-05T09:15:00Z',
      releasedBy: 'Dr. Anita Joshi',
    },
    {
      id: 'exp-json-02',
      code: 'VV-JSON-2026-BP',
      title: '90-Day Blood Pressure Stabilisation Digest',
      format: 'JSON Digest',
      targetAudience: 'Government',
      cohortSize: 1105,
      sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      releasedAt: '2026-10-12T14:40:00Z',
      releasedBy: 'Dr. Anita Joshi',
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = exportRecords.filter((rec) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rec.code.toLowerCase().includes(q) ||
        rec.title.toLowerCase().includes(q) ||
        rec.targetAudience.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telemetry Export & Hash Registry"
        subtitle="Public immutable audit registry of all cryptographically sealed reports, dossiers, and anonymised extracts."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Telemetry', href: '/telemetry' },
          { label: 'Export Registry' },
        ]}
        actions={
          <Link
            to="/telemetry/packs"
            className="px-3 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            Manage Impact Packs
          </Link>
        }
      />

      {/* Summary Banner */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-brand-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">
              Cryptographic Integrity Verification
            </div>
            <div className="text-xs text-text-secondary mt-0.5">
              Every released artifact is hashed using SHA-256. Recipients can independently verify authenticity via the public gateway.
            </div>
          </div>
        </div>
        <Link
          to="/verify"
          className="text-xs text-brand-primary font-semibold flex items-center gap-1 hover:underline"
        >
          Verify an Export
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, title, audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="text-xs text-text-secondary">
          Showing {filtered.length} released exports
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-canvas text-text-secondary border-b border-border">
              <tr>
                <th className="p-3.5 font-semibold">Verification Code</th>
                <th className="p-3.5 font-semibold">Artifact Title</th>
                <th className="p-3.5 font-semibold">Format</th>
                <th className="p-3.5 font-semibold">Audience</th>
                <th className="p-3.5 font-semibold">Signer</th>
                <th className="p-3.5 font-semibold">SHA-256 Digest</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-bg-canvas/50 transition-colors">
                  <td className="p-3.5 font-semibold text-brand-primary">
                    <Link to={`/verify/${item.code}`} className="hover:underline">
                      {item.code}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold text-text-primary max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="p-3.5 text-text-secondary">{item.format}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-bg-canvas border border-border rounded text-text-secondary">
                      {item.targetAudience}
                    </span>
                  </td>
                  <td className="p-3.5 text-text-secondary">{item.releasedBy}</td>
                  <td className="p-3.5 text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-primary text-[11px]" title={item.sha256Hash}>
                        {item.sha256Hash.substring(0, 14)}...
                      </span>
                      <button
                        onClick={() => handleCopy(item.id, item.sha256Hash)}
                        className="text-text-secondary hover:text-brand-primary"
                        title="Copy SHA-256 hash"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-brand-primary" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <Link
                      to={`/verify/${item.code}`}
                      className="text-brand-primary hover:underline font-semibold"
                    >
                      Verify
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
