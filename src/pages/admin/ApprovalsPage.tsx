import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle2, XCircle, ShieldCheck, Clock, FileText, Send, Building2 } from 'lucide-react';

interface ApprovalQueueItem {
  id: string;
  category: 'Announcement' | 'Template' | 'Partner' | 'CSR Report' | 'Role Change';
  title: string;
  submittedBy: string;
  submittedAt: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const ApprovalsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [items, setItems] = useState<ApprovalQueueItem[]>([
    {
      id: 'appr-1',
      category: 'Announcement',
      title: 'Seasonal Joint Care & Warm Water Therapy Camp',
      submittedBy: 'Sunita Menon (PM)',
      submittedAt: '2026-10-26 04:00 PM',
      details: 'WhatsApp broadcast to 320 elders across Pune and Nashik hubs. Excludes opted-out members.',
      status: 'Pending',
    },
    {
      id: 'appr-2',
      category: 'Template',
      title: 'WS_CLINIC_DIABETES_CAMP_V1',
      submittedBy: 'Sunita Menon (PM)',
      submittedAt: '2026-10-25 11:30 AM',
      details: 'New HSM template for monthly sugar screening reminder with {name} and {centre} variables.',
      status: 'Pending',
    },
    {
      id: 'appr-3',
      category: 'Partner',
      title: 'Community Partner Organisation 11',
      submittedBy: 'Vikramaditya Rao (Admin)',
      submittedAt: '2026-10-24 02:15 PM',
      details: 'Geriatric physiotherapy clinic partnership in Nagpur. Documents submitted.',
      status: 'Pending',
    },
    {
      id: 'appr-4',
      category: 'CSR Report',
      title: 'Pune & Nashik Model Cluster Mid-Pilot Report',
      submittedBy: 'Sunita Menon (PM)',
      submittedAt: '2026-10-27 10:00 AM',
      details: 'Donor aggregate summary for release to CSR partners with <5 small-number suppression.',
      status: 'Pending',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<ApprovalQueueItem | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
  const [comment, setComment] = useState('');

  const handleResolveAction = () => {
    if (!selectedItem || !actionType) return;

    if (user?.role !== 'NM') {
      alert('Maker-Checker Governance (FR-51): Only NGO Management (NM) has authority to sign off approvals.');
      return;
    }

    const newStatus = actionType === 'Approve' ? 'Approved' : 'Rejected';

    setItems((prev) =>
      prev.map((i) => (i.id === selectedItem.id ? { ...i, status: newStatus } : i))
    );

    mockStore.writeAudit(
      user.id,
      user.fullName,
      'NM',
      'APPROVE',
      selectedItem.category,
      selectedItem.id,
      `${actionType}d ${selectedItem.category}: ${selectedItem.title}. Audit note: ${comment || 'Standard approval'}`,
      { status: 'Pending' },
      { status: newStatus, comment },
      undefined
    );

    setSelectedItem(null);
    setActionType(null);
    setComment('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Unified Maker–Checker Approvals Queue"
        description="Independent executive review of announcements, message templates, partner onboarding, and CSR releases (FR-51 & FR-54)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Approvals' },
        ]}
      />

      {/* Governance Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Maker-Checker Policy (FR-51):</strong> The individual who drafts an item cannot approve it.
          All sensitive outbound broadcasts, external partner additions, and public CSR releases require independent executive approval by NGO Management.
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Item & Category</th>
              <th className="py-3 px-4">Submitted By</th>
              <th className="py-3 px-4">Summary Description</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary text-xs">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-bg-subtle/40">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-text-primary">{item.title}</div>
                  <div className="font-mono text-[11px] text-accent mt-0.5">{item.category}</div>
                </td>
                <td className="py-3.5 px-4 text-text-muted">{item.submittedBy}</td>
                <td className="py-3.5 px-4 max-w-sm text-text-muted leading-relaxed">
                  {item.details}
                </td>
                <td className="py-3.5 px-4 text-text-muted">{item.submittedAt}</td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    label={item.status}
                    variant={item.status === 'Approved' ? 'active' : item.status === 'Pending' ? 'warning' : 'danger'}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  {item.status === 'Pending' && user?.role === 'NM' && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setActionType('Approve');
                        }}
                        className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded hover:bg-emerald-100 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setActionType('Reject');
                        }}
                        className="text-xs px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded hover:bg-rose-100 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {item.status !== 'Pending' && (
                    <span className="text-text-muted">{item.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedItem && actionType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">{actionType} {selectedItem.category}</h3>
              <button onClick={() => setSelectedItem(null)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
              <div><strong>Item:</strong> {selectedItem.title}</div>
              <div><strong>Submitted By:</strong> {selectedItem.submittedBy}</div>
              <div className="text-text-muted mt-1">{selectedItem.details}</div>
            </div>

            <div>
              <label className="font-medium text-text-primary block mb-1">Audit Justification / Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Reason for ${actionType.toLowerCase()}ing this item...`}
                className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>Cancel</Button>
              <Button
                variant={actionType === 'Approve' ? 'primary' : 'danger'}
                size="sm"
                onClick={handleResolveAction}
              >
                Confirm {actionType}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
