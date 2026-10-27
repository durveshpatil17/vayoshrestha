import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';

export const MemberEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();
  const member = data.seniorCitizens.find((m) => m.id === id);

  const [fullName, setFullName] = useState(member?.fullName || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [address, setAddress] = useState(member?.address || '');
  const [emergencyName, setEmergencyName] = useState(member?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(member?.emergencyContactPhone || '');
  const [primaryLanguage, setPrimaryLanguage] = useState(member?.primaryLanguage || 'Marathi');
  const [reason, setReason] = useState('');
  const [saved, setSaved] = useState(false);

  if (!member) {
    return <div className="p-12 text-center text-xs text-text-muted">Member not found.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const diffBefore = {
      fullName: member.fullName,
      phone: member.phone,
      address: member.address,
      emergencyName: member.emergencyContactName,
      emergencyPhone: member.emergencyContactPhone,
    };

    const diffAfter = {
      fullName,
      phone,
      address,
      emergencyName,
      emergencyPhone,
    };

    mockStore.updateData((draft) => {
      const target = draft.seniorCitizens.find((x) => x.id === member.id);
      if (target) {
        target.fullName = fullName;
        target.phone = phone;
        target.address = address;
        target.emergencyContactName = emergencyName;
        target.emergencyContactPhone = emergencyPhone;
        target.primaryLanguage = primaryLanguage as any;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff Member',
      user?.role || 'PM',
      'UPDATE',
      'SeniorCitizen',
      member.id,
      reason || 'Profile contact information update',
      diffBefore,
      diffAfter,
      member.centreId
    );

    setSaved(true);
    setTimeout(() => {
      navigate(`/members/${member.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title={`Edit Profile · ${member.fullName}`}
        description={`Membership ID: ${member.membershipId} · All changes are audited with before/after diffs.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Senior Citizens', to: '/members' },
          { label: member.fullName, to: `/members/${member.id}` },
          { label: 'Edit' },
        ]}
      />

      {saved && (
        <div className="p-3 bg-success-bg text-success text-xs rounded border border-success/30">
          Member details successfully updated and audited.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-bg-base border border-border-hairline rounded p-6 space-y-4 text-xs">
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mobile Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Select
            label="Primary Language"
            value={primaryLanguage}
            onChange={(e) => setPrimaryLanguage(e.target.value as any)}
            options={[
              { value: 'Marathi', label: 'Marathi' },
              { value: 'Hindi', label: 'Hindi' },
              { value: 'English', label: 'English' },
              { value: 'Gujarati', label: 'Gujarati' },
            ]}
          />
        </div>

        <Input
          label="Residential Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="pt-2 border-t border-border-hairline">
          <span className="font-semibold text-text-primary block mb-2">Emergency Contact Information</span>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border-hairline">
          <Input
            label="Mandatory Reason for Modification (Audited)"
            placeholder="e.g. Senior changed mobile SIM card; corrected address spelling"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
          <Button variant="outline" size="md" onClick={() => navigate(`/members/${member.id}`)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save & Audit Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
