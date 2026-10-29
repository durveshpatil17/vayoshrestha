import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VOUCHER_CAMPAIGNS, VoucherCampaign } from '@/domain/vouchers/voucherEngine';

export const VoucherCampaignNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('Q4 Senior Preventive Cardiac Screening Voucher Drive');
  const [category, setCategory] = useState<'diagnostic' | 'grocery' | 'transport' | 'wellness'>('diagnostic');
  const [faceValueInr, setFaceValueInr] = useState<number>(750);
  const [totalAllocated, setTotalAllocated] = useState<number>(500);
  const [validFrom, setValidFrom] = useState<string>('2026-11-01');
  const [validUntil, setValidUntil] = useState<string>('2027-01-31');
  const [notes, setNotes] = useState<string>(
    'Fully subsidised ECG and 2D-Echocardiogram co-pay voucher redeemable at Sahyadri and Ruby Hall Clinics.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: VoucherCampaign = {
      id: `camp-${Date.now()}`,
      name,
      category,
      faceValueInr,
      totalAllocated,
      totalIssued: 0,
      totalRedeemed: 0,
      validFrom,
      validUntil,
      partnerIds: ['ptn-sahyadri', 'ptn-rubyhall'],
      status: 'active',
      notes,
    };
    VOUCHER_CAMPAIGNS.unshift(newCampaign);
    navigate('/vouchers/campaigns');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Voucher Subsidy Campaign"
        subtitle="Establish a new targeted voucher fund for senior healthcare, diagnostics, or nutrition aid."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vouchers', href: '/vouchers' },
          { label: 'Campaigns', href: '/vouchers/campaigns' },
          { label: 'New Campaign' },
        ]}
      />

      <div className="max-w-2xl bg-bg-surface border border-border rounded-xl p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text-secondary">Campaign Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Domain Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none"
              >
                <option value="diagnostic">Diagnostic Screening</option>
                <option value="grocery">Nutrition & Grocery</option>
                <option value="transport">Mobility & Hospital Transport</option>
                <option value="wellness">Mental Wellness & Care</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Face Value per Voucher (INR):</label>
              <input
                type="number"
                min={100}
                step={50}
                value={faceValueInr}
                onChange={(e) => setFaceValueInr(parseInt(e.target.value, 10))}
                required
                className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Total Voucher Pool Allocation:</label>
              <input
                type="number"
                min={10}
                value={totalAllocated}
                onChange={(e) => setTotalAllocated(parseInt(e.target.value, 10))}
                required
                className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Total Budget Commitment:</label>
              <div className="p-2.5 bg-page border border-border rounded-lg font-semibold text-accent text-sm">
                ₹{(faceValueInr * totalAllocated).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Valid From Date:</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
                className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-secondary">Valid Until Date:</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
                className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-secondary">Campaign Description & Co-pay Rules:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full p-2.5 bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/vouchers/campaigns')}
              className="px-4 py-2 border border-border rounded-lg font-semibold text-text-secondary hover:bg-page"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 flex items-center gap-1.5"
            >
              Launch Campaign
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
