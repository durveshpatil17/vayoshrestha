import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { MessageSquarePlus, Search, Clock, CheckCircle2, User, Send } from 'lucide-react';
import { ComplaintTicket } from '@/api/contracts';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [complaints, setComplaints] = useState<ComplaintTicket[]>(data.complaints);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      senderName: user?.fullName || 'Staff Coordinator',
      senderRole: user?.role || 'CC',
      message: replyText,
      sentAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      const target = draft.complaints.find((c) => c.id === selectedTicket.id);
      if (target) {
        target.replies.push(newReply);
        target.status = 'InProgress';
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'UPDATE',
      'ComplaintTicket',
      selectedTicket.id,
      `Replied to complaint: ${replyText}`,
      null,
      newReply,
      selectedTicket.centreId
    );

    setComplaints([...mockStore.getData().complaints]);
    setSelectedTicket({
      ...selectedTicket,
      replies: [...selectedTicket.replies, newReply],
      status: 'InProgress',
    });
    setReplyText('');
  };

  const handleResolveTicket = (ticketId: string) => {
    mockStore.updateData((draft) => {
      const target = draft.complaints.find((c) => c.id === ticketId);
      if (target) {
        target.status = 'Resolved';
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'CC',
      'UPDATE',
      'ComplaintTicket',
      ticketId,
      'Resolved complaint ticket',
      { status: 'InProgress' },
      { status: 'Resolved' },
      undefined
    );

    setComplaints([...mockStore.getData().complaints]);
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Grievance & Support Desk"
        description="Formal redressal of complaints raised by senior citizens, family members, or staff (FR-53)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Complaints' },
        ]}
        actions={
          <Link to="/complaints/new">
            <Button variant="primary" size="sm">
              <MessageSquarePlus className="w-4 h-4 mr-1.5" />
              Lodge New Grievance
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List Left Rail */}
        <div className="lg:col-span-6 bg-bg-base border border-border-hairline rounded overflow-hidden shadow-sm">
          <div className="p-3 bg-bg-subtle border-b border-border-hairline text-xs font-semibold text-text-primary">
            Active Grievance Tickets ({complaints.length})
          </div>

          <div className="divide-y divide-border-hairline text-xs">
            {complaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedTicket(c)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicket?.id === c.id ? 'bg-accent/5 border-l-2 border-accent' : 'hover:bg-bg-subtle/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-text-primary">{c.subject}</div>
                  <StatusChip
                    label={c.status}
                    variant={c.status === 'Resolved' ? 'active' : c.status === 'InProgress' ? 'warning' : 'neutral'}
                  />
                </div>

                <div className="text-text-muted mt-1 text-[11px]">
                  Raised by <strong>{c.complainantName}</strong> ({c.complainantRole}) • {c.category}
                </div>

                <p className="text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Detail & Thread Right Rail */}
        <div className="lg:col-span-6 bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm text-xs">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-border-hairline pb-3">
                <div>
                  <h3 className="font-serif text-base font-semibold text-text-primary">{selectedTicket.subject}</h3>
                  <div className="text-text-muted text-[11px] mt-0.5">
                    Ticket ID: <span className="font-mono">{selectedTicket.id}</span> • Category: {selectedTicket.category}
                  </div>
                </div>

                {selectedTicket.status !== 'Resolved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Mark Resolved
                  </Button>
                )}
              </div>

              <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
                <div><strong>Complainant:</strong> {selectedTicket.complainantName} ({selectedTicket.complainantContact})</div>
                <div className="text-text-primary leading-relaxed mt-1">{selectedTicket.description}</div>
              </div>

              {/* Thread Replies */}
              <div className="space-y-3 pt-2">
                <span className="font-semibold text-text-primary block">Staff Redressal Conversation:</span>

                {selectedTicket.replies.length === 0 ? (
                  <p className="text-text-muted italic">No replies posted yet.</p>
                ) : (
                  selectedTicket.replies.map((rep) => (
                    <div key={rep.id} className="p-3 bg-white border border-border-hairline rounded space-y-1">
                      <div className="flex justify-between font-medium text-text-primary">
                        <span>{rep.senderName} ({rep.senderRole})</span>
                        <span className="text-[10px] text-text-muted">{rep.sentAt.split('T')[0]}</span>
                      </div>
                      <div className="text-text-muted leading-relaxed">{rep.message}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'Resolved' && (
                <form onSubmit={handleSendReply} className="pt-3 border-t border-border-hairline space-y-2">
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official grievance response or resolution action..."
                    className="w-full border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm">
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Post Response
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="py-24 text-center text-text-muted">
              Select a grievance ticket from the left column to view details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
