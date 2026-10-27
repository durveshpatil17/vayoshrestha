import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { dobToAgeBand } from '@/domain/masking';
import { ArrowLeft, CheckCircle2, ShieldAlert, AlertCircle, Building2, User } from 'lucide-react';
import { Referral } from '@/api/contracts';

export const ReferralNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId') || '';

  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [memberId, setMemberId] = useState('');
  const [serviceId, setServiceId] = useState(preselectedServiceId || data.services[0]?.id || '');
  const [partnerId, setPartnerId] = useState(data.servicePartners[0]?.id || '');
  const [urgency, setUrgency] = useState<Referral['urgency']>('Normal');
  const [nonClinicalReason, setNonClinicalReason] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedMember = data.seniorCitizens.find((m) => m.id === memberId);
  const selectedService = data.services.find((s) => s.id === serviceId);
  const approvedPartners = data.servicePartners.filter((p) => p.approvalStatus === 'Approved');

  // When service changes, sync partner
  const handleServiceChange = (sId: string) => {
    setServiceId(sId);
    const srv = data.services.find((s) => s.id === sId);
    if (srv) {
      setPartnerId(srv.partnerId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedService || !consentConfirmed) return;

    const partner = data.servicePartners.find((p) => p.id === partnerId) || approvedPartners[0];

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      memberId: selectedMember.id,
      memberName: selectedMember.fullName,
      memberAgeBand: dobToAgeBand(selectedMember.dateOfBirth),
      centreId: selectedMember.centreId,
      partnerId: partner.id,
      partnerName: partner.name,
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      urgency,
      nonClinicalReason,
      status: 'Created',
      createdBy: user?.id || 'unknown',
      createdByName: user?.fullName || 'Centre Staff',
      createdAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.referrals.unshift(newReferral);
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'CREATE',
      'Referral',
      newReferral.id,
      `Initiated referral for ${selectedMember.fullName} to ${partner.name}. Urgency: ${urgency}`,
      null,
      newReferral,
      selectedMember.centreId
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/referrals');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Initiate Community Referral Request"
        description="Connect a senior citizen with approved external healthcare or legal aid services under strict consent (FR-32)"
        breadcrumb={[
          { label: 'Referrals', href: '/referrals' },
          { label: 'New Referral' },
        ]}
        actions={
          <Link to="/referrals">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Referrals
            </Button>
          </Link>
        }
      />

      {/* Non-Clinical Banner */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Non-Clinical Language Standard:</strong> Vayoshreshtha staff do not diagnose illness or recommend prescriptions.
          Record observational details only (e.g. "Elder expressed difficulty reading fine print" or "Elder walked with noticeable knee stiffness").
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-emerald-900">Referral Successfully Created!</h3>
          <p className="text-xs text-emerald-800">Assigned partner has been notified. Redirecting to pipeline...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-5">
          <div className="space-y-4">
            {/* Senior Selection */}
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Select Senior Citizen</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="">-- Choose registered elder --</option>
                {data.seniorCitizens.slice(0, 30).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.membershipId}) - {m.gender}, {dobToAgeBand(m.dateOfBirth)}
                  </option>
                ))}
              </select>
            </div>

            {selectedMember && (
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs grid grid-cols-3 gap-2">
                <div><strong>Ekta Hub:</strong> {data.centres.find((c) => c.id === selectedMember.centreId)?.name}</div>
                <div><strong>Age Band:</strong> {dobToAgeBand(selectedMember.dateOfBirth)}</div>
                <div><strong>Consent on File:</strong> {selectedMember.consentStatus}</div>
              </div>
            )}

            {/* Service & Partner */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Service & Consultation</label>
                <select
                  value={serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  required
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  {data.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Normal">Normal (Routine Consultation - 7 Days)</option>
                  <option value="High">High (Needs Follow-up within 48 Hours)</option>
                  <option value="Immediate">Immediate (Handover within 24 Hours)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Non-Clinical Observation & Reason for Referral
              </label>
              <textarea
                rows={4}
                required
                value={nonClinicalReason}
                onChange={(e) => setNonClinicalReason(e.target.value)}
                placeholder="e.g. Senior citizen requested guidance regarding persistent joint discomfort following yoga sessions..."
                className="w-full text-xs border border-border-hairline rounded p-3 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            {/* Data Sharing Consent Confirmation */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-emerald-950 font-medium">
                <input
                  type="checkbox"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-accent focus:ring-accent"
                />
                <span>
                  <strong>Data Sharing Consent Obtained:</strong> I confirm that the senior citizen (or their authorized family proxy) has been informed
                  that their name, age band, and contact details will be shared exclusively with the selected partner for this consultation.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/referrals')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!memberId || !nonClinicalReason || !consentConfirmed}
            >
              Submit Referral
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
