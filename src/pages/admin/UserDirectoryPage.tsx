import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { ROLES, RoleCode } from '@/permissions/matrix';
import { Plus, Search, Shield, Building2, Lock, Unlock, KeyRound, UserCheck, ArrowRight } from 'lucide-react';
import { UserAccount } from '@/api/contracts';

export const UserDirectoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [users, setUsers] = useState<UserAccount[]>(data.users);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    }
    return true;
  });

  const handleUnlockUser = (userId: string) => {
    mockStore.updateData((draft) => {
      const target = draft.users.find((u) => u.id === userId);
      if (target) {
        target.failedLoginAttempts = 0;
        target.lockoutUntil = null;
        target.isActive = true;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Admin',
      'SA',
      'UPDATE',
      'USER',
      userId,
      'Admin unlocked account and reset failed attempt counter',
      'Admin security unlock',
      { locked: false }
    );

    setUsers([...mockStore.getData().users]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="User & Access Directory"
        description="Institutional user accounts, role-based capability scoping, and centre assignments (FR-01 – FR-04)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Users' },
        ]}
        actions={
          <Can capability="usersAndRoles" action="create">
            <Link to="/admin/users/new">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Invite New User
              </Button>
            </Link>
          </Can>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search user name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Roles ({users.length})</option>
            {Object.entries(ROLES).map(([code, def]) => (
              <option key={code} value={code}>
                {code} — {def.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filteredUsers.length}</strong> active staff & partner accounts
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Role & Scope</th>
              <th className="py-3 px-4">Contact Coordinates</th>
              <th className="py-3 px-4">Assigned Centres</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {filteredUsers.map((u) => {
              const isLocked = u.lockedUntil && new Date(u.lockedUntil) > new Date();

              return (
                <tr key={u.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-text-primary">{u.fullName}</div>
                    <div className="font-mono text-[11px] text-text-muted">{u.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-text-primary">{ROLES[u.role as RoleCode]?.name || u.role}</div>
                    <div className="text-text-muted text-[11px] font-mono">({u.role}) • {ROLES[u.role as RoleCode]?.scopeDescription}</div>
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    <div>{u.email}</div>
                    <div className="font-mono text-[11px]">{u.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.assignedCentres && u.assignedCentres.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {u.assignedCentres.map((cId) => (
                          <span key={cId} className="font-mono text-[10px] px-1.5 py-0.5 bg-bg-subtle border border-border-hairline rounded text-text-muted">
                            {data.centres.find((c) => c.id === cId)?.code || cId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-text-muted italic">Organisation-wide</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {isLocked ? (
                      <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3" /> Locked (5 fails)
                      </span>
                    ) : u.isActive ? (
                      <StatusChip label="Active" variant="active" />
                    ) : (
                      <StatusChip label="Inactive" variant="neutral" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isLocked && user?.role === 'SA' && (
                        <button
                          onClick={() => handleUnlockUser(u.id)}
                          className="text-xs text-emerald-700 hover:underline font-semibold"
                        >
                          Unlock
                        </button>
                      )}
                      <Link to={`/admin/users/${u.id}`} className="text-accent font-semibold hover:underline">
                        Manage →
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
