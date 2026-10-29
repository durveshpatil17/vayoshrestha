import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VOUCHER_CAMPAIGNS, VoucherCampaign } from '@/domain/vouchers/voucherEngine';

export const VoucherCampaignsPage: React.FC = () => {
  const [campaigns] = useState<VoucherCampaign[]>(() => [...VOUCHER_CAMPAIGNS]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voucher Subsidy Campaigns"
        subtitle="Ecosystem subsidy programmes funded by CSR donors and health foundations."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vouchers', href: '/vouchers' },
          { label: 'Campaigns' },
        ]}
        actions={
          <Link
            to="/vouchers/campaigns/new"
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => {
          const issuedPercent = Math.round((camp.totalIssued / camp.totalAllocated) * 100);
          const redeemedPercent = Math.round((camp.totalRedeemed / camp.totalIssued) * 100);
          return (
            <div
              key={camp.id}
              className="p-5 bg-bg-surface border border-border rounded-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-brand-primary rounded font-semibold capitalize">
                    {camp.category}
                  </span>
                  <span className="text-xs text-brand-primary font-semibold">
                    ₹{camp.faceValueInr} / voucher
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-serif font-semibold text-text-primary">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {camp.notes}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2 pt-2 border-t border-border text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-text-secondary mb-1">
                      <span>Issuance: {camp.totalIssued} / {camp.totalAllocated}</span>
                      <span className="font-semibold text-text-primary">{issuedPercent}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-brand-primary"
                        style={{ width: `${issuedPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-text-secondary mb-1">
                      <span>Redemption: {camp.totalRedeemed} / {camp.totalIssued}</span>
                      <span className="font-semibold text-emerald-800">{redeemedPercent}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${redeemedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Until {new Date(camp.validUntil).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/vouchers?campaign=${camp.id}`}
                  className="text-brand-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View Vouchers
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
