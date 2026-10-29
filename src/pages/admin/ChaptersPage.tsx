import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import {
  Building2,
  Users,
  Phone,
  Clock,
  Plus,
  Edit,
  UserCheck,
  ShieldAlert,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Chapter, DutyRosterMember } from '@/api/contracts';

export const ChaptersPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const data = mockStore.getData();

  const isSA = user?.role === 'SA';
  const isNM = user?.role === 'NM';
  const isRA = user?.role === 'RA';
  const isCM = user?.role === 'CM';
  const canEditRoster = isSA || isNM || isRA || isCM;

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    data.chapters[0]?.id || ''
  );
  const selectedChapter =
    data.chapters.find((c) => c.id === selectedChapterId) || data.chapters[0];

  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [newRosterName, setNewRosterName] = useState('');
  const [newRosterRole, setNewRosterRole] = useState<'CM' | 'CT' | 'VF'>('CM');
  const [newRosterShift, setNewRosterShift] = useState('08:00 - 16:00 IST');
  const [newRosterPhone, setNewRosterPhone] = useState('+91');
  const [newRosterPrimary, setNewRosterPrimary] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddRosterMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapter) return;

    if (!selectedChapter.onDutyRoster) {
      selectedChapter.onDutyRoster = [];
    }

    const newMember: DutyRosterMember = {
      userId: `u-roster-${Date.now()}`,
      userName: newRosterName.trim(),
      role: newRosterRole,
      shift: newRosterShift,
      onCallPhone: newRosterPhone.trim(),
      isPrimaryResponder: newRosterPrimary,
    };

    if (newRosterPrimary) {
      selectedChapter.onDutyRoster.forEach((m) => (m.isPrimaryResponder = false));
    }

    selectedChapter.onDutyRoster.push(newMember);

    data.auditEvents.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user?.id || 'SYSTEM',
      actorRole: user?.role || 'CM',
      chapterId: selectedChapter.id,
      action: 'ROSTER_UPDATE',
      entityType: 'CHAPTER',
      entityId: selectedChapter.id,
      details: `Added on-duty responder ${newRosterName} (${newRosterShift}) to SOS escalation chain.`,
    });

    mockStore.persist();
    setRosterModalOpen(false);
    setNewRosterName('');
    setFeedback(`Responder ${newMember.userName} added to ${selectedChapter.name} SOS roster.`);
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Regional Chapters & Emergency Duty Rosters"
          description="Manage Ekta Hub chapter details, coverage areas, languages served, and on-call SOS escalation rosters."
        />
        {canEditRoster && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setRosterModalOpen(true)}
            className="text-xs gap-1.5 bg-accent"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Roster Member
          </Button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-accent-tint border border-accent/20 rounded text-xs text-accent flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-semibold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Chapter Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-hairline">
        {data.chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChapterId(ch.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedChapterId === ch.id
                ? 'bg-accent text-white font-semibold'
                : 'bg-white border border-border-hairline text-text-primary hover:bg-surface-subtle'
            }`}
          >
            {ch.name} ({ch.code})
          </button>
        ))}
      </div>

      {/* Selected Chapter Details */}
      {selectedChapter && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Metadata Card (Left 1 col) */}
          <div className="bg-white border border-border-hairline rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                Hub Information
              </h3>
              <StatusChip status="success" label={selectedChapter.status || 'Active'} />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-text-muted">Hub Name & Code:</span>
                <div className="font-semibold text-text-primary text-sm mt-0.5">
                  {selectedChapter.name} ({selectedChapter.code})
                </div>
              </div>
              <div>
                <span className="text-text-muted">Assigned Region:</span>
                <div className="tabular-nums text-text-primary font-semibold">
                  {selectedChapter.regionId}
                </div>
              </div>
              <div>
                <span className="text-text-muted">Physical Address:</span>
                <div className="text-text-primary mt-0.5">{selectedChapter.address}</div>
              </div>
              <div>
                <span className="text-text-muted">Languages Served:</span>
                <div className="text-text-primary font-semibold mt-0.5">
                  {selectedChapter.languagesServed?.join(', ') || 'English'}
                </div>
              </div>
              <div>
                <span className="text-text-muted">Lead Coordinator:</span>
                <div className="text-text-primary font-semibold mt-0.5">
                  {selectedChapter.contactPerson} ({selectedChapter.contactPhone})
                </div>
              </div>
            </div>
          </div>

          {/* SOS Escalation Duty Roster (Right 2 cols) */}
          <div className="lg:col-span-2 bg-white border border-border-hairline rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <div>
                <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accent" />
                  On-Duty Emergency Response Roster
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Staff receiving automated phone notifications when an unacknowledged SOS escalates.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(!selectedChapter.onDutyRoster || selectedChapter.onDutyRoster.length === 0) ? (
                <div className="p-6 bg-surface-subtle border border-border-hairline rounded text-center text-xs text-text-muted">
                  No active responders in this chapter's roster. Click "Add Roster Member" to assign
                  on-duty staff.
                </div>
              ) : (
                selectedChapter.onDutyRoster.map((member, idx) => (
                  <div
                    key={member.userId || idx}
                    className="p-3 bg-surface-subtle border border-border-hairline rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{member.userName}</span>
                        {member.isPrimaryResponder && (
                          <span className="px-1.5 py-0.2 text-xs bg-accent text-white rounded font-semibold">
                            Primary On-Call
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 text-xs bg-white border border-border-hairline rounded text-text-muted tabular-nums">
                          {member.role}
                        </span>
                      </div>
                      <span className="text-text-muted">Duty Shift: {member.shift}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="tabular-nums text-text-primary font-semibold">
                        {member.onCallPhone}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Roster Member Modal */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-border-hairline rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-base text-text-primary flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              Add On-Duty Emergency Responder
            </h3>

            <form onSubmit={handleAddRosterMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-muted mb-1">Responder Full Name:</label>
                <input
                  type="text"
                  value={newRosterName}
                  onChange={(e) => setNewRosterName(e.target.value)}
                  placeholder="e.g. Karthik Swaminathan"
                  className="w-full px-3 py-2 border border-border-hairline rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-muted mb-1">Role in Chapter:</label>
                  <select
                    value={newRosterRole}
                    onChange={(e) => setNewRosterRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border-hairline rounded bg-white"
                  >
                    <option value="CM">Chapter Manager (CM)</option>
                    <option value="CT">Care Responder (CT)</option>
                    <option value="VF">Field Volunteer (VF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-muted mb-1">Shift Hours:</label>
                  <input
                    type="text"
                    value={newRosterShift}
                    onChange={(e) => setNewRosterShift(e.target.value)}
                    placeholder="08:00 - 16:00 IST"
                    className="w-full px-3 py-2 border border-border-hairline rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-muted mb-1">
                  On-Call Emergency Mobile (+91):
                </label>
                <input
                  type="text"
                  value={newRosterPhone}
                  onChange={(e) => setNewRosterPhone(e.target.value)}
                  placeholder="+919844011223"
                  className="w-full px-3 py-2 border border-border-hairline rounded tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={newRosterPrimary}
                    onChange={(e) => setNewRosterPrimary(e.target.checked)}
                    className="text-accent rounded"
                  />
                  <span>Designate as Primary Escalation Contact for this hub</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRosterModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-accent">
                  Save Responder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
