import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Ticket,
  Send,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  REGISTERED_VOUCHERS,
  DigitalVoucher,
  sendVoucherViaWhatsApp,
} from '@/domain/vouchers/voucherEngine';

export const VoucherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [voucher, setVoucher] = useState<DigitalVoucher | undefined>(() =>
    REGISTERED_VOUCHERS.find((v) => v.id === id || v.code === id)
  );
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!voucher) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl  font-semibold text-text">Voucher Not Found</h2>
        <p className="text-sm text-text-secondary">The requested digital voucher does not exist.</p>
        <Link
          to="/vouchers"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vouchers
        </Link>
      </div>
    );
  }

  const handleSendWhatsApp = () => {
    setIsSending(true);
    try {
      const updated = sendVoucherViaWhatsApp(voucher.id);
      setVoucher({ ...updated });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Voucher Code: ${voucher.code}`}
        subtitle={`${voucher.campaignName} · ₹${voucher.faceValueInr} Face Value`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vouchers', href: '/vouchers' },
          { label: voucher.code },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {voucher.status === 'issued' && (
              <button
                onClick={handleSendWhatsApp}
                disabled={isSending}
                className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send to Senior WhatsApp'}
              </button>
            )}
            <Link
              to={`/partner/vouchers/redeem?code=${voucher.code}`}
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-accent" />
              Redeem at Partner
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Voucher Card Presentation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-6">
            {/* Visual Voucher Display */}
            <div className="p-6 border-2 border-dashed border-accent/40 rounded-xl bg-emerald-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-accent rounded font-semibold ">
                  {voucher.category} subsidy
                </span>
                <span className="text-xl  font-semibold text-accent">
                  ₹{voucher.faceValueInr}
                </span>
              </div>

              <div>
                <div className="text-xs text-text-secondary">Official Crockford Base-32 Voucher Code:</div>
                <div className="text-2xl  font-semibold text-text mt-1">
                  {voucher.code}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                <div>
                  <span>Beneficiary: </span>
                  <strong className="text-text">{voucher.seniorName}</strong> ({voucher.seniorPhone})
                </div>
                <div>
                  <span>Valid Until: </span>
                  <strong className="text-text">{new Date(voucher.expiresAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>

            {/* Status Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-secondary">Lifecycle Timeline</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-page border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text">1. Issued to Senior</div>
                    <div className="text-xs text-text-secondary">{new Date(voucher.issuedAt).toLocaleString()}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>

                <div className="p-3 bg-page border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text">2. WhatsApp Delivery</div>
                    <div className="text-xs text-text-secondary">
                      {voucher.sentAt ? new Date(voucher.sentAt).toLocaleString() : 'Pending dispatch'}
                    </div>
                  </div>
                  {voucher.sentAt ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : (
                    <Clock className="w-4 h-4 text-text-secondary" />
                  )}
                </div>

                <div className="p-3 bg-page border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text">3. Partner Redemption</div>
                    <div className="text-xs text-text-secondary">
                      {voucher.redeemedAt
                        ? `Redeemed by ${voucher.redeemedByPartnerName} on ${new Date(voucher.redeemedAt).toLocaleString()}`
                        : 'Single-use redemption pending at partner terminal'}
                    </div>
                  </div>
                  {voucher.redeemedAt ? (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  ) : (
                    <Clock className="w-4 h-4 text-text-secondary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Campaign Information */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              Sponsoring Campaign
            </h3>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-text">{voucher.campaignName}</div>
              <div className="text-text-secondary leading-relaxed">
                Funded by CSR healthcare partners. Partners verify and redeem through the zero-install web terminal.
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Link
                to={`/partner/vouchers/redeem?code=${voucher.code}`}
                className="w-full py-2 bg-accent text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-accent/90"
              >
                <QrCode className="w-4 h-4" />
                Test Partner Redemption
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
