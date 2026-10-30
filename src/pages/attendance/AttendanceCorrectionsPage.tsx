import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X, ShieldAlert, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';
import { TaskService } from '@/services/tasks';
import { mockStore } from '@/mock/store';

export const AttendanceCorrectionsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const [corrections, setCorrections] = useState([
    {
      id: 'CORR-2026-001',
      sessionTitle: 'Blood Pressure & Fasting Glucose Screening',
      chapter: 'Pune Ekta Hub',
      seniorName: 'Shantaram Deshpande (SEN-003)',
      currentStatus: 'Absent',
      requestedStatus: 'Present',
      requestedBy: 'Pooja Shinde (Field Volunteer)',
      makerId: 'u-vf-1',
      reason: 'Senior arrived 20 minutes late due to bus disruption, marked absent before coordinator left.',
      status: 'Pending_Approval',
      date: '27 Oct 2026',
    },
    {
      id: 'CORR-2026-002',
      sessionTitle: 'Digital Sahayata — Smartphone Independence',
      chapter: 'Pune Ekta Hub',
      seniorName: 'Sulabha Joshi (SEN-004)',
      currentStatus: 'Present',
      requestedStatus: 'Excused',
      requestedBy: 'Sunita Patil (Chapter Manager)',
      makerId: 'u-cm-pun',
      reason: 'Senior attended only opening 5 minutes due to hospital appointment, should be excused.',
      status: 'Pending_Approval',
      date: '26 Oct 2026',
    },
  ]);

  const canApprove = user?.role === 'CM' || user?.role === 'NM' || user?.role === 'RA' || user?.role === 'SA';

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setCorrections(
      corrections.map((c) =>
        c.id === id ? { ...c, status: action === 'Approve' ? 'Approved' : 'Rejected' } : c
      )
    );

    if (action === 'Approve') {
      TaskService.completeTask('TASK-P4-001');
      mockStore.writeAudit(
        user?.id || 'u-cm-1',
        (user as any)?.name || user?.fullName || 'Sunita Patil',
        user?.role || 'CM',
        'APPROVE',
        'ROSTER',
        id,
        `Attendance correction ${id} approved by ${user?.name || user?.role}. Roster state adjusted.`,
        'Maker-checker policy verified'
      );
      mockStore.persist();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/attendance" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Attendance
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Corrections</span>
      </div>

      <PageHeader
        title="Attendance correction requests"
        subtitle="Maker-checker governance: locked session rosters cannot be edited without independent reviewer approval"
      />

      <div className="p-4 rounded-lg bg-informative-tint border border-border text-sm text-text">
        <strong>Maker-Checker Policy:</strong> The staff member who marked or requested an attendance edit (Maker) cannot approve their own request. Default approval role is <strong>NGO Management (NM)</strong> or <strong>Regional Admin (RA)</strong>.
      </div>

      <Card title="Pending correction requests">
        <div className="divide-y divide-[var(--border-subtle)]">
          {corrections.map((c) => {
            const isOwnRequest = user?.id === c.makerId;
            const isPending = c.status === 'Pending_Approval';

            return (
              <div key={c.id} className="py-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text font-sans">{c.seniorName}</h3>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Session: <strong>{c.sessionTitle}</strong> • Chapter: {c.chapter} • Requested on: {c.date}
                    </div>
                  </div>
                  <StatusChip
                    label={c.status.replace('_', ' ')}
                    status={c.status === 'Approved' ? 'active' : c.status === 'Rejected' ? 'inactive' : 'warning'}
                  />
                </div>

                <div className="text-xs p-3 rounded bg-surface-subtle border border-border space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Change:</span>
                    <span className="font-semibold text-negative">{c.currentStatus}</span>
                    <span>→</span>
                    <span className="font-semibold text-positive">{c.requestedStatus}</span>
                    <span className="text-text-secondary ml-2">• Requested by {c.requestedBy}</span>
                  </div>
                  <p className="text-text-secondary pt-1">
                    <strong>Reason:</strong> {c.reason}
                  </p>
                </div>

                {isPending && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {isOwnRequest ? (
                      <span className="text-xs text-critical flex items-center gap-1 font-semibold">
                        <AlertCircle size={13} /> You are the Maker — awaiting independent review
                      </span>
                    ) : canApprove ? (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(c.id, 'Reject')}
                          icon={<X size={14} />}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAction(c.id, 'Approve')}
                          icon={<Check size={14} />}
                        >
                          Approve correction
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-text-secondary">
                        Requires NM / RA approval
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

