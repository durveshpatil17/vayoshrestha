import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  FileCheck2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getImpactPacks, ImpactPack, PackStatus } from '@/domain/telemetry/packBuilder';

export const ImpactPacksPage: React.FC = () => {
  const [packs] = useState<ImpactPack[]>(() => getImpactPacks());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPacks = packs.filter((pack) => {
    if (statusFilter !== 'all' && pack.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        pack.title.toLowerCase().includes(q) ||
        pack.code.toLowerCase().includes(q) ||
        pack.audience.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const releasedCount = packs.filter((p) => p.status === 'released').length;
  const draftCount = packs.filter((p) => p.status === 'draft').length;
  const reviewCount = packs.filter((p) => p.status === 'under_review').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Impact Packs & Policy Evidence"
        subtitle="Tamper-evident, cryptographically sealed impact dossiers for CSR donors, government bodies, and insurers."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Telemetry', href: '/telemetry' },
          { label: 'Impact Packs' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/telemetry/exports"
              className="px-3 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-bg-canvas flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4 text-brand-primary" />
              Export Registry
            </Link>
            <Link
              to="/telemetry/packs/new"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Impact Pack
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Total Dossiers</div>
          <div className="text-2xl font-serif font-semibold text-text-primary">{packs.length}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-brand-primary" />
            4 Active Templates
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Cryptographically Released</div>
          <div className="text-2xl font-serif font-semibold text-brand-primary">{releasedCount}</div>
          <div className="text-xs text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            SHA-256 WebCrypto Sealed
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">In Review (Maker-Checker)</div>
          <div className="text-2xl font-serif font-semibold text-amber-700">{reviewCount}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            NM Sign-off Pending
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-medium">Working Drafts</div>
          <div className="text-2xl font-serif font-semibold text-text-primary">{draftCount}</div>
          <div className="text-xs text-text-secondary">PM Working Copies</div>
        </div>
      </div>

      {/* Synthetic Watermark Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
        <span className="font-semibold">
          Notice: All exported impact packs carry the tamper-evident watermark "SYNTHETIC PILOT DATA · FOR EVALUATION ONLY · VAYOH VIKAS".
        </span>
        <Link to="/verify" className="text-brand-primary font-semibold flex items-center gap-1 hover:underline">
          Open Public Verification Gateway
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, title, audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-bg-canvas border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="released">Released (Sealed)</option>
            <option value="under_review">Under Review</option>
            <option value="draft">Draft</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Table of Packs */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-canvas text-text-secondary border-b border-border">
              <tr>
                <th className="p-3.5 font-semibold">Verification Code</th>
                <th className="p-3.5 font-semibold">Pack Title</th>
                <th className="p-3.5 font-semibold">Audience</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Creator</th>
                <th className="p-3.5 font-semibold">SHA-256 Digest</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPacks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No impact packs match your filters.
                  </td>
                </tr>
              ) : (
                filteredPacks.map((pack) => (
                  <tr key={pack.id} className="hover:bg-bg-canvas/50 transition-colors">
                    <td className="p-3.5 font-semibold text-brand-primary">
                      <Link to={`/telemetry/packs/${pack.id}`} className="hover:underline">
                        {pack.code}
                      </Link>
                    </td>
                    <td className="p-3.5 font-semibold text-text-primary max-w-xs truncate">
                      {pack.title}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-bg-canvas border border-border rounded text-text-secondary">
                        {pack.audience}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {pack.status === 'released' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                          <CheckCircle2 className="w-3 h-3 text-brand-primary" />
                          Released
                        </span>
                      )}
                      {pack.status === 'under_review' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-medium">
                          <Clock className="w-3 h-3" />
                          Under Review
                        </span>
                      )}
                      {pack.status === 'draft' && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-text-secondary">
                      {pack.createdBy.name}
                    </td>
                    <td className="p-3.5 text-text-secondary max-w-[140px] truncate">
                      {pack.sha256Hash ? (
                        <span title={pack.sha256Hash} className="text-text-primary">
                          {pack.sha256Hash.substring(0, 16)}...
                        </span>
                      ) : (
                        <span className="text-text-secondary italic">Pending release</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        to={`/telemetry/packs/${pack.id}`}
                        className="text-brand-primary hover:underline font-semibold"
                      >
                        Open
                      </Link>
                      {pack.status === 'released' && (
                        <Link
                          to={`/verify/${pack.code}`}
                          className="text-text-secondary hover:text-text-primary hover:underline"
                        >
                          Verify
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
