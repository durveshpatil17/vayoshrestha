import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ReferralNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [seniorName, setSeniorName] = useState('Kamala Devi (SEN-001)');
  const [serviceName, setServiceName] = useState('Geriatric Home Health Check-up');
  const [partnerName, setPartnerName] = useState('HealthBridge Geriatric Care');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateData((data) => {
      data.referrals = data.referrals || [];
      data.referrals.push({
        id: `REF-${Date.now().toString().slice(-4)}`,
        seniorId: 'SEN-001',
        seniorName: seniorName.split('(')[0].trim(),
        chapterId: 'HUB-PUN',
        serviceId: 'SRV-001',
        serviceName,
        partnerId: 'PART-001',
        partnerName,
        status: 'Requested',
        notes,
        referredByUserId: 'u-cm-pun',
        referredAt: new Date().toISOString(),
      });
    });
    navigate('/referrals');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/referrals" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Referrals
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">New referral</span>
      </div>

      <PageHeader
        title="Refer senior citizen"
        subtitle="Initiate partner consultation or diagnostic appointment with explicit elder consent"
      />

      <Card title="Referral parameters">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Select senior citizen</label>
            <input
              type="text"
              required
              value={seniorName}
              onChange={(e) => setSeniorName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Service required</label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="Geriatric Home Health Check-up">Geriatric Home Health Check-up</option>
                <option value="Mobility Aid & Walker Assessment">Mobility Aid & Walker Assessment</option>
                <option value="Free Senior Cataract & Retinal Screening">Free Senior Cataract & Retinal Screening</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Assigned partner</label>
              <select
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
              >
                <option value="HealthBridge Geriatric Care">HealthBridge Geriatric Care</option>
                <option value="Sanjeevani Mobility & Physiotherapy">Sanjeevani Mobility & Physiotherapy</option>
                <option value="AyuDrishti Eye & Cataract Foundation">AyuDrishti Eye & Cataract Foundation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Clinical / Context notes</label>
            <textarea
              required
              rows={3}
              placeholder="Reason for referral, observed symptoms, or special mobility requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="p-3 rounded bg-[var(--surface-selected)] border border-[var(--border)] text-xs text-[var(--accent)]">
            Consent check: Senior has granted consent for sharing relevant health records with vetted partners.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Link to="/referrals">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" icon={<Save size={16} />}>
              Submit referral
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

