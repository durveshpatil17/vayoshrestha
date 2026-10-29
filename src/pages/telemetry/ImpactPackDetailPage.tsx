import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  ExternalLink,
  Lock,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  getImpactPackById,
  submitPackForReview,
  releaseImpactPack,
  ImpactPack,
  WATERMARK_TEXT,
} from '@/domain/telemetry/packBuilder';
import { useAuthStore } from '@/store/authStore';

export const ImpactPackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [pack, setPack] = useState<ImpactPack | undefined>(() => (id ? getImpactPackById(id) : undefined));
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPrintView, setShowPrintView] = useState<boolean>(false);

  if (!pack) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-serif font-semibold text-text-primary">Impact Pack Not Found</h2>
        <p className="text-sm text-text-secondary">The requested impact dossier does not exist.</p>
        <Link
          to="/telemetry/packs"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Impact Packs
        </Link>
      </div>
    );
  }

  const handleCopyHash = () => {
    if (pack.sha256Hash) {
      navigator.clipboard.writeText(pack.sha256Hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitForReview = async () => {
    setIsProcessing(true);
    try {
      const updated = await submitPackForReview(pack.id);
      setPack({ ...updated });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRelease = async () => {
    setIsProcessing(true);
    try {
      const updated = await releaseImpactPack(pack.id, {
        id: user?.id || 'usr-nm-1',
        name: user?.name || 'Dr. Anita Joshi',
        role: user?.role || 'NM',
      });
      setPack({ ...updated });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={pack.title}
        subtitle={`Verification Code: ${pack.code} · Scoped for ${pack.audience}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Telemetry', href: '/telemetry' },
          { label: 'Impact Packs', href: '/telemetry/packs' },
          { label: pack.code },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {pack.status === 'draft' && (
              <button
                onClick={handleSubmitForReview}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                {isProcessing ? 'Submitting...' : 'Submit for NM Review'}
              </button>
            )}

            {pack.status === 'under_review' && (
              <button
                onClick={handleRelease}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {isProcessing ? 'Sealing...' : 'Approve & Release (Seal SHA-256)'}
              </button>
            )}

            {pack.status === 'released' && (
              <>
                <Link
                  to={`/verify/${pack.code}`}
                  className="px-3 py-2 text-xs font-semibold text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-emerald-50/50 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Public Verification Gateway
                </Link>
                <button
                  onClick={() => setShowPrintView(!showPrintView)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  {showPrintView ? 'Close Print Preview' : 'Printable Dossier'}
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Synthetic Watermark Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-semibold text-center">
        {WATERMARK_TEXT}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dossier Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-brand-primary font-semibold">{pack.audience} Target Evidence</span>
                <h3 className="text-xl font-serif font-semibold text-text-primary mt-1">{pack.title}</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Reporting Period: {pack.dateRange.start} to {pack.dateRange.end} · Chapter: {pack.chapterFilter}
                </p>
              </div>
              <div>
                {pack.status === 'released' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                    Cryptographically Sealed
                  </span>
                )}
                {pack.status === 'under_review' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Under NM Review
                  </span>
                )}
                {pack.status === 'draft' && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    Draft Copy
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-semibold text-text-secondary">Executive Summary</h4>
              <p className="text-xs text-text-primary leading-relaxed mt-1">{pack.summary}</p>
            </div>

            {/* Metrics Table */}
            <div className="pt-3 border-t border-border space-y-3">
              <h4 className="text-xs font-semibold text-text-secondary">Aggregated Telemetry Indicators</h4>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-bg-canvas text-text-secondary border-b border-border">
                    <tr>
                      <th className="p-3 font-semibold">Metric Name</th>
                      <th className="p-3 font-semibold">Reported Value</th>
                      <th className="p-3 font-semibold">Anonymity Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(pack.metrics).map(([key, val]) => (
                      <tr key={key}>
                        <td className="p-3 font-medium text-text-primary capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td className="p-3 font-semibold text-brand-primary">{val}</td>
                        <td className="p-3 text-text-secondary">k ≥ 5 Confirmed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Printable HTML Dossier View */}
          {showPrintView && (
            <div className="p-8 bg-white border-2 border-border rounded-xl space-y-6 relative overflow-hidden text-text-primary print:border-none">
              <div className="text-center border-b pb-4 space-y-1">
                <div className="text-xs text-brand-primary font-semibold">VAYOH VIKAS TRUST · ECOSYSTEM TELEMETRY</div>
                <h2 className="text-xl font-serif font-semibold">{pack.title}</h2>
                <div className="text-xs text-text-secondary">
                  Official Verification ID: {pack.code} · Date: {pack.releasedAt ? new Date(pack.releasedAt).toLocaleDateString() : 'Pending'}
                </div>
              </div>

              <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900 text-center text-xs font-semibold">
                {WATERMARK_TEXT}
              </div>

              <p className="text-xs leading-relaxed">{pack.summary}</p>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-text-secondary">Certified Telemetry Indicators</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(pack.metrics).map(([k, v]) => (
                    <div key={k} className="p-2 border rounded bg-bg-canvas flex justify-between">
                      <span className="capitalize text-text-secondary">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold text-text-primary">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-1 text-xs">
                <div className="font-semibold text-text-primary">Cryptographic Signature (SHA-256 Digest):</div>
                <div className="p-2 bg-bg-canvas border rounded break-all text-[11px] text-text-secondary">
                  {pack.sha256Hash || 'PENDING NATIONAL MANAGER SIGN-OFF'}
                </div>
              </div>

              <div className="pt-2 flex justify-between text-[11px] text-text-secondary">
                <span>Signer: {pack.reviewedBy?.name || 'Dr. Anita Joshi, NM'}</span>
                <span>Verification Gateway: https://vayoshrestha.org/verify/{pack.code}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Cryptographic Seal & Chain of Custody */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              Cryptographic Integrity Seal
            </h3>

            {pack.sha256Hash ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-brand-primary/20 rounded-lg space-y-1.5">
                  <div className="text-[11px] font-semibold text-brand-primary flex items-center justify-between">
                    <span>SHA-256 Digest (Canonical)</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-brand-primary hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-[11px] text-text-primary break-all leading-tight">
                    {pack.sha256Hash}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  This SHA-256 hash was generated via in-browser WebCrypto subtle.digest over the canonical JSON
                  payload. Any subsequent alteration to numbers, dates, or narrative invalidates the seal.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-bg-canvas border border-border rounded-lg text-xs text-text-secondary flex items-center gap-2">
                <Lock className="w-4 h-4 text-text-secondary" />
                <span>SHA-256 seal will be calculated when released by National Manager.</span>
              </div>
            )}
          </div>

          {/* Chain of Custody (Maker-Checker) */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              Chain of Custody
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-border rounded-lg bg-bg-canvas space-y-1">
                <div className="text-text-secondary font-medium">1. Created By (Maker)</div>
                <div className="font-semibold text-text-primary">{pack.createdBy.name}</div>
                <div className="text-text-secondary">{pack.createdBy.role} · {new Date(pack.createdAt).toLocaleString()}</div>
              </div>

              <div className="p-3 border border-border rounded-lg bg-bg-canvas space-y-1">
                <div className="text-text-secondary font-medium">2. Review & Release (Checker)</div>
                {pack.reviewedBy ? (
                  <>
                    <div className="font-semibold text-brand-primary">{pack.reviewedBy.name}</div>
                    <div className="text-text-secondary">
                      {pack.reviewedBy.role} · {pack.releasedAt ? new Date(pack.releasedAt).toLocaleString() : ''}
                    </div>
                  </>
                ) : (
                  <div className="text-amber-800 italic">Pending National Manager approval</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
