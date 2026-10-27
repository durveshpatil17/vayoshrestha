import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ArrowLeft, Building2 } from 'lucide-react';
import { AttendanceCorrection } from '@/api/contracts';

export const AttendanceCorrectionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [corrections, setCorrections] = useState<AttendanceCorrection[]>(data.attendanceCorrections);
  const [selectedCorrection, setSelectedCorrection] = useState<AttendanceCorrection | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  // Filter corrections by status and centre scope
  const filteredCorrections = corrections.filter((c) => {
    if (user?.role === 'CC') {
      if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(c.centreId)) {
        return false;
      }
    }
    if (statusFilter !== 'All' && c.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleReviewAction = () => {
    if (!selectedCorrection || !actionType) return;

    // Maker != checker validation rule (FR-21)
    if (selectedCorrection.requesterId === user?.id) {
      alert('Maker-Checker Violation: You cannot review or approve your own attendance correction request.');
      return;
    }

    const newStatus = actionType === 'Approve' ? 'Approved' : 'Rejected';

    mockStore.updateData((draft) => {
      const target = draft.attendanceCorrections.find((c) => c.id === selectedCorrection.id);
      if (target) {
        target.status = newStatus;
        target.reviewedBy = user?.fullName || 'Centre Coordinator';
        target.reviewedAt = new Date().toISOString();
      }

      // If approved, update the actual attendance record
      if (newStatus === 'Approved') {
        const att = draft.attendanceRecords.find(
          (r) => r.sessionId === selectedCorrection.sessionId && r.memberId === selectedCorrection.memberId
        );
        if (att) {
          att.status = selectedCorrection.requestedStatus;
          att.corrected = true;
        }
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Coordinator',
      user?.role || 'CC',
      'UPDATE',
      'AttendanceCorrection',
      selectedCorrection.id,
      `${actionType}d attendance correction for ${selectedCorrection.memberName}. Reason: ${reviewComment || 'Policy compliance'}`,
      { status: selectedCorrection.status },
      { status: newStatus, reviewComment },
      selectedCorrection.centreId
    );

    setCorrections([...mockStore.getData().attendanceCorrections]);
    setSelectedCorrection(null);
    setActionType(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Attendance Corrections Queue"
        description="Review and resolve formal attendance correction requests under strict maker-checker governance (FR-21)"
        breadcrumb={[
          { label: 'Attendance', href: '/attendance' },
          { label: 'Corrections' },
        ]}
        actions={
          <Link to="/attendance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Attendance
            </Button>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-bg-base border border-border-hairline p-4 rounded">
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                statusFilter === st
                  ? 'bg-accent text-white'
                  : 'bg-bg-subtle text-text-muted hover:text-text-primary'
              }`}
            >
              {st} ({corrections.filter((c) => st === 'All' || c.status === st).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{filteredCorrections.length}</strong> request{filteredCorrections.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Corrections List Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Current → Requested</th>
              <th className="py-3 px-4">Justification Reason</th>
              <th className="py-3 px-4">Requested By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary">
            {filteredCorrections.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-muted">
                  No attendance correction requests in this state.
                </td>
              </tr>
            ) : (
              filteredCorrections.map((corr) => {
                const isOwnRequest = corr.requesterId === user?.id;

                return (
                  <tr key={corr.id} className="hover:bg-bg-subtle/40">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-text-primary">{corr.memberName}</div>
                      <div className="text-xs text-text-muted font-mono">{corr.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-semibold text-zinc-600">{corr.previousStatus}</span>
                      <span className="mx-2 text-text-muted">→</span>
                      <span className="font-semibold text-emerald-700">{corr.requestedStatus}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs max-w-xs text-text-muted">
                      {corr.reason}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div>{corr.requesterName}</div>
                      <div className="text-text-muted">{corr.requestedAt.split('T')[0]}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip
                        label={corr.status}
                        variant={corr.status === 'Approved' ? 'active' : corr.status === 'Pending' ? 'warning' : 'danger'}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {corr.status === 'Pending' && (
                        <Can capability="attendanceCorrections" action="approve">
                          <div className="flex items-center justify-end gap-2">
                            {isOwnRequest ? (
                              <span className="text-xs text-text-muted italic" title="Maker cannot approve own change">
                                Own request (Maker)
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedCorrection(corr);
                                    setActionType('Approve');
                                  }}
                                  className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded hover:bg-emerald-100 font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCorrection(corr);
                                    setActionType('Reject');
                                  }}
                                  className="text-xs px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded hover:bg-rose-100 font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </Can>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Maker-Checker Review Modal */}
      {selectedCorrection && actionType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base rounded-md border border-border-hairline max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-lg font-semibold text-text-primary">
                {actionType} Attendance Correction
              </h3>
              <button
                onClick={() => {
                  setSelectedCorrection(null);
                  setActionType(null);
                }}
                className="text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline space-y-1">
                <div><strong>Senior:</strong> {selectedCorrection.memberName}</div>
                <div><strong>Adjustment:</strong> {selectedCorrection.previousStatus} → {selectedCorrection.requestedStatus}</div>
                <div><strong>Field Justification:</strong> {selectedCorrection.reason}</div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-text-primary">Review Comment / Audit Note</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={`Reason for ${actionType.toLowerCase()}ing this attendance correction...`}
                  className="w-full p-2 border border-border-hairline rounded bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
                />
              </div>

              <p className="text-text-muted">
                Action will be permanently recorded in the tamper-evident audit log with your digital signature ({user?.fullName}).
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCorrection(null);
                  setActionType(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'Approve' ? 'primary' : 'danger'}
                size="sm"
                onClick={handleReviewAction}
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
