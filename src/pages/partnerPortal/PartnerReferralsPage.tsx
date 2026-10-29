import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Save, FileText } from 'lucide-react';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';

export const PartnerReferralsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const data = mockStore.getData();
  const referrals = data.referrals || [];

  const [selectedId, setSelectedId] = useState<string>(id || referrals[0]?.id || '');
  const activeReferral = referrals.find((r) => r.id === selectedId) || referrals[0];

  const [status, setStatus] = useState(activeReferral?.status || 'In_Progress');
  const [outcome, setOutcome] = useState(activeReferral?.outcome || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    mockStore.updateData((d) => {
      const r = d.referrals.find((x) => x.id === activeReferral?.id);
      if (r) {
        r.status = status as any;
        r.outcome = outcome;
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/partner/home" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Partner portal
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Assigned referrals</span>
      </div>

      <PageHeader
        title="Partner referral manager"
        subtitle="Review clinical requirements, schedule visits, and document consultation outcomes"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-text">Open cases</h2>
          <div className="space-y-2">
            {referrals.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedId(r.id);
                  setStatus(r.status);
                  setOutcome(r.outcome || '');
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                  r.id === selectedId
                    ? 'border-accent bg-informative-tint'
                    : 'border-border bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className="font-semibold text-sm text-text">{r.seniorName}</div>
                <div className="text-text-secondary mt-0.5">{r.serviceName}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-border-subtle">
                  <span className="tabular-nums font-semibold">{r.id}</span>
                  <StatusChip
                    label={r.status.replace('_', ' ')}
                    status={r.status === 'Completed' ? 'active' : 'info'}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeReferral && (
          <div className="md:col-span-2 space-y-6">
            <Card title={`${activeReferral.seniorName} — Clinical referral file`}>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-text-secondary block">Service requested</span>
                  <span className="text-sm font-semibold text-text">{activeReferral.serviceName}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Clinical context / symptoms</span>
                  <p className="text-sm text-text bg-surface-subtle p-3 rounded border border-border-subtle mt-1">
                    "{activeReferral.notes}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-text-secondary block">Hub origin</span>
                    <span className="font-semibold text-text">{activeReferral.chapterId}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Date received</span>
                    <span className="font-semibold text-text">
                      {new Date(activeReferral.referredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Consultation status & outcome documentation">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Referral status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent bg-surface"
                  >
                    <option value="Requested">Requested (Reviewing clinical availability)</option>
                    <option value="Assigned">Assigned (Visiting doctor assigned)</option>
                    <option value="In_Progress">In Progress (Home visit scheduled)</option>
                    <option value="Completed">Completed (Outcome documented)</option>
                    <option value="Declined">Declined (Outside clinical scope)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Doctor findings & next steps</label>
                  <textarea
                    rows={4}
                    placeholder="Document clinical diagnosis, prescriptions, follow-up advice..."
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-border focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {saved && <span className="text-xs text-positive font-semibold">Outcome saved successfully!</span>}
                  <Button variant="primary" onClick={handleSave} icon={<Save size={16} />}>
                    Save consultation record
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

