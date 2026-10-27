import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { isAttendanceLocked, calculateLockCountdown } from '@/domain/attendance';
import {
  Calendar,
  Building2,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { AttendanceRecord, SessionRegistration } from '@/api/contracts';

interface AttendeeRow {
  memberId: string;
  membershipId: string;
  name: string;
  status: 'Present' | 'Absent';
  isWalkIn: boolean;
}

export const AttendanceSessionRosterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const session = data.sessions.find((s) => s.id === id);
  const existingRecords = data.attendanceRecords.filter((r) => r.sessionId === id);
  const registrations = data.sessionRegistrations.filter((r) => r.sessionId === id);

  const [attendees, setAttendees] = useState<AttendeeRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedWalkInMemberId, setSelectedWalkInMemberId] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<AttendeeRow | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize roster from registrations and existing attendance records
  useEffect(() => {
    if (!session) return;

    if (existingRecords.length > 0) {
      const rows: AttendeeRow[] = existingRecords.map((rec) => {
        const reg = registrations.find((r) => r.memberId === rec.memberId);
        return {
          memberId: rec.memberId,
          membershipId: rec.membershipId,
          name: rec.memberName,
          status: rec.status,
          isWalkIn: reg ? reg.isWalkIn : false,
        };
      });
      setAttendees(rows);
    } else {
      const rows: AttendeeRow[] = registrations.map((reg) => {
        const member = data.seniorCitizens.find((m) => m.id === reg.memberId);
        return {
          memberId: reg.memberId,
          membershipId: member?.membershipId || `VV-MEM-${reg.memberId.slice(0, 4)}`,
          name: reg.memberName,
          status: 'Absent', // default before marking
          isWalkIn: reg.isWalkIn,
        };
      });
      setAttendees(rows);
    }
  }, [id, session]);

  if (!session) {
    return (
      <div className="p-8 text-center bg-bg-base border border-border-hairline rounded">
        <h3 className="font-serif text-lg font-semibold text-text-primary">Session not found</h3>
        <Link to="/attendance" className="mt-4 inline-block text-accent font-medium">← Back to Sessions</Link>
      </div>
    );
  }

  const isLocked = session.attendanceRecorded && isAttendanceLocked(session.date, 24);
  const countdown = calculateLockCountdown(session.date, 24);

  const toggleStatus = (memberId: string) => {
    if (isLocked) return;
    setAttendees((prev) =>
      prev.map((a) =>
        a.memberId === memberId
          ? { ...a, status: a.status === 'Present' ? 'Absent' : 'Present' }
          : a
      )
    );
    setHasUnsavedChanges(true);
  };

  const markAllPresent = () => {
    if (isLocked) return;
    setAttendees((prev) => prev.map((a) => ({ ...a, status: 'Present' })));
    setHasUnsavedChanges(true);
  };

  const handleSaveAttendance = () => {
    if (isLocked) return;

    mockStore.updateData((draft) => {
      // Remove any existing records for this session
      draft.attendanceRecords = draft.attendanceRecords.filter((r) => r.sessionId !== session.id);

      // Append new attendance records
      const newRecords: AttendanceRecord[] = attendees.map((att) => ({
        id: `att-${session.id}-${att.memberId}`,
        sessionId: session.id,
        centreId: session.centreId,
        memberId: att.memberId,
        memberName: att.name,
        membershipId: att.membershipId,
        sessionDate: session.date,
        status: att.status,
        recordedBy: user?.fullName || 'Field Volunteer',
        recordedAt: new Date().toISOString(),
        corrected: false,
      }));

      draft.attendanceRecords.push(...newRecords);

      // Update session status
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (targetSession) {
        targetSession.attendanceRecorded = true;
        targetSession.attendanceRecordedAt = new Date().toISOString();
        targetSession.attendanceRecordedBy = user?.fullName || 'Field Staff';
      }

      // Update Senior Citizen isActive flag if marked Present
      attendees.forEach((att) => {
        if (att.status === 'Present') {
          const elder = draft.seniorCitizens.find((m) => m.id === att.memberId);
          if (elder) {
            elder.isActive = true;
          }
        }
      });
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'VF',
      'CREATE',
      'AttendanceRecord',
      session.id,
      `Marked attendance for ${attendees.length} participants (${attendees.filter((a) => a.status === 'Present').length} Present)`,
      null,
      { count: attendees.length },
      session.centreId
    );

    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Walk-in handling
  const availableWalkInMembers = data.seniorCitizens.filter(
    (m) => m.centreId === session.centreId && !attendees.some((a) => a.memberId === m.id)
  );

  const handleAddWalkIn = () => {
    if (!selectedWalkInMemberId) return;
    const member = data.seniorCitizens.find((m) => m.id === selectedWalkInMemberId);
    if (!member) return;

    const newAttendee: AttendeeRow = {
      memberId: member.id,
      membershipId: member.membershipId,
      name: member.fullName,
      status: 'Present',
      isWalkIn: true,
    };

    setAttendees((prev) => [newAttendee, ...prev]);
    setHasUnsavedChanges(true);

    mockStore.updateData((draft) => {
      const reg: SessionRegistration = {
        id: `reg-walkin-${Date.now()}`,
        sessionId: session.id,
        memberId: member.id,
        memberName: member.fullName,
        status: 'Attended',
        isWalkIn: true,
        registeredAt: new Date().toISOString(),
      };
      draft.sessionRegistrations.push(reg);
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (targetSession) {
        targetSession.walkInCount += 1;
        targetSession.confirmedCount += 1;
      }
    });

    setShowWalkInModal(false);
    setSelectedWalkInMemberId('');
  };

  // Correction request submission (FR-21)
  const handleRequestCorrection = () => {
    if (!correctionTarget || !correctionReason) return;

    mockStore.updateData((draft) => {
      draft.attendanceCorrections.push({
        id: `corr-${Date.now()}`,
        attendanceRecordId: `att-${session.id}-${correctionTarget.memberId}`,
        sessionId: session.id,
        centreId: session.centreId,
        memberId: correctionTarget.memberId,
        memberName: correctionTarget.name,
        previousStatus: correctionTarget.status,
        requestedStatus: correctionTarget.status === 'Present' ? 'Absent' : 'Present',
        reason: correctionReason,
        requesterId: user?.id || 'vf-1',
        requesterName: user?.fullName || 'Field Volunteer',
        requestedAt: new Date().toISOString(),
        status: 'Pending',
      });
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Staff',
      user?.role || 'VF',
      'CREATE',
      'AttendanceCorrection',
      session.id,
      `Correction requested for ${correctionTarget.name}: ${correctionReason}`,
      null,
      { target: correctionTarget.name },
      session.centreId
    );

    setShowCorrectionModal(false);
    setCorrectionTarget(null);
    setCorrectionReason('');
    alert('Attendance correction request submitted to Centre Coordinator.');
  };

  const filteredAttendees = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.membershipId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = attendees.filter((a) => a.status === 'Present').length;
  const absentCount = attendees.filter((a) => a.status === 'Absent').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Attendance: ${session.programmeTitle}`}
        description={`Session on ${session.date} (${session.startTime} - ${session.endTime}) at ${session.centreName}`}
        breadcrumb={[
          { label: 'Attendance', href: '/attendance' },
          { label: session.programmeTitle, href: `/sessions/${session.id}` },
          { label: 'Roster' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/attendance">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Sessions
              </Button>
            </Link>
            {!isLocked && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAttendance}
                disabled={attendees.length === 0}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save & Submit Attendance
              </Button>
            )}
          </div>
        }
      />

      {/* Lock Status / Unsaved Changes Banner */}
      {isLocked ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Attendance is locked (FR-21).</strong> The 24-hour recording window has elapsed.
              Any modifications require a formal correction request approved by the Centre Coordinator.
            </span>
          </div>
          <Link to="/attendance/corrections">
            <Button variant="outline" size="sm" className="text-xs bg-white">
              View Corrections Queue
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-bg-base border border-border-hairline p-3 rounded text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span>Lock Window Active: <strong>{countdown}</strong> remaining to record or edit.</span>
          </div>
          {hasUnsavedChanges && (
            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              Unsaved changes present
            </span>
          )}
          {saveSuccess && (
            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved successfully!
            </span>
          )}
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Registered</div>
          <div className="text-xl font-serif font-bold text-text-primary mt-1">{attendees.length}</div>
          <div className="text-xs text-text-muted mt-0.5">Capacity: {session.capacity}</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-emerald-800 font-medium">Present Today</div>
          <div className="text-xl font-serif font-bold text-emerald-700 mt-1">{presentCount}</div>
          <div className="text-xs text-text-muted mt-0.5">
            {attendees.length > 0 ? `${Math.round((presentCount / attendees.length) * 100)}% turnout` : '0%'}
          </div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Absent / Not Arrived</div>
          <div className="text-xl font-serif font-bold text-text-primary mt-1">{absentCount}</div>
          <div className="text-xs text-text-muted mt-0.5">Missing participants</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-amber-800 font-medium">Walk-in Seniors (FR-20)</div>
          <div className="text-xl font-serif font-bold text-amber-700 mt-1">
            {attendees.filter((a) => a.isWalkIn).length}
          </div>
          <div className="text-xs text-text-muted mt-0.5">Unscheduled participants</div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="bg-bg-base border border-border-hairline rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or membership ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {!isLocked && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllPresent}
                className="text-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWalkInModal(true)}
                className="text-xs"
              >
                <Plus className="w-4 h-4 mr-1 text-accent" />
                Add Walk-in Senior
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Participant Roster Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Membership ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Registration</th>
              <th className="py-3 px-4 text-center">Attendance Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">
                  No participants matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredAttendees.map((att, idx) => (
                <tr
                  key={att.memberId}
                  className={`transition-colors ${
                    att.status === 'Present' ? 'bg-emerald-50/20' : 'hover:bg-bg-subtle/40'
                  }`}
                >
                  <td className="py-3 px-4 text-text-muted text-xs">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono text-xs text-text-muted">{att.membershipId}</td>
                  <td className="py-3 px-4 font-medium">
                    <Link
                      to={`/members/${att.memberId}`}
                      className="text-text-primary hover:text-accent underline decoration-dotted"
                    >
                      {att.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    {att.isWalkIn ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Walk-in
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">Pre-booked</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => toggleStatus(att.memberId)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        att.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                      } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      {att.status === 'Present' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Present</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Absent</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isLocked ? (
                      <button
                        onClick={() => {
                          setCorrectionTarget(att);
                          setShowCorrectionModal(true);
                        }}
                        className="text-xs text-accent hover:underline font-medium"
                      >
                        Request Correction
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(att.memberId)}
                        className="text-xs text-text-muted hover:text-text-primary"
                      >
                        Toggle
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Add Walk-in Senior (FR-20)</h3>
              <button onClick={() => setShowWalkInModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <p className="text-xs text-text-muted">
              Select a registered senior citizen who has arrived at {session.centreName} without a prior session booking.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-primary">Senior Citizen</label>
              <select
                value={selectedWalkInMemberId}
                onChange={(e) => setSelectedWalkInMemberId(e.target.value)}
                className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              >
                <option value="">-- Choose member --</option>
                {availableWalkInMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.membershipId})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" size="sm" onClick={() => setShowWalkInModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleAddWalkIn} disabled={!selectedWalkInMemberId}>
                Add to Roster
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Correction Modal (FR-21) */}
      {showCorrectionModal && correctionTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">Request Attendance Correction (FR-21)</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-bg-subtle p-3 rounded border border-border-hairline space-y-1">
                <div><strong>Senior:</strong> {correctionTarget.name} ({correctionTarget.membershipId})</div>
                <div><strong>Current Marked Status:</strong> {correctionTarget.status}</div>
                <div><strong>Requested Status:</strong> {correctionTarget.status === 'Present' ? 'Absent' : 'Present'}</div>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-text-primary">Mandatory Correction Reason</label>
                <textarea
                  rows={3}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Elder arrived 15 minutes late; was mistakenly recorded absent."
                  required
                  className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
                />
              </div>
              <p className="text-text-muted">
                Corrections are governed by maker-checker policy (FR-21). A Centre Coordinator or Programme Manager must approve this change.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" size="sm" onClick={() => setShowCorrectionModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRequestCorrection}
                disabled={!correctionReason.trim()}
              >
                Submit Correction Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
