import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, Trash2, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';

export const DataGovernancePage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [activeTab, setActiveTab] = useState<'requests' | 'retention' | 'checklist'>('requests');
  const [requests, setRequests] = useState([
    {
      id: 'dpr-1',
      type: 'Data Correction',
      memberId: data.seniorCitizens[0]?.id || 'm-1',
      memberName: data.seniorCitizens[0]?.fullName || 'Kamala Deshpande',
      requestedAt: '2026-10-25',
      details: 'Correction of misspelled surname on membership record.',
      status: 'Pending',
    },
    {
      id: 'dpr-2',
      type: 'Deletion (Right to be Forgotten)',
      memberId: data.seniorCitizens[6]?.id || 'm-7',
      memberName: data.seniorCitizens[6]?.fullName || 'Vithal Shinde',
      requestedAt: '2026-10-24',
      details: 'Elder relocating permanently to another state; requested record purging.',
      status: 'Pending',
    },
  ]);

  const handleExecuteRequest = (reqId: string) => {
    if (user?.role !== 'SA' && user?.role !== 'NM') {
      alert('Only SA or NM can execute DPDP data erasure / correction operations.');
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Executed' } : r))
    );

    mockStore.writeAudit(
      user.id,
      user.fullName,
      user.role,
      'DELETE',
      'DataGovernanceRequest',
      reqId,
      `Executed DPDP compliance request (${reqId})`,
      { status: 'Pending' },
      { status: 'Executed' },
      undefined
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="DPDP Act Privacy & Data Governance"
        description="Fulfillment of senior citizen rights: data minimization, correction requests, and right-to-erasure workflows (Section 0 & FR-50)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Data Governance' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border-hairline gap-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Senior Correction & Deletion Queue ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('retention')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'retention'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Statutory Retention Schedules
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Data Minimization Verification
        </button>
      </div>

      {activeTab === 'requests' ? (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Right Invoked</th>
                <th className="py-3 px-4">Senior Citizen</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-bg-subtle/40">
                  <td className="py-3.5 px-4 font-mono text-text-muted">{r.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary">{r.type}</td>
                  <td className="py-3.5 px-4 font-medium">{r.memberName}</td>
                  <td className="py-3.5 px-4 max-w-xs text-text-muted">{r.details}</td>
                  <td className="py-3.5 px-4 text-text-muted">{r.requestedAt}</td>
                  <td className="py-3.5 px-4">
                    <StatusChip label={r.status} variant={r.status === 'Executed' ? 'active' : 'warning'} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status === 'Pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleExecuteRequest(r.id)}
                        className="text-xs"
                      >
                        Execute Request
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'retention' ? (
        <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm text-xs">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Legally Mandated Retention Schedules</h4>

          <div className="space-y-3">
            <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Attendance Records & Ledger</span>
                <span className="text-text-muted block text-[11px]">CSR statutory audit requirement: 7 Years</span>
              </div>
              <span className="font-mono text-text-primary font-medium">Auto-Archived after 3 Years</span>
            </div>

            <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Communication Logs & WhatsApp Outbound</span>
                <span className="text-text-muted block text-[11px]">Operational delivery audit: 180 Days</span>
              </div>
              <span className="font-mono text-text-primary font-medium">Purged after 180 Days</span>
            </div>

            <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary">Cryptographic Security Audit Events</span>
                <span className="text-text-muted block text-[11px]">Permanent immutable hash chain: Indefinite</span>
              </div>
              <span className="font-mono text-text-primary font-medium">Permanent Append-Only</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm text-xs">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Data Minimization Verification Audit</h4>

          <div className="space-y-2">
            {[
              'Zero National Identity (Aadhaar) collection (strictly avoided per concept note)',
              'Zero detailed clinical or diagnostic histories stored in database',
              'Zero biometric face recognition or GPS continuous tracking',
              'Mobile numbers masked by default (••••••3421) on field volunteer rosters',
              'Small numbers (<5) suppressed in all CSR and donor reports',
            ].map((check, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/50 text-emerald-950 rounded border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
