import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Shield, ShieldAlert, CheckCircle2, Search, Bell, Users, Clock } from 'lucide-react';

export const ConsentRegistryPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'OptedIn' | 'OptedOut' | 'Pending'>('all');
  const [bulkReminderSuccess, setBulkReminderSuccess] = useState(false);

  const members = data.seniorCitizens.filter((m) => {
    if (filter !== 'all') {
      if (filter === 'OptedOut' && !m.optedOutChannels.includes('WhatsApp')) return false;
      if (filter === 'OptedIn' && (m.consentStatus !== 'OptedIn' || m.optedOutChannels.includes('WhatsApp'))) return false;
      if (filter === 'Pending' && m.consentStatus !== 'Pending') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.fullName.toLowerCase().includes(q) || m.membershipId.toLowerCase().includes(q);
    }
    return true;
  });

  const optedInCount = data.seniorCitizens.filter((m) => m.consentStatus === 'OptedIn' && !m.optedOutChannels.includes('WhatsApp')).length;
  const optedOutCount = data.seniorCitizens.filter((m) => m.optedOutChannels.includes('WhatsApp')).length;
  const pendingCount = data.seniorCitizens.filter((m) => m.consentStatus === 'Pending').length;

  const handleBulkConsentReminder = () => {
    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'PM',
      'CREATE',
      'ConsentReminder',
      'bulk',
      `Queued assisted consent collection tasks for ${pendingCount} elders`,
      null,
      { count: pendingCount },
      undefined
    );

    setBulkReminderSuccess(true);
    setTimeout(() => setBulkReminderSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Consent & Communication Registry"
        description="Data Protection & DPDP Act compliance tracking for senior citizen communication preferences (FR-29)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Consent Registry' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkConsentReminder}
            disabled={pendingCount === 0}
          >
            <Bell className="w-4 h-4 mr-1.5" />
            Remind Field Staff for Missing Consents ({pendingCount})
          </Button>
        }
      />

      {bulkReminderSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Follow-up tasks generated for centre coordinators to collect physical/verbal consent forms.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Digital Consent Granted (Opted In)</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{optedInCount} Elders</div>
          <div className="text-xs text-text-muted mt-0.5">Eligible for session reminders and announcements</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Channel Opted Out (STOP Recorded)</div>
          <div className="text-2xl font-serif font-bold text-rose-700 mt-1">{optedOutCount} Elders</div>
          <div className="text-xs text-text-muted mt-0.5">Strictly blocked from outbound WhatsApp messages</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Pending Consent Verification</div>
          <div className="text-2xl font-serif font-bold text-amber-700 mt-1">{pendingCount} Elders</div>
          <div className="text-xs text-text-muted mt-0.5">Assisted registration verification needed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by senior name or membership ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'OptedIn', 'OptedOut', 'Pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filter === st
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                {st === 'all' ? 'All Records' : st === 'OptedIn' ? 'Opted In' : st === 'OptedOut' ? 'Opted Out' : 'Pending'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{members.length}</strong> senior citizen records
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Membership ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Ekta Hub</th>
              <th className="py-3 px-4">Consent Status</th>
              <th className="py-3 px-4">WhatsApp Channel</th>
              <th className="py-3 px-4 text-right">Consent Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {members.slice(0, 50).map((m) => {
              const centre = data.centres.find((c) => c.id === m.centreId);
              const isOptedOut = m.optedOutChannels.includes('WhatsApp');

              return (
                <tr key={m.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3 px-4 font-mono text-text-muted">{m.membershipId}</td>
                  <td className="py-3 px-4 font-medium text-text-primary">{m.fullName}</td>
                  <td className="py-3 px-4 text-text-muted">{centre?.name || m.centreId}</td>
                  <td className="py-3 px-4">
                    <StatusChip
                      label={m.consentStatus}
                      variant={m.consentStatus === 'OptedIn' ? 'active' : m.consentStatus === 'Pending' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    {isOptedOut ? (
                      <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium">
                        Blocked (STOP)
                      </span>
                    ) : m.consentStatus === 'OptedIn' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        Active Messaging
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                        Awaiting Consent
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-text-muted">
                    {m.consentRecordedAt ? 'v2.1' : 'None'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {members.length > 50 && (
          <div className="p-3 bg-bg-subtle text-center text-xs text-text-muted border-t border-border-hairline">
            Displaying first 50 entries of {members.length} records.
          </div>
        )}
      </div>
    </div>
  );
};
