import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  DollarSign,
  QrCode,
  Building2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  REGISTERED_VOUCHERS,
  VOUCHER_CAMPAIGNS,
  DigitalVoucher,
  sendVoucherViaWhatsApp,
} from '@/domain/vouchers/voucherEngine';

export const VouchersOverviewPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<DigitalVoucher[]>(() => [...REGISTERED_VOUCHERS]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSendWhatsApp = (id: string) => {
    const updated = sendVoucherViaWhatsApp(id);
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...updated } : v)));
  };

  const filtered = vouchers.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.code.toLowerCase().includes(q) ||
        v.seniorName.toLowerCase().includes(q) ||
        v.campaignName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalValueDistributed = vouchers.reduce((acc, v) => acc + v.faceValueInr, 0);
  const totalValueRedeemed = vouchers
    .filter((v) => v.status === 'redeemed')
    .reduce((acc, v) => acc + v.faceValueInr, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Vouchers & Subsidies"
        subtitle="Crockford Base-32 single-use digital health and nutrition vouchers with WhatsApp distribution."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Vouchers' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/partner/vouchers/redeem"
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-accent" />
              Partner Redemption Terminal
            </Link>
            <Link
              to="/vouchers/campaigns"
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-accent" />
              Campaigns
            </Link>
            <Link
              to="/vouchers/campaigns/new"
              className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Total Vouchers Issued</div>
          <div className="text-2xl  font-semibold text-text">{vouchers.length}</div>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-accent" />
            Across {VOUCHER_CAMPAIGNS.length} Active Campaigns
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Total Subsidies Issued</div>
          <div className="text-2xl  font-semibold text-accent">
            ₹{totalValueDistributed.toLocaleString()}
          </div>
          <div className="text-xs text-text-secondary">Face Value Allocated</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">Redeemed by Partners</div>
          <div className="text-2xl  font-semibold text-emerald-700">
            ₹{totalValueRedeemed.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Single-Use
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-1">
          <div className="text-xs text-text-secondary font-semibold">WhatsApp Delivery Active</div>
          <div className="text-2xl  font-semibold text-text">94.8%</div>
          <div className="text-xs text-text-secondary">Delivered directly to seniors</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search voucher code, senior, campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-page border border-border rounded-lg px-2.5 py-1.5 text-text focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="issued">Issued</option>
            <option value="sent_via_whatsapp">Sent via WhatsApp</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-page text-text-secondary border-b border-border">
              <tr>
                <th className="p-3.5 font-semibold">Voucher Code</th>
                <th className="p-3.5 font-semibold">Campaign Name</th>
                <th className="p-3.5 font-semibold">Senior Citizen</th>
                <th className="p-3.5 font-semibold">Face Value</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Redeemed Partner / Date</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((vch) => (
                <tr key={vch.id} className="hover:bg-page/50 transition-colors">
                  <td className="p-3.5 font-semibold text-accent">
                    <Link to={`/vouchers/${vch.id}`} className="hover:underline">
                      {vch.code}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold text-text max-w-xs truncate">
                    {vch.campaignName}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-text">{vch.seniorName}</div>
                    <div className="text-xs text-text-secondary">{vch.seniorPhone}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-text">
                    ₹{vch.faceValueInr}
                  </td>
                  <td className="p-3.5">
                    {vch.status === 'redeemed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                        Redeemed
                      </span>
                    )}
                    {vch.status === 'sent_via_whatsapp' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-accent rounded font-semibold">
                        <Send className="w-3 h-3" />
                        Sent to WhatsApp
                      </span>
                    )}
                    {vch.status === 'issued' && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-semibold">
                        Issued
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-text-secondary">
                    {vch.redeemedByPartnerName ? (
                      <div>
                        <div className="font-semibold text-text">{vch.redeemedByPartnerName}</div>
                        <div className="text-xs text-text-secondary">
                          {new Date(vch.redeemedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="italic">Not redeemed</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {vch.status === 'issued' && (
                      <button
                        onClick={() => handleSendWhatsApp(vch.id)}
                        className="text-accent font-semibold hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <Send className="w-3 h-3" />
                        Send WhatsApp
                      </button>
                    )}
                    <Link
                      to={`/vouchers/${vch.id}`}
                      className="text-text-secondary hover:text-text hover:underline"
                    >
                      View
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
