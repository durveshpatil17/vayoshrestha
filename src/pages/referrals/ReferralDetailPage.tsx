import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Building2, User, Save } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';

export const ReferralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = mockStore.getData();
  const referral = data.referrals.find((r) => r.id === id) || data.referrals[0];

  const [status, setStatus] = useState(referral?.status || 'In_Progress');
  const [outcome, setOutcome] = useState(referral?.outcome || '');

  if (!referral) {
    return (
      <div className="p-8 text-center">
        <h2>Referral not found</h2>
        <Link to="/referrals">Back to referrals</Link>
      </div>
    );
  }

  const handleUpdate = () => {
    mockStore.updateData((d) => {
      const r = d.referrals.find((x) => x.id === referral.id);
      if (r) {
        r.status = status as any;
        r.outcome = outcome;
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/referrals" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Referrals
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">{referral.id}</span>
      </div>

      <PageHeader
        title={`${referral.seniorName} — ${referral.serviceName}`}
        subtitle={`Assigned to ${referral.partnerName}`}
        actions={
          <StatusChip
            label={status.replace('_', ' ')}
            status={status === 'Completed' ? 'active' : status === 'In_Progress' ? 'info' : 'warning'}
          />
        }
      />

      <Card title="Referral details">
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Clinical notes</span>
            <p className="text-[var(--text)] mt-0.5">{referral.notes}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-[var(--border)]">
            <div>
              <span className="text-[var(--text-secondary)] block">Chapter</span>
              <span className="font-semibold text-[var(--text)]">{referral.chapterId}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)] block">Referred date</span>
              <span className="font-semibold text-[var(--text)]">
                {new Date(referral.referredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Partner outcome & status tracking">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Update referral status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-surface"
            >
              <option value="Requested">Requested (Awaiting partner confirmation)</option>
              <option value="Assigned">Assigned to field clinician</option>
              <option value="In_Progress">In Progress (Consultation scheduled)</option>
              <option value="Completed">Completed</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Outcome / Consultation notes</label>
            <textarea
              rows={3}
              placeholder="Record findings, device prescription, or discharge notes..."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <Button variant="primary" onClick={handleUpdate} icon={<Save size={16} />}>
            Save outcome
          </Button>
        </div>
      </Card>
    </div>
  );
};

