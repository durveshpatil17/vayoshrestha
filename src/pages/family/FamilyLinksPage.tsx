import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Plus, CheckCircle2, ShieldAlert, XCircle, ArrowLeft } from 'lucide-react';
import { FamilyLink } from '@/api/contracts';

export const FamilyLinksPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [links, setLinks] = useState<FamilyLink[]>(data.familyLinks);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [seniorMembershipId, setSeniorMembershipId] = useState('');
  const [relationship, setRelationship] = useState<FamilyLink['relationship']>('Son');
  const [submitted, setSubmitted] = useState(false);

  const handleRevokeLink = (linkId: string) => {
    if (confirm('Are you sure you wish to revoke family proxy access for this senior?')) {
      mockStore.updateData((draft) => {
        const target = draft.familyLinks.find((l) => l.id === linkId);
        if (target) {
          target.status = 'Revoked';
          target.consentGranted = false;
        }
      });

      mockStore.writeAudit(
        user?.id || 'fm-1',
        user?.fullName || 'Family User',
        'FM',
        'DELETE',
        'FamilyLink',
        linkId,
        'Revoked family proxy access link',
        null,
        { status: 'Revoked' },
        undefined
      );

      setLinks([...mockStore.getData().familyLinks]);
    }
  };

  const handleRequestLink = (e: React.FormEvent) => {
    e.preventDefault();
    const senior = data.seniorCitizens.find(
      (s) => s.membershipId.toUpperCase() === seniorMembershipId.trim().toUpperCase()
    );

    if (!senior) {
      alert('Membership ID not found. Please verify the ID on your elder’s physical card.');
      return;
    }

    const newLink: FamilyLink = {
      id: `link-${Date.now()}`,
      seniorId: senior.id,
      familyUserId: user?.id || 'u-fm-1',
      relationship,
      consentGranted: false,
      consentGrantedAt: new Date().toISOString(),
      status: 'Pending',
    };

    mockStore.updateData((draft) => {
      draft.familyLinks.push(newLink);
    });

    mockStore.writeAudit(
      user?.id || 'fm-1',
      user?.fullName || 'Family Member',
      'FM',
      'CREATE',
      'FamilyLink',
      newLink.id,
      `Requested family link to senior ${senior.fullName} (${senior.membershipId})`,
      null,
      newLink,
      senior.centreId
    );

    setLinks([...mockStore.getData().familyLinks]);
    setShowRequestModal(false);
    setSeniorMembershipId('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Family Authorizations & Consent Governance"
        description="Formal proxy link records connecting family members to senior citizens with consent gating (Group O)"
        breadcrumb={[
          { label: 'Family Portal', href: '/family' },
          { label: 'Authorizations' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowRequestModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Request Link to Senior
          </Button>
        }
      />

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Link request submitted! The centre coordinator will verify consent with your elder.</span>
        </div>
      )}

      {/* Links Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Link ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Relationship</th>
              <th className="py-3 px-4">Elder Consent on File</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {links.map((lnk) => {
              const senior = data.seniorCitizens.find((s) => s.id === lnk.seniorId);

              return (
                <tr key={lnk.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-mono text-text-muted">{lnk.id}</td>
                  <td className="py-3.5 px-4 font-medium text-text-primary">
                    {senior?.fullName || 'Senior Member'} ({senior?.membershipId})
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{lnk.relationship}</td>
                  <td className="py-3.5 px-4">
                    {lnk.consentGranted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Granted ({lnk.consentGrantedAt.split('T')[0]})
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending Verification</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip
                      label={lnk.status}
                      variant={lnk.status === 'Active' ? 'active' : lnk.status === 'Pending' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {lnk.status === 'Active' && (
                      <button
                        onClick={() => handleRevokeLink(lnk.id)}
                        className="text-xs text-rose-700 hover:underline font-semibold"
                      >
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Request Link to Senior Citizen</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleRequestLink} className="space-y-4">
              <div>
                <label className="font-medium text-text-primary block mb-1">
                  Elder's Physical Membership ID (Printed on Card)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VV-PUN-26-00042"
                  value={seniorMembershipId}
                  onChange={(e) => setSeniorMembershipId(e.target.value)}
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary font-mono uppercase focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="font-medium text-text-primary block mb-1">Your Relationship to Elder</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Other">Other Family Relative</option>
                </select>
              </div>

              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-text-muted leading-relaxed">
                To protect senior citizen privacy under the DPDP Act, your request will be verified verbally by the local
                Ekta Hub Centre Coordinator before proxy access is activated.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={!seniorMembershipId.trim()}>
                  Submit Link Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
