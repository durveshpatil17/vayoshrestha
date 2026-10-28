import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { isValidIndianMobile } from '@/domain/onboarding';
import {
  User,
  Phone,
  ShieldAlert,
  Save,
  ArrowLeft,
  AlertTriangle,
  Trash2,
  Plus,
  Info,
} from 'lucide-react';

export const SeniorEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const senior = data.seniorCitizens.find((s) => s.id === id);

  if (!senior) {
    return (
      <div className="p-8 text-center bg-white border border-border-hairline rounded max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
        <h3 className="font-serif font-bold text-base text-text-primary">Senior Citizen Not Found</h3>
        <p className="text-xs text-text-muted mt-1">Cannot edit an unknown profile record.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/seniors')}>
          Return to Registry
        </Button>
      </div>
    );
  }

  const isVolunteer = user?.role === 'VF';

  // State
  const [fullName, setFullName] = useState(senior.fullName);
  const [preferredLanguage, setPreferredLanguage] = useState(senior.preferredLanguage);
  const [address, setAddress] = useState(senior.address || '');
  const [editReason, setEditReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Emergency Contacts
  const existingContacts = data.emergencyContacts.filter((c) => c.seniorId === senior.id);
  const [contacts, setContacts] = useState(
    existingContacts.map((c) => ({
      id: c.id,
      name: c.name,
      relationship: c.relationship,
      phoneNumber: c.phoneNumber,
      priority: c.priority,
    }))
  );

  // Deactivation Modal State
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateConfirmText, setDeactivateConfirmText] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  const handleAddContact = () => {
    if (contacts.length >= 3) return;
    setContacts([
      ...contacts,
      {
        id: `EC-${Date.now()}`,
        name: '',
        relationship: 'Daughter',
        phoneNumber: '+91',
        priority: contacts.length + 1,
      },
    ]);
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }
    if (!editReason.trim()) {
      setErrorMsg('A valid administrative reason is required for auditing changes.');
      return;
    }

    // Validate contacts
    for (const c of contacts) {
      if (!c.name.trim()) {
        setErrorMsg('Every contact must have a name.');
        return;
      }
      if (!isValidIndianMobile(c.phoneNumber || '')) {
        setErrorMsg(`Contact "${c.name}" has an invalid 10-digit Indian mobile number (+91).`);
        return;
      }
    }

    // Apply updates
    senior.fullName = fullName.trim();
    senior.preferredLanguage = preferredLanguage;
    senior.address = address.trim();

    // Replace contacts
    const otherContacts = data.emergencyContacts.filter((c) => c.seniorId !== senior.id);
    const newContacts = contacts.map((c, i) => ({
      id: c.id,
      seniorId: senior.id,
      name: c.name,
      relationship: c.relationship,
      phoneNumber: c.phoneNumber,
      priority: i + 1,
      consentRecorded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    data.emergencyContacts = [...otherContacts, ...newContacts];

    // Audit log
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: senior.chapterId,
      action: 'SENIOR_UPDATE',
      entityType: 'SENIOR',
      entityId: senior.id,
      details: `Profile updated by ${user?.name || user?.role}. Reason: ${editReason}`,
      diff: {
        before: { name: senior.fullName, language: senior.preferredLanguage },
        after: { name: fullName, language: preferredLanguage },
      },
    });

    mockStore.persist();
    setSuccessMsg('Profile and contacts successfully updated and audited.');
    setTimeout(() => {
      navigate(`/seniors/${senior.id}`);
    }, 1200);
  };

  const handleDeactivate = () => {
    if (deactivateConfirmText !== 'DEACTIVATE') {
      setErrorMsg('You must type DEACTIVATE in capital letters to confirm.');
      return;
    }
    if (!deactivateReason.trim()) {
      setErrorMsg('Deactivation reason cannot be empty.');
      return;
    }

    senior.status = 'INACTIVE';
    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: senior.chapterId,
      action: 'SENIOR_DEACTIVATE',
      entityType: 'SENIOR',
      entityId: senior.id,
      details: `Senior status changed to INACTIVE. Reason: ${deactivateReason}`,
      diff: { before: { status: 'ACTIVE' }, after: { status: 'INACTIVE' } },
    });

    mockStore.persist();
    setDeactivateModalOpen(false);
    navigate(`/seniors/${senior.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/seniors/${senior.id}`)}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel & Return
        </Button>
      </div>

      <PageHeader
        title={`Edit Profile: ${senior.fullName}`}
        description={`Member ID: ${senior.memberId} · Chapter: ${senior.chapterId} · Changes are strictly audited`}
      />

      {errorMsg && (
        <div className="p-3 bg-danger-surface border border-danger/30 rounded text-xs text-danger flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-success-surface border border-success/30 rounded text-xs text-success flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Personal Details */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-hairline pb-3">
            <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Senior Demographics
            </h3>
            <StatusChip
              status={
                senior.status === 'ACTIVE'
                  ? 'success'
                  : senior.status === 'INACTIVE'
                  ? 'neutral'
                  : 'warning'
              }
              label={senior.status}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isVolunteer}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent disabled:bg-surface-subtle"
                required
              />
              {isVolunteer && (
                <p className="text-[11px] text-text-muted mt-0.5">
                  Volunteers cannot modify senior legal names.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Preferred Language <span className="text-danger">*</span>
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              >
                <option value="ENGLISH">English</option>
                <option value="HINDI">Hindi (हिंदी)</option>
                <option value="KANNADA">Kannada (ಕನ್ನಡ)</option>
                <option value="MARATHI">Marathi (मराठी)</option>
                <option value="TAMIL">Tamil (தமிழ்)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-text-muted mb-1">
                Residential Address / Landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street, Ward, Ekta Hub Zone"
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-hairline pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-text-primary flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                Emergency Contacts (Next-of-Kin)
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                Targeted for cellular SMS fallback in the event of data network failure during an SOS.
              </p>
            </div>
            {contacts.length < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddContact}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Contact
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {contacts.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3 bg-surface-subtle border border-border-hairline rounded flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-text-muted min-w-[80px]">
                  <span>Priority {idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Contact Full Name"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].name = e.target.value;
                      setContacts(updated);
                    }}
                    className="text-xs px-2.5 py-1.5 border border-border-hairline rounded bg-white"
                    required
                  />

                  <select
                    value={c.relationship}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].relationship = e.target.value;
                      setContacts(updated);
                    }}
                    className="text-xs px-2.5 py-1.5 border border-border-hairline rounded bg-white"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Relative">Relative</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>

                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={c.phoneNumber}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].phoneNumber = e.target.value;
                      setContacts(updated);
                    }}
                    className="text-xs px-2.5 py-1.5 border border-border-hairline rounded bg-white font-mono"
                    required
                  />
                </div>

                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(idx)}
                    className="text-text-muted hover:text-danger p-1"
                    title="Remove contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Justification Field */}
        <div className="bg-white border border-border-hairline rounded p-5 space-y-3">
          <label className="block text-xs font-bold text-text-primary">
            Audit Reason for Profile Modification <span className="text-danger">*</span>
          </label>
          <p className="text-[11px] text-text-muted">
            All updates to senior citizen information are tracked in the immutable audit log hash chain.
          </p>
          <input
            type="text"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            placeholder="e.g. Verified residential address during hub visit; updated daughter's mobile number"
            className="w-full text-xs px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
            required
          />
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border-hairline">
          <div>
            {!isVolunteer && senior.status !== 'INACTIVE' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeactivateModalOpen(true)}
                className="text-danger border-danger/30 hover:bg-danger-surface text-xs gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Deactivate Senior Record
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(`/seniors/${senior.id}`)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="text-xs gap-1">
              <Save className="w-3.5 h-3.5" />
              Save Audited Changes
            </Button>
          </div>
        </div>
      </form>

      {/* Deactivate Modal */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-serif font-bold text-base text-text-primary">
                Confirm Profile Deactivation
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Deactivating <strong>{senior.fullName}</strong> will immediately halt all automated daily
              medication reminders and flag any incoming SOS triggers with an inactive profile warning.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-primary">
                Mandatory Deactivation Reason:
              </label>
              <input
                type="text"
                placeholder="e.g. Relocated out of chapter zone / Requested withdrawal"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-primary">
                Type <span className="font-mono font-bold text-danger">DEACTIVATE</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="DEACTIVATE"
                value={deactivateConfirmText}
                onChange={(e) => setDeactivateConfirmText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border-hairline rounded font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeactivateModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeactivate}
                disabled={deactivateConfirmText !== 'DEACTIVATE' || !deactivateReason.trim()}
                className="bg-danger hover:bg-danger/90 text-white text-xs"
              >
                Confirm Deactivation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
