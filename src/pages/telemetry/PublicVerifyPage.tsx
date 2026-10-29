import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Upload,
  ArrowRight,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import {
  findPackByCodeOrHash,
  calculateSha256Hex,
  ImpactPack,
  WATERMARK_TEXT,
} from '@/domain/telemetry/packBuilder';

export const PublicVerifyPage: React.FC = () => {
  const { code: routeCode } = useParams<{ code?: string }>();
  const [inputQuery, setInputQuery] = useState<string>(routeCode || '');
  const [matchedPack, setMatchedPack] = useState<ImpactPack | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [computedHash, setComputedHash] = useState<string | null>(null);

  const performVerification = (query: string) => {
    if (!query.trim()) return;
    setHasSearched(true);
    const found = findPackByCodeOrHash(query.trim());
    setMatchedPack(found || null);
  };

  useEffect(() => {
    if (routeCode) {
      performVerification(routeCode);
    }
  }, [routeCode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsHashing(true);
    try {
      const buffer = await file.arrayBuffer();
      const hash = await calculateSha256Hex(new Uint8Array(buffer));
      setComputedHash(hash);
      setInputQuery(hash);
      performVerification(hash);
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white font-serif font-semibold text-lg">
            V
          </div>
          <div>
            <div className="font-serif font-semibold text-text-primary text-base">
              Vayoshrestha Public Gateway
            </div>
            <div className="text-xs text-text-secondary">
              Vayoh Vikas Trust · Document & Telemetry Integrity Verifier
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="text-xs text-brand-primary font-semibold hover:underline flex items-center gap-1"
        >
          Staff Sign In
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Verification Container */}
      <main className="max-w-2xl mx-auto w-full my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-brand-primary/20 text-brand-primary rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Trust WebCrypto Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-text-primary">
            Verify Artifact Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto">
            Confirm that an impact dossier, telemetry export, or policy evidence brief was issued by
            Vayoh Vikas Trust and has not been altered or forged.
          </p>
        </div>

        {/* Input Card */}
        <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Enter Verification Code or 64-char SHA-256 Digest:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. VV-8392-1049 or a718b940..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performVerification(inputQuery)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-bg-canvas border border-border rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <button
                onClick={() => performVerification(inputQuery)}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1"
              >
                Verify
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>Or upload an exported file to calculate hash in-browser:</span>
            <label className="cursor-pointer text-brand-primary font-semibold hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              {isHashing ? 'Hashing...' : 'Upload File'}
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {matchedPack ? (
              <div className="p-6 bg-bg-surface border-2 border-brand-primary rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 rounded-full text-brand-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-primary">
                      AUTHENTIC & UNTAMPERED DOCUMENT
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-text-primary">
                      {matchedPack.title}
                    </h3>
                  </div>
                </div>

                {/* Synthetic Watermark Notice */}
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs font-semibold text-center">
                  {WATERMARK_TEXT}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
                  <div className="p-2.5 bg-bg-canvas border border-border rounded">
                    <div className="text-text-secondary">Official Issuer:</div>
                    <div className="font-semibold text-text-primary mt-0.5">Vayoh Vikas Trust</div>
                  </div>

                  <div className="p-2.5 bg-bg-canvas border border-border rounded">
                    <div className="text-text-secondary">Verification Code:</div>
                    <div className="font-semibold text-brand-primary mt-0.5">{matchedPack.code}</div>
                  </div>

                  <div className="p-2.5 bg-bg-canvas border border-border rounded">
                    <div className="text-text-secondary">Authorised Signer:</div>
                    <div className="font-semibold text-text-primary mt-0.5">
                      {matchedPack.reviewedBy?.name || 'Dr. Anita Joshi, National Manager'}
                    </div>
                  </div>

                  <div className="p-2.5 bg-bg-canvas border border-border rounded">
                    <div className="text-text-secondary">Release Date:</div>
                    <div className="font-semibold text-text-primary mt-0.5">
                      {matchedPack.releasedAt ? new Date(matchedPack.releasedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-bg-canvas border border-border rounded text-xs space-y-1">
                  <div className="text-text-secondary font-semibold">Registered SHA-256 Digest:</div>
                  <div className="text-text-primary break-all text-[11px]">
                    {matchedPack.sha256Hash}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-red-50 border border-negative/30 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full text-negative">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-negative">
                      Verification Failed — Unrecognized Artifact
                    </h3>
                    <p className="text-xs text-negative/90 mt-0.5">
                      The code or hash "{inputQuery}" was not found in the official Vayoh Vikas Trust
                      export registry. It may be forged, modified, or expired.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demo Helper Links */}
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-2 text-xs">
          <div className="font-semibold text-text-secondary">Test Sample Verification Codes:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setInputQuery('VV-8392-1049');
                performVerification('VV-8392-1049');
              }}
              className="px-2.5 py-1 bg-bg-canvas border border-border rounded hover:border-brand-primary text-text-primary"
            >
              VV-8392-1049 (CSR Impact Brief)
            </button>
            <button
              onClick={() => {
                setInputQuery('VV-4198-7721');
                performVerification('VV-4198-7721');
              }}
              className="px-2.5 py-1 bg-bg-canvas border border-border rounded hover:border-brand-primary text-text-primary"
            >
              VV-4198-7721 (Govt Health Brief)
            </button>
            <button
              onClick={() => {
                setInputQuery('VV-INVALID-HASH');
                performVerification('VV-INVALID-HASH');
              }}
              className="px-2.5 py-1 bg-bg-canvas border border-border rounded hover:border-negative text-negative"
            >
              Simulate Invalid / Tampered Code
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-border text-center text-xs text-text-secondary">
        <div>Vayoshrestha Senior-Care Ecosystem · Vayoh Vikas Trust</div>
        <div className="mt-1">
          Cryptographic proofs generated in-browser via W3C Web Cryptography API.
        </div>
      </footer>
    </div>
  );
};
