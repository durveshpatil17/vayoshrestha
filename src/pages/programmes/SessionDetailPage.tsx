import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Calendar, Clock, Building2, Users, UserCheck, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { SessionRegistration } from '@/api/contracts';

export const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const session = data.sessions.find((s) => s.id === id);
  const registrations = data.sessionRegistrations.filter((r) => r.sessionId === id);
  const [activeTab, setActiveTab] = useState<'participants' | 'notes'>('participants');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [walkInSuccess, setWalkInSuccess] = useState(false);

  if (!session) {
    return (
      <div className="space-y-6">
        <PageHeader title="Session Not Found" breadcrumb={[{ label: 'Schedule', href: '/schedule' }, { label: 'Session' }]} />
        <div className="bg-bg-subtle p-8 rounded border border-border-hairline text-center">
          <p className="text-text-muted">The requested session could not be found or has been removed.</p>
          <Link to="/schedule" className="mt-4 inline-block text-accent font-medium">← Back to Schedule</Link>
        </div>
      </div>
    );
  }

  // Walk-in candidate members (belonging to this centre or nearby)
  const centreMembers = data.seniorCitizens.filter(
    (m) => m.centreId === session.centreId && !registrations.some((r) => r.memberId === m.id)
  );

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    const member = data.seniorCitizens.find((m) => m.id === selectedMemberId);
    if (!member) return;

    const newReg: SessionRegistration = {
      id: `reg-walkin-${Date.now()}`,
      sessionId: session.id,
      memberId: member.id,
      memberName: member.fullName,
      status: 'Confirmed',
      isWalkIn: true,
      registeredAt: new Date().toISOString(),
    };

    mockStore.updateData((draft) => {
      draft.sessionRegistrations.push(newReg);
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (targetSession) {
        targetSession.walkInCount += 1;
        targetSession.confirmedCount += 1;
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'VF',
      'CREATE',
      'SessionRegistration',
      newReg.id,
      `Walk-in registered: ${member.fullName}`,
      null,
      newReg,
      session.centreId
    );

    setWalkInSuccess(true);
    setTimeout(() => {
      setShowWalkInModal(false);
      setWalkInSuccess(false);
      setSelectedMemberId('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={session.programmeTitle}
        description={`Session on ${session.date} at ${session.centreName}`}
        breadcrumb={[
          { label: 'Schedule', href: '/schedule' },
          { label: session.programmeTitle, href: `/programmes/${session.programmeId}` },
          { label: `Session (${session.date})` },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Can capability="attendance" action="create">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWalkInModal(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Walk-in
              </Button>
              <Link to={`/attendance/session/${session.id}`}>
                <Button variant="primary" size="sm">
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  {session.attendanceRecorded ? 'Review Attendance' : 'Mark Attendance'}
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Date & Timing</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">{session.date}</div>
          <div className="text-xs text-text-muted mt-0.5">{session.startTime} – {session.endTime}</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            <Building2 className="w-4 h-4 text-accent" />
            <span>Ekta Hub</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">{session.centreName}</div>
          <div className="text-xs text-text-muted mt-0.5">Capacity: {session.capacity} elders</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            <Users className="w-4 h-4 text-accent" />
            <span>Registrations</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {session.confirmedCount} confirmed {session.walkInCount > 0 && `(${session.walkInCount} walk-in)`}
          </div>
          <div className="text-xs text-text-muted mt-0.5">
            {session.waitlistCount > 0 ? `${session.waitlistCount} on waitlist` : 'Zero waitlisted'}
          </div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            <Clock className="w-4 h-4 text-accent" />
            <span>Attendance Status</span>
          </div>
          <div className="mt-1">
            {session.attendanceRecorded ? (
              <StatusChip label="Attendance Recorded" variant="active" />
            ) : (
              <StatusChip label="Pending Attendance" variant="warning" />
            )}
          </div>
          {session.attendanceRecordedAt && (
            <div className="text-xs text-text-muted mt-1">Recorded: {session.attendanceRecordedAt.split('T')[0]}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-hairline">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('participants')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'participants'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Registered Participants ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Session Notes & Logistics
          </button>
        </div>
      </div>

      {activeTab === 'participants' ? (
        <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline text-text-primary">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">
                    No participants registered for this session yet.
                  </td>
                </tr>
              ) : (
                registrations.map((reg, idx) => (
                  <tr key={reg.id} className="hover:bg-bg-subtle/50">
                    <td className="py-3 px-4 text-text-muted text-xs">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      <Link to={`/members/${reg.memberId}`} className="text-text-primary hover:text-accent underline decoration-dotted">
                        {reg.memberName}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip
                        label={reg.status}
                        variant={reg.status === 'Confirmed' ? 'active' : reg.status === 'Waitlisted' ? 'warning' : 'neutral'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      {reg.isWalkIn ? (
                        <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Walk-in
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Pre-booked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-text-muted">
                      {reg.registeredAt.split('T')[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-bg-base border border-border-hairline rounded p-6 space-y-4">
          <h3 className="font-serif text-base font-semibold text-text-primary">Session Conduct & Facilitation Notes</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Please ensure elders are greeted at the entrance of {session.centreName}. Drinking water and resting chairs
            must be arranged 15 minutes before {session.startTime}. Field volunteers should assist anyone with physical mobility
            limitations.
          </p>
          <div className="p-4 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted space-y-1">
            <div className="font-medium text-text-primary">Attendance Recording Policy (FR-19 & FR-20):</div>
            <div>• Attendance can be marked during the session or up to 24 hours afterwards.</div>
            <div>• Any senior citizen who attends without prior booking should be added as a walk-in.</div>
            <div>• Once submitted and the lock window expires, corrections require Centre Coordinator approval.</div>
          </div>
        </div>
      )}

      {/* Add Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Register Walk-in Participant</h3>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                ✕
              </button>
            </div>

            {walkInSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium">Walk-in registered successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleAddWalkIn} className="space-y-4">
                <p className="text-xs text-text-muted">
                  Select a registered member from {session.centreName} who has arrived at the session without prior booking.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-primary">Select Member</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    required
                    className="w-full text-sm border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">-- Choose registered senior citizen --</option>
                    {centreMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.membershipId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Adding a walk-in increments the confirmed attendee count immediately (FR-20). If capacity is exceeded,
                    an audit event will log the override.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWalkInModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!selectedMemberId}
                  >
                    Confirm Walk-in
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
