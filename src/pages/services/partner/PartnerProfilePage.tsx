import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Building2, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const PartnerProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const partner = data.servicePartners.find((p) => p.id === user?.partnerId || p.name.includes('Sanctuary')) || data.servicePartners[0];

  const [contactPerson, setContactPerson] = useState(partner?.contactPerson || '');
  const [phone, setPhone] = useState(partner?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    mockStore.updateData((draft) => {
      const target = draft.servicePartners.find((p) => p.id === partner.id);
      if (target) {
        target.contactPerson = contactPerson;
        target.phone = phone;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Partner',
      'SP',
      'UPDATE',
      'ServicePartner',
      partner.id,
      'Updated partner contact details',
      null,
      { contactPerson, phone },
      undefined
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Organization Profile & Availability"
        description="Manage your organization's contact liaisons, clinic timings, and service availability"
        breadcrumb={[
          { label: 'Partner Portal', href: '/partner/home' },
          { label: 'Profile' },
        ]}
      />

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-bg-base border border-border-hairline rounded p-6 space-y-4">
        <h3 className="font-serif text-base font-semibold text-text-primary">Contact & Operating Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Organization Name</label>
            <input
              type="text"
              disabled
              value={partner?.name}
              className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-subtle text-text-muted cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Specialty</label>
            <input
              type="text"
              disabled
              value={partner?.category}
              className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-subtle text-text-muted cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Liaison Coordinator Name</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1">Direct Phone (+91)</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border-hairline flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
