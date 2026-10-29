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
      <div className="p-8 text-center bg-surface border border-border rounded-container max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-critical mx-auto mb-3 stroke-[1.5]" />
        <h3 className="font-semibold text-base text-text">Senior citizen not found</h3>
        <p className="text-xs text-text-secondary mt-1">Cannot edit an unknown profile record.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/seniors')}>
          Return to registry
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
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          Cancel & return
        </Button>
      </div>

      <PageHeader
        title={`Edit profile: ${senior.fullName}`}
        description={`Member ID: ${senior.memberId} · Chapter: ${senior.chapterId} · Changes are strictly audited`}
      />

      {errorMsg && (
        <div className="p-3 bg-negative-tint border border-negative/30 rounded-control text-xs text-negative flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 stroke-[1.5]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-positive-tint border border-positive/30 rounded-control text-xs text-positive flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 stroke-[1.5]" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Personal Details */}
        <div className="bg-surface border border-border rounded-container p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-semibold text-sm text-text flex items-center gap-2">
              <User className="w-4 h-4 text-accent stroke-[1.5]" />
              Senior demographics
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
              <label className="block text-xs font-semibold text-text mb-1">
                Full name <span className="text-negative">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isVolunteer}
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-surface-subtle"
                required
              />
              {isVolunteer && (
                <p className="text-xs text-text-secondary mt-0.5">
                  Volunteers cannot modify senior legal names.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Preferred language <span className="text-negative">*</span>
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as 'ENGLISH' | 'HINDI' | 'KANNADA' | 'MARATHI' | 'TAMIL')}
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="ENGLISH">English</option>
                <option value="HINDI">Hindi</option>
                <option value="KANNADA">Kannada</option>
                <option value="MARATHI">Marathi</option>
                <option value="TAMIL">Tamil</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text mb-1">
                Residential address / landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street, Ward, Ekta Hub Zone"
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div className="bg-surface border border-border rounded-container p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 className="font-semibold text-sm text-text flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent stroke-[1.5]" />
                Emergency contacts (Next-of-Kin)
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
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
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                Add contact
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {contacts.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3 bg-surface-subtle border border-border rounded-control flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-text min-w-20">
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
                    className="text-xs px-3 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                  <select
                    value={c.relationship}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].relationship = e.target.value;
                      setContacts(updated);
                    }}
                    className="text-xs px-2.5 py-1.5 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Neighbour">Neighbour</option>
                    <option value="Relative">Relative</option>
                  </select>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={c.phoneNumber}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].phoneNumber = e.target.value;
                      setContacts(updated);
                    }}
                    className="text-xs px-3 py-1.5 border border-border rounded-control bg-surface text-text tabular-nums focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>

                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(idx)}
                    className="text-negative hover:text-negative/80 p-1"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Justification Field */}
        <div className="bg-surface border border-border rounded-container p-5 space-y-3">
          <label className="block text-xs font-semibold text-text">
            Audit reason for profile modification <span className="text-negative">*</span>
          </label>
          <p className="text-xs text-text-secondary">
            All updates to senior citizen information are tracked in the immutable audit log hash chain.
          </p>
          <input
            type="text"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            placeholder="e.g. Verified residential address during hub visit; updated daughter's mobile number"
            className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <div>
            {!isVolunteer && senior.status !== 'INACTIVE' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeactivateModalOpen(true)}
                className="text-negative border-negative/30 hover:bg-negative-tint text-xs gap-1.5 font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5 stroke-[1.5]" />
                Deactivate senior record
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
            <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5 font-semibold">
              <Save className="w-3.5 h-3.5 stroke-[1.5]" />
              Save audited changes
            </Button>
          </div>
        </div>
      </form>

      {/* Deactivate Modal */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border rounded-container max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-negative">
              <AlertTriangle className="w-5 h-5 shrink-0 stroke-[1.5]" />
              <h3 className="font-semibold text-base text-text">
                Confirm profile deactivation
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Deactivating <strong className="text-text font-semibold">{senior.fullName}</strong> will immediately halt all automated daily
              medication reminders and flag any incoming SOS triggers with an inactive profile warning.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text">
                Mandatory deactivation reason:
              </label>
              <input
                type="text"
                placeholder="e.g. Relocated out of chapter zone / Requested withdrawal"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text">
                Type <span className="tabular-nums font-semibold text-negative">DEACTIVATE</span> to confirm:
              </label>
              <input
                type="text"
                placeholder="DEACTIVATE"
                value={deactivateConfirmText}
                onChange={(e) => setDeactivateConfirmText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-border rounded-control bg-surface text-text tabular-nums focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
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
                className="text-xs bg-negative hover:bg-negative/90 text-white font-semibold"
              >
                Confirm deactivation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
