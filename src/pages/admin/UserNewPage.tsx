import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { UserAccount, RoleCode } from '@/api/contracts';
import { ArrowLeft, UserPlus, Save, AlertTriangle } from 'lucide-react';

export const UserNewPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleCode>('CM');
  const [regionId, setRegionId] = useState(data.regions[0]?.id || 'REG-S');
  const [chapterId, setChapterId] = useState(data.chapters[0]?.id || 'HUB-BLR');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Full name and email are mandatory.');
      return;
    }

    const existing = data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setErrorMsg('A user account with this email address already exists.');
      return;
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      role,
      assignedRegion: role === 'RA' ? regionId : undefined,
      assignedChapter: role === 'CM' || role === 'VF' ? chapterId : undefined,
      assignedCentres: role === 'CM' || role === 'VF' ? [chapterId] : [],
      isActive: true,
      mfaEnabled: role === 'SA' || role === 'NM' ? true : mfaEnabled,
      failedLoginAttempts: 0,
      mustChangePassword: true,
      lastLoginAt: undefined,
    };

    data.users.push(newUser);

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'SA',
      chapterId: chapterId || 'ORGANISATION',
      action: 'USER_INVITE',
      entityType: 'USER',
      entityId: newUser.id,
      details: `Invited new staff user ${newUser.fullName} (${newUser.email}) as role ${newUser.role}.`,
    });

    mockStore.persist();
    navigate('/admin/users');
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/users')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to User Directory
        </Button>
      </div>

      <PageHeader
        title="Invite New Staff User Account"
        description="Create authorized staff credentials with role-based scope isolation and security enforcement."
      />

      {errorMsg && (
        <div className="p-3 bg-danger-surface border border-danger/30 rounded text-xs text-danger flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-hairline rounded p-6 space-y-4 text-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-text-muted mb-1">
              Full Legal Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Meera Joshi"
              className="w-full px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-text-muted mb-1">
              Institutional Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@vayohvikas.org"
              className="w-full px-3 py-2 border border-border-hairline rounded focus:outline-none focus:border-accent font-mono"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-text-muted mb-1">
              Operational Role <span className="text-danger">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleCode)}
              className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
            >
              <option value="SA">SA — System Administrator</option>
              <option value="NM">NM — NGO Management (Executive)</option>
              <option value="RA">RA — Regional Admin</option>
              <option value="CM">CM — Chapter Manager</option>
              <option value="VF">VF — Field Volunteer</option>
              <option value="CT">CT — Care Team Responder</option>
              <option value="CD">CD — CSR / Donor Reviewer</option>
            </select>
          </div>

          {role === 'RA' && (
            <div>
              <label className="block font-medium text-text-muted mb-1">Assigned Region:</label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
              >
                {data.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(role === 'CM' || role === 'VF') && (
            <div>
              <label className="block font-medium text-text-muted mb-1">Assigned Chapter Hub:</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
              >
                {data.chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border-hairline">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={role === 'SA' || role === 'NM' ? true : mfaEnabled}
              disabled={role === 'SA' || role === 'NM'}
              onChange={(e) => setMfaEnabled(e.target.checked)}
              className="text-accent rounded"
            />
            <span className="text-text-primary">
              Enforce Multi-Factor Authentication (MFA) via TOTP Authenticator App
              {(role === 'SA' || role === 'NM') && ' (Mandatory for SA & NM roles)'}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="gap-1.5 bg-accent">
            <UserPlus className="w-3.5 h-3.5" />
            Create & Send Invitation
          </Button>
        </div>
      </form>
    </div>
  );
};
