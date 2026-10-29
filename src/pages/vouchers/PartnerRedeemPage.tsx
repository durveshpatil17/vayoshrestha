import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Search,
  DollarSign,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  lookupVoucherByCode,
  redeemVoucher,
  DigitalVoucher,
} from '@/domain/vouchers/voucherEngine';
import { PARTNER_REGISTRY } from '@/domain/routing/engine';

export const PartnerRedeemPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState<string>(initialCode);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('ptn-metropolis');
  const [partnerName, setPartnerName] = useState<string>('Metropolis Diagnostics Lab');

  const [lookupResult, setLookupResult] = useState<{
    validFormat: boolean;
    voucher?: DigitalVoucher;
    error?: string;
  } | null>(null);

  const [redemptionFeedback, setRedemptionFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleLookup = (code: string) => {
    if (!code.trim()) return;
    setRedemptionFeedback(null);
    const result = lookupVoucherByCode(code.trim());
    setLookupResult(result);
  };

  useEffect(() => {
    if (initialCode) {
      handleLookup(initialCode);
    }
  }, [initialCode]);

  const handlePartnerChange = (id: string) => {
    setSelectedPartnerId(id);
    const p = PARTNER_REGISTRY.find((x) => x.id === id);
    if (p) setPartnerName(p.name);
  };

  const handleConfirmRedemption = () => {
    if (!lookupResult?.voucher) return;
    const res = redeemVoucher({
      code: lookupResult.voucher.code,
      partnerId: selectedPartnerId,
      partnerName: partnerName,
    });

    if (res.success) {
      setRedemptionFeedback({
        success: true,
        message: `Voucher ${res.voucher?.code} successfully redeemed! ₹${res.voucher?.faceValueInr} subsidy claimed for ${res.voucher?.seniorName}.`,
      });
      setLookupResult({ validFormat: true, voucher: res.voucher });
    } else {
      setRedemptionFeedback({
        success: false,
        message: res.error || 'Failed to redeem voucher.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Voucher Redemption Terminal"
        subtitle="Zero-install web validation terminal for diagnostic labs, clinics, and grocery partners."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partners', href: '/partners' },
          { label: 'Redeem Voucher' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand-primary" />
                Voucher Code Lookup & Verification
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-secondary">Terminal Location:</span>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => handlePartnerChange(e.target.value)}
                  className="p-1 bg-bg-canvas border border-border rounded text-text-primary font-medium"
                >
                  {PARTNER_REGISTRY.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  <option value="ptn-kirana-network">Sahakari Bhandar Kirana</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-primary">
                Enter or Scan Crockford Base-32 Voucher Code:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 7X9K-4MB2-K"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup(inputCode)}
                  className="flex-1 p-2.5 bg-bg-canvas border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => handleLookup(inputCode)}
                  className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  Validate Code
                </button>
              </div>
            </div>

            {/* Validation Outcome Display */}
            {lookupResult && (
              <div className="pt-4 border-t border-border space-y-4">
                {lookupResult.voucher ? (
                  <div className="p-5 border-2 border-border rounded-xl bg-bg-canvas space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-brand-primary capitalize">
                          {lookupResult.voucher.category} Subsidy Voucher
                        </span>
                        <h4 className="text-lg font-serif font-semibold text-text-primary mt-0.5">
                          {lookupResult.voucher.campaignName}
                        </h4>
                        <div className="text-xs text-text-secondary mt-1">
                          Beneficiary: <strong className="text-text-primary">{lookupResult.voucher.seniorName}</strong> ({lookupResult.voucher.seniorPhone})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-serif font-semibold text-brand-primary">
                          ₹{lookupResult.voucher.faceValueInr}
                        </div>
                        <div className="text-[11px] text-text-secondary">Face Value</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
                      <div>
                        <span className="text-text-secondary">Voucher Code: </span>
                        <strong className="text-text-primary">{lookupResult.voucher.code}</strong>
                      </div>
                      <div>
                        <span className="text-text-secondary">Valid Until: </span>
                        <span className="text-text-primary">
                          {new Date(lookupResult.voucher.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        {lookupResult.voucher.status === 'redeemed' ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-negative rounded font-semibold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Already Redeemed on {new Date(lookupResult.voucher.redeemedAt!).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-brand-primary rounded font-semibold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Valid for Single-Use Redemption
                          </div>
                        )}
                      </div>

                      {lookupResult.voucher.status !== 'redeemed' && (
                        <button
                          type="button"
                          onClick={handleConfirmRedemption}
                          className="px-5 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Voucher Redemption
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-negative/30 rounded-lg text-xs text-negative flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{lookupResult.error || 'Invalid or unrecognized voucher code.'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Success/Error Feedback Banner */}
            {redemptionFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
                  redemptionFeedback.success
                    ? 'bg-emerald-50 border-brand-primary/30 text-brand-primary'
                    : 'bg-red-50 border-negative/30 text-negative'
                }`}
              >
                {redemptionFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span className="font-semibold">{redemptionFeedback.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Testing Codes Column */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Ticket className="w-4 h-4 text-brand-primary" />
              Quick Demo Codes
            </h3>
            <p className="text-xs text-text-secondary">
              Click a sample voucher to test validation and single-use idempotency.
            </p>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setInputCode('7X9K-4MB2-K');
                  handleLookup('7X9K-4MB2-K');
                }}
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-left hover:border-brand-primary space-y-0.5"
              >
                <div className="font-semibold text-brand-primary">7X9K-4MB2-K (₹600)</div>
                <div className="text-[11px] text-text-secondary">Status: Issued (Unredeemed)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputCode('3N8W-9PL5-Y');
                  handleLookup('3N8W-9PL5-Y');
                }}
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-left hover:border-brand-primary space-y-0.5"
              >
                <div className="font-semibold text-text-primary">3N8W-9PL5-Y (₹1000)</div>
                <div className="text-[11px] text-negative font-medium">Status: Already Redeemed (Tests Error)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputCode('INVALID-CODE-9');
                  handleLookup('INVALID-CODE-9');
                }}
                className="w-full p-2.5 bg-bg-canvas border border-border rounded-lg text-left hover:border-negative space-y-0.5"
              >
                <div className="font-semibold text-negative">INVALID-CODE-9</div>
                <div className="text-[11px] text-text-secondary">Tests Check Digit Failure</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
