import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { User, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SeniorProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const senior = data.seniorCitizens.find((s) => s.id === user?.id || s.phone === user?.phone) || data.seniorCitizens[0];

  const [emergencyName, setEmergencyName] = useState(senior.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(senior.emergencyContactPhone);
  const [saved, setSaved] = useState(false);
  const [correctionSent, setCorrectionSent] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();

    mockStore.updateData((draft) => {
      const target = draft.seniorCitizens.find((s) => s.id === senior.id);
      if (target) {
        target.emergencyContactName = emergencyName;
        target.emergencyContactPhone = emergencyPhone;
      }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRequestCorrection = () => {
    mockStore.writeAudit(
      senior.id,
      senior.fullName,
      'SC',
      'CREATE',
      'DataGovernanceRequest',
      senior.id,
      'Senior citizen requested profile record review under DPDP Act',
      null,
      null,
      senior.centreId
    );

    setCorrectionSent(true);
    setTimeout(() => setCorrectionSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-base">
      <PageHeader
        title="My Senior Profile & Membership"
        description="Review your registered record, download your membership card, and manage privacy rights."
        breadcrumb={[
          { label: 'My Space', href: '/me' },
          { label: 'Profile' },
        ]}
        actions={
          <Link to={`/members/${senior.id}/card`}>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-1.5" />
              View Printable Card
            </Button>
          </Link>
        }
      />

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Emergency contact updated.</span>
        </div>
      )}

      {correctionSent && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Correction request logged with coordinator under DPDP regulations.</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-bg-base border-2 border-border-hairline rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between border-b border-border-hairline pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-text-primary">{senior.fullName}</h3>
            <div className="text-sm font-mono text-accent mt-0.5">
              Membership ID: <strong>{senior.membershipId}</strong>
            </div>
          </div>
          <StatusChip label="Active Member" variant="active" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-bg-subtle p-4 rounded">
          <div>
            <span className="text-text-muted block text-xs">Registered Phone</span>
            <span className="font-semibold">{senior.phone}</span>
          </div>
          <div>
            <span className="text-text-muted block text-xs">Date of Birth</span>
            <span className="font-semibold">{senior.dateOfBirth}</span>
          </div>
          <div>
            <span className="text-text-muted block text-xs">Home Centre</span>
            <span className="font-semibold">Ekta Hub Shivajinagar</span>
          </div>
        </div>

        {/* Emergency Contact Edit */}
        <form onSubmit={handleSaveContact} className="pt-4 border-t border-border-hairline space-y-3">
          <h4 className="font-serif text-base font-semibold text-text-primary">
            Emergency Care Contact (Family / Neighbor)
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full border border-border-hairline rounded p-2 text-sm bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1">Contact Phone (+91)</label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full border border-border-hairline rounded p-2 text-sm bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Emergency Contact
            </Button>
          </div>
        </form>

        {/* Privacy Rights Section */}
        <div className="pt-4 border-t border-border-hairline space-y-2">
          <h4 className="font-serif text-base font-semibold text-text-primary">Your Data Privacy Rights</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Under India's DPDP Act, you have the right to request a correction to your name, request a copy of your records,
            or withdraw your membership data.
          </p>
          <Button variant="outline" size="sm" onClick={handleRequestCorrection} className="text-xs mt-1">
            Request Record Correction / Review
          </Button>
        </div>
      </div>
    </div>
  );
};
