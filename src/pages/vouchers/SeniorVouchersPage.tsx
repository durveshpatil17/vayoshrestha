import React, { useState } from 'react';
import {
  Ticket,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  REGISTERED_VOUCHERS,
  DigitalVoucher,
  sendVoucherViaWhatsApp,
} from '@/domain/vouchers/voucherEngine';
import { useAuthStore } from '@/store/authStore';

export const SeniorVouchersPage: React.FC = () => {
  const { user } = useAuthStore();
  const seniorId = user?.id === 'usr-sc-1' ? 'SC-PUN-001' : 'SC-PUN-001';

  const [vouchers, setVouchers] = useState<DigitalVoucher[]>(() =>
    REGISTERED_VOUCHERS.filter((v) => v.seniorId === seniorId)
  );

  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const handleSendToWhatsApp = (id: string, code: string) => {
    const updated = sendVoucherViaWhatsApp(id);
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...updated } : v)));
    setSentNotice(`Voucher ${code} dispatched to your WhatsApp! Check your chat messages.`);
    setTimeout(() => setSentNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Health & Grocery Vouchers"
        subtitle="Digital subsidy coupons issued to you for diagnostic tests, medicines, and groceries."
        breadcrumbs={[
          { label: 'My Dashboard', href: '/me' },
          { label: 'My Vouchers' },
        ]}
      />

      {sentNotice && (
        <div className="p-4 bg-emerald-50 border border-accent/30 rounded-xl text-xs text-accent font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vouchers.length === 0 ? (
          <div className="col-span-2 p-8 bg-bg-surface border border-border rounded-xl text-center text-text-secondary">
            You do not currently have any active digital vouchers.
          </div>
        ) : (
          vouchers.map((vch) => {
            const isRedeemed = vch.status === 'redeemed';
            return (
              <div
                key={vch.id}
                className={`p-6 rounded-xl border-2 space-y-4 ${
                  isRedeemed
                    ? 'bg-page border-border text-text-secondary opacity-75'
                    : 'bg-bg-surface border-accent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-accent rounded font-semibold ">
                    {vch.category} Subsidy
                  </span>
                  <div className="text-2xl  font-semibold text-accent">
                    ₹{vch.faceValueInr}
                  </div>
                </div>

                <div>
                  <h3 className="text-base  font-semibold text-text">
                    {vch.campaignName}
                  </h3>
                  <div className="text-xs text-text-secondary mt-1">
                    Present this code at any registered partner lab or store:
                  </div>
                  <div className="p-3 bg-page border border-border rounded-lg mt-2 text-center text-xl  font-semibold text-text">
                    {vch.code}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-secondary">Valid Until: </span>
                    <strong className="text-text">{new Date(vch.expiresAt).toLocaleDateString()}</strong>
                  </div>

                  {isRedeemed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Redeemed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendToWhatsApp(vch.id, vch.code)}
                      className="px-3 py-1.5 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send to WhatsApp
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
