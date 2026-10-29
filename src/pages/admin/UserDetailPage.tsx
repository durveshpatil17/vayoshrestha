import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ROLES, RoleCode } from '@/permissions/matrix';
import { ArrowLeft, CheckCircle2, Shield, Lock, Building2 } from 'lucide-react';
import { UserAccount } from '@/api/contracts';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const data = mockStore.getData();

  const isNew = id === 'new';
  const targetUser = !isNew ? data.users.find((u) => u.id === id) : null;

  const [fullName, setFullName] = useState(targetUser?.fullName || '');
  const [email, setEmail] = useState(targetUser?.email || '');
  const [phone, setPhone] = useState(targetUser?.phone || '');
  const [role, setRole] = useState<RoleCode>((targetUser?.role as RoleCode) || 'VF');
  const [assignedCentres, setAssignedCentres] = useState<string[]>(targetUser?.assignedCentres || ['HUB-PUN']);
  const [isActive, setIsActive] = useState(targetUser?.isActive ?? true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const u: UserAccount = {
      id: targetUser?.id || `u-${Date.now()}`,
      email,
      phone,
      fullName,
      role,
      assignedCentres: role === 'CM' || role === 'VF' ? assignedCentres : [],
      isActive,
      mfaEnabled: role === 'SA' || role === 'NM',
      mustChangePassword: isNew,
      failedLoginAttempts: 0,
    };

    mockStore.updateData((draft) => {
      if (targetUser) {
        const idx = draft.users.findIndex((item) => item.id === u.id);
        if (idx !== -1) draft.users[idx] = u;
      } else {
        draft.users.push(u);
      }
    });

    mockStore.writeAudit(
      currentUser?.id || 'unknown',
      currentUser?.fullName || 'Admin',
      'SA',
      targetUser ? 'UPDATE' : 'CREATE',
      'USER',
      u.id,
      `${targetUser ? 'Updated' : 'Invited'} user account: ${fullName} (${role})`,
      'Administrative user account modification',
      { before: targetUser, after: u }
    );

    setSubmitted(true);
    setTimeout(() => {
      navigate('/admin/users');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isNew ? 'Invite New User Account' : `Manage User: ${targetUser?.fullName}`}
        description={isNew ? 'Create login credentials and assign centre scopes' : `${targetUser?.role} • ${targetUser?.email}`}
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Users', href: '/admin/users' },
          { label: isNew ? 'Invite' : targetUser?.fullName || 'Details' },
        ]}
        actions={
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Users
            </Button>
          </Link>
        }
      />

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-semibold text-emerald-900">User Account Recorded!</h3>
          <p className="text-xs text-emerald-800">Redirecting to user directory...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-base border border-border-hairline rounded p-6 space-y-5">
          <h3 className="text-base font-semibold text-text-primary">Identity & Role Credentials</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Joshi"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Role Designation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleCode)}
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                {Object.entries(ROLES).map(([code, def]) => (
                  <option key={code} value={code}>
                    {code} — {def.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@vayohvikas.org"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">Phone Number (+91)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9822011223"
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {(role === 'CM' || role === 'VF') && (
            <div className="pt-2 border-t border-border-hairline">
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Assigned Ekta Hub Centres (FR-03 Scope Isolation)
              </label>
              <div className="flex flex-wrap gap-3">
                {data.centres.map((c) => (
                  <label key={c.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assignedCentres.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) setAssignedCentres([...assignedCentres, c.id]);
                        else setAssignedCentres(assignedCentres.filter((id) => id !== c.id));
                      }}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>{c.name} ({c.code})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border-hairline flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs cursor-pointer font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-accent focus:ring-accent"
              />
              <span>Account Active (Allowed to sign in)</span>
            </label>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Account Credentials
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
