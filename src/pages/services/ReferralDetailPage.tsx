import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { ShieldCheck, Clock, Building2, User, CheckCircle2, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { Referral } from '@/api/contracts';

export const ReferralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const referral = data.referrals.find((r) => r.id === id);
  const [currentStatus, setCurrentStatus] = useState<Referral['status']>(referral?.status || 'Created');
  const [partnerNotes, setPartnerNotes] = useState(referral?.partnerNotes || '');
  const [closureOutcome, setClosureOutcome] = useState<Referral['closureOutcome']>(referral?.closureOutcome || 'Resolved');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!referral) {
    return (
      <div className="p-8 text-center bg-bg-base border border-border-hairline rounded">
        <h3 className="font-serif text-lg font-semibold text-text-primary">Referral Record Not Found</h3>
        <Link to="/referrals" className="mt-4 inline-block text-accent font-medium">← Back to Referrals</Link>
      </div>
    );
  }

  const member = data.seniorCitizens.find((m) => m.id === referral.memberId);
  const partner = data.servicePartners.find((p) => p.id === referral.partnerId);

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    mockStore.updateData((draft) => {
      const target = draft.referrals.find((r) => r.id === referral.id);
      if (target) {
        target.status = currentStatus;
        target.partnerNotes = partnerNotes;
        if (currentStatus === 'Closed') {
          target.closedAt = new Date().toISOString();
          target.closureOutcome = closureOutcome;
        }
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'User',
      user?.role || 'SP',
      'UPDATE',
      'Referral',
      referral.id,
      `Updated referral status to ${currentStatus}. Notes: ${partnerNotes || 'None'}`,
      { status: referral.status },
      { status: currentStatus, partnerNotes, closureOutcome },
      referral.centreId
    );

    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={`Referral: ${referral.serviceName}`}
        description={`Referral ID ${referral.id} • Assigned to ${referral.partnerName}`}
        breadcrumb={[
          { label: 'Referrals', href: '/referrals' },
          { label: referral.id },
        ]}
        actions={
          <Link to="/referrals">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Pipeline
            </Button>
          </Link>
        }
      />

      {updateSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Referral status updated and logged in the immutable audit trail.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Referral Details Left Rail */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-base font-semibold text-text-primary">Case Overview</h3>
              <StatusChip
                label={referral.status}
                variant={referral.status === 'Closed' ? 'neutral' : referral.status === 'InProgress' ? 'active' : 'warning'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Senior Citizen</span>
                <span className="font-semibold text-text-primary text-sm">{referral.memberName}</span>
                <span className="text-text-muted block mt-0.5">Age Band: {referral.memberAgeBand}</span>
              </div>

              <div>
                <span className="text-text-muted block">Partner Organization</span>
                <span className="font-semibold text-text-primary text-sm">{referral.partnerName}</span>
                <span className="text-text-muted block mt-0.5">Specialty: {referral.serviceName}</span>
              </div>

              <div>
                <span className="text-text-muted block">Urgency Rating</span>
                <span className="font-semibold text-text-primary">{referral.urgency}</span>
              </div>

              <div>
                <span className="text-text-muted block">Initiated Date</span>
                <span className="font-semibold text-text-primary">{referral.createdAt.split('T')[0]}</span>
                <span className="text-text-muted block mt-0.5">By {referral.createdByName}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border-hairline">
              <label className="text-xs text-text-muted block mb-1">Non-Clinical Observation / Reason</label>
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-primary leading-relaxed">
                {referral.nonClinicalReason}
              </div>
            </div>
          </div>

          {/* Partner Status Update Form */}
          <form onSubmit={handleStatusUpdate} className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary">Update Referral Progression</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Current Lifecycle Status</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as any)}
                  className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Created">Created</option>
                  <option value="Sent">Sent to Partner</option>
                  <option value="Accepted">Accepted by Partner</option>
                  <option value="InProgress">In Progress / Assessment Scheduled</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {currentStatus === 'Closed' && (
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">Closure Outcome Code</label>
                  <select
                    value={closureOutcome}
                    onChange={(e) => setClosureOutcome(e.target.value as any)}
                    className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                  >
                    <option value="Resolved">Resolved (Consultation Completed)</option>
                    <option value="Declined">Declined / Unreachable</option>
                    <option value="NoResponse">No Response from Patient</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Partner Consultation Notes</label>
              <textarea
                rows={3}
                value={partnerNotes}
                onChange={(e) => setPartnerNotes(e.target.value)}
                placeholder="Record consultation completion summary, next review date, or outcome notes..."
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Save Status Update
              </Button>
            </div>
          </form>
        </div>

        {/* Data Minimization & Shared Fields Inspection Right Rail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border-hairline pb-3">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h4 className="font-serif text-sm font-semibold text-text-primary">Shared Data Panel (FR-33)</h4>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Under DPDP data minimization principles, the external partner only receives the minimal necessary fields to deliver the service.
            </p>

            <div className="bg-bg-subtle p-3.5 rounded border border-border-hairline space-y-2 text-xs">
              <div className="font-semibold text-text-primary border-b border-border-hairline pb-1">
                Visible to Partner Organization:
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Senior Full Name:</span>
                <span className="font-medium text-text-primary">{referral.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Age Band (DOB masked):</span>
                <span className="font-medium text-text-primary">{referral.memberAgeBand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Gender:</span>
                <span className="font-medium text-text-primary">{member?.gender || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Contact Phone:</span>
                <span className="font-mono text-text-primary">
                  {user?.role === 'SP' ? (member?.phone ? `••••••${member.phone.slice(-4)}` : '••••••4321') : member?.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Preferred Language:</span>
                <span className="font-medium text-text-primary">{member?.preferredLanguage || 'Marathi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Ekta Hub:</span>
                <span className="font-medium text-text-primary">{data.centres.find((c) => c.id === referral.centreId)?.name}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs space-y-1">
              <div className="font-semibold">Hidden from Partner (Protected Data):</div>
              <div>• Exact Date of Birth & Aadhaar (never collected)</div>
              <div>• Detailed home address & family contact numbers</div>
              <div>• Complete attendance history at Ekta Hub</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
