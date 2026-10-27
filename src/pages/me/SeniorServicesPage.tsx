import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Building2, HeartPulse, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ServiceItem } from '@/api/contracts';

export const SeniorServicesPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    mockStore.updateData((draft) => {
      draft.referrals.unshift({
        id: `ref-sc-${Date.now()}`,
        memberId: user?.id || 'm-1',
        memberName: user?.fullName || 'Senior Member',
        memberAgeBand: '70–74',
        centreId: user?.assignedCentres?.[0] || 'HUB-PUN',
        partnerId: selectedService.partnerId,
        partnerName: selectedService.partnerName,
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        urgency: 'Normal',
        nonClinicalReason: requestNotes || 'Senior citizen self-requested consultation from portal',
        status: 'Created',
        createdBy: user?.id || 'm-1',
        createdByName: user?.fullName || 'Senior Member',
        createdAt: new Date().toISOString(),
      });
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedService(null);
      setRequestNotes('');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-base">
      <PageHeader
        title="Community Care & Consultations"
        description="Connect with trusted partner doctors, physiotherapists, and pension counselors."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Services' },
        ]}
      />

      <div className="p-4 bg-bg-subtle border-2 border-border-hairline rounded-lg text-sm text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Important Notice:</strong> Vayoh Vikas does not give direct medical advice.
          We connect you with qualified partner clinics and charitable trusts. Your coordinator will help confirm your appointment.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.services.map((srv) => (
          <div
            key={srv.id}
            className="bg-bg-base border-2 border-border-hairline rounded-lg p-5 flex flex-col justify-between hover:border-accent transition-all shadow-xs space-y-4"
          >
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-text-primary">{srv.title}</h3>
              <div className="text-xs text-accent font-semibold">{srv.partnerName}</div>
              <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
                {srv.description}
              </p>
              <div className="text-xs text-text-muted bg-bg-subtle p-2.5 rounded">
                Available: {srv.availableDays.join(', ')}
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setSelectedService(srv)}
              className="text-sm w-full"
            >
              Request Consultation
            </Button>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-lg border-2 border-border-hairline max-w-md w-full p-6 space-y-4 shadow-2xl text-sm">
            <h3 className="font-serif text-xl font-bold text-text-primary">Request Consultation</h3>

            {submitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Request sent! Your coordinator will call you to confirm your time slot.</span>
              </div>
            ) : (
              <form onSubmit={handleRequestService} className="space-y-3">
                <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
                  <div><strong>Service:</strong> {selectedService.title}</div>
                  <div><strong>Partner:</strong> {selectedService.partnerName}</div>
                </div>

                <div>
                  <label className="font-medium text-text-primary block mb-1">
                    Describe your question or difficulty:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Need eye checkup for reading glasses..."
                    className="w-full p-2.5 border border-border-hairline rounded bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setSelectedService(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={!requestNotes.trim()}>
                    Submit Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
