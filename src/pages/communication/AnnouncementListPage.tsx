import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Send, Plus, Users, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Announcement } from '@/api/contracts';

export const AnnouncementListPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();
  const [announcements, setAnnouncements] = useState<Announcement[]>(data.announcements);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAnnouncements = announcements.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleApprove = (annId: string) => {
    if (user?.role !== 'NM') {
      alert('Only NGO Management (NM) can approve broadcast announcements.');
      return;
    }

    mockStore.updateData((draft) => {
      const target = draft.announcements.find((a) => a.id === annId);
      if (target) {
        target.status = 'Approved';
        target.approvedBy = user.fullName;
        target.approvedAt = new Date().toISOString();
      }
    });

    mockStore.writeAudit(
      user.id,
      user.fullName,
      'NM',
      'APPROVE',
      'Announcement',
      annId,
      'Approved broadcast announcement for transmission',
      { status: 'Submitted' },
      { status: 'Approved' },
      undefined
    );

    setAnnouncements([...mockStore.getData().announcements]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Broadcast Announcements & Educational Content"
        description="Governed broadcast campaigns with strict consent-gating and maker-checker approval (FR-27 & FR-54)"
        breadcrumb={[
          { label: 'Communication', href: '/communication' },
          { label: 'Announcements' },
        ]}
        actions={
          <Can capability="announcements" action="create">
            <Link to="/communication/announcements/new">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Compose Announcement
              </Button>
            </Link>
          </Can>
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-2">
          {['all', 'Approved', 'Submitted', 'Draft', 'Sent'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                statusFilter === st
                  ? 'bg-accent text-white'
                  : 'bg-bg-subtle text-text-muted hover:text-text-primary'
              }`}
            >
              {st === 'all' ? 'All Broadcasts' : st}
            </button>
          ))}
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filteredAnnouncements.length}</strong> broadcast campaign{filteredAnnouncements.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-bg-base border border-border-hairline rounded p-12 text-center text-text-muted text-sm">
            No announcements found in this status.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 hover:border-border-strong transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-hairline pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-semibold text-text-primary">{ann.title}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-subtle text-text-muted border border-border-hairline">
                      {ann.category}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted">
                    Submitted by {ann.submittedBy} on {ann.submittedAt.split('T')[0]}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusChip
                    label={ann.status}
                    variant={ann.status === 'Approved' || ann.status === 'Sent' ? 'active' : ann.status === 'Submitted' ? 'warning' : 'neutral'}
                  />
                  {ann.status === 'Submitted' && user?.role === 'NM' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(ann.id)}
                      className="text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approve Broadcast
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="bg-[#E7F3EE] p-3.5 rounded border border-[#D0E5DC] text-xs text-text-primary font-sans leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </div>

              {/* Breakdown Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-bg-subtle p-3 rounded border border-border-hairline">
                <div>
                  <span className="text-text-muted block">Target Audience</span>
                  <span className="font-semibold text-text-primary">{ann.audienceSize} Elders</span>
                </div>
                <div>
                  <span className="text-text-muted block">Excluded (No Consent)</span>
                  <span className="font-semibold text-amber-700">{ann.excludedNoConsent} Excluded</span>
                </div>
                <div>
                  <span className="text-text-muted block">Excluded (Opted Out)</span>
                  <span className="font-semibold text-rose-700">{ann.excludedOptedOut} Opted-out</span>
                </div>
                <div>
                  <span className="text-text-muted block">Scheduled Date</span>
                  <span className="font-semibold text-text-primary">{ann.scheduledFor.split('T')[0]}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
