import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { RefreshCw, Search, CheckCircle2, AlertOctagon, Clock, Send } from 'lucide-react';
import { OutboundMessage } from '@/api/contracts';

export const DeliveryLedgerPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();
  const [messages, setMessages] = useState<OutboundMessage[]>(data.outboundMessages);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredMessages = messages.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.recipientName.toLowerCase().includes(q) ||
        m.recipientPhone.includes(q) ||
        m.templateCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRetry = (msgId: string) => {
    setRetryingId(msgId);
    setTimeout(() => {
      mockStore.updateData((draft) => {
        const target = draft.outboundMessages.find((m) => m.id === msgId);
        if (target) {
          target.status = 'Delivered';
          target.retryCount += 1;
          target.failureReason = undefined;
          target.deliveredAt = new Date().toISOString();
        }
      });

      mockStore.writeAudit(
        user?.id || 'unknown',
        user?.fullName || 'System Administrator',
        user?.role || 'SA',
        'UPDATE',
        'OutboundMessage',
        msgId,
        'Retried failed notification transmission successfully',
        { status: 'Failed' },
        { status: 'Delivered' },
        undefined
      );

      setMessages([...mockStore.getData().outboundMessages]);
      setRetryingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="WhatsApp Transmission & Delivery Ledger"
        description="Comprehensive message log tracking Queued, Delivered, Read and Failed dispatches (FR-28 & FR-55)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Delivery Ledger' },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search recipient name, phone, or template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses ({messages.length})</option>
            <option value="Delivered">Delivered</option>
            <option value="Read">Read (Blue Ticks)</option>
            <option value="Failed">Failed (Action Required)</option>
            <option value="Sent">Sent (Pending Handset)</option>
            <option value="Queued">Queued in Buffer</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filteredMessages.length}</strong> outbound message logs
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Template Code</th>
              <th className="py-3 px-4">Dispatched At</th>
              <th className="py-3 px-4">Status & Timeline</th>
              <th className="py-3 px-4">Failure Reason / Notes</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary">
            {filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">
                  No notification logs found matching filters.
                </td>
              </tr>
            ) : (
              filteredMessages.slice(0, 50).map((msg) => (
                <tr key={msg.id} className="hover:bg-bg-subtle/40 text-xs">
                  <td className="py-3 px-4">
                    <div className="font-medium text-text-primary">{msg.recipientName}</div>
                    <div className="text-[11px] font-mono text-text-muted">{msg.recipientPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted">{msg.templateCode}</td>
                  <td className="py-3 px-4 text-text-muted">
                    {msg.sentAt ? msg.sentAt.replace('T', ' ').slice(0, 16) : msg.scheduledFor.split('T')[0]}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <StatusChip
                        label={msg.status}
                        variant={msg.status === 'Delivered' || msg.status === 'Read' ? 'active' : msg.status === 'Failed' ? 'danger' : 'warning'}
                      />
                      {msg.status === 'Read' && (
                        <span className="text-blue-600 font-bold text-xs" title="Read receipt received">✓✓</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {msg.failureReason ? (
                      <span className="text-rose-700 font-medium">{msg.failureReason}</span>
                    ) : (
                      <span>Delivered via BSP provider</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {msg.status === 'Failed' && (
                      <Can capability="deliveryStatus" action="update">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(msg.id)}
                          disabled={retryingId === msg.id}
                          className="text-xs"
                        >
                          <RefreshCw className={`w-3 h-3 mr-1 ${retryingId === msg.id ? 'animate-spin' : ''}`} />
                          Retry
                        </Button>
                      </Can>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredMessages.length > 50 && (
          <div className="p-3 bg-bg-subtle text-center text-xs text-text-muted border-t border-border-hairline">
            Displaying first 50 logs. Use search or filter to refine.
          </div>
        )}
      </div>
    </div>
  );
};
