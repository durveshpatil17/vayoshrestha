import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { TaskService } from '@/services/tasks';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';

export const DataGovernancePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [confirmText, setConfirmText] = useState('');
  const [purgeStatus, setPurgeStatus] = useState<'pending' | 'purged'>('pending');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleExecutePurge = () => {
    if (confirmText.trim() !== 'CONFIRM PURGE') return;

    setPurgeStatus('purged');
    TaskService.completeTask('TASK-P11-001');
    mockStore.writeAudit(
      user?.id || 'u-sa-1',
      (user as any)?.name || user?.fullName || 'Vikramaditya Rao',
      user?.role || 'SA',
      'PURGE',
      'SENIOR',
      'SC-KA-BLR-019',
      'DPDP right to erasure executed for member SC-KA-BLR-019 (Rameshwar Kulkarni). Personal data irrevocably purged.',
      'DPDP Section 12 erasure enforcement'
    );
    mockStore.persist();

    setFeedback('Cryptographic PII erasure complete. Audit record permanently sealed.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DPDP Act data governance & privacy controls"
        subtitle="Digital Personal Data Protection Act compliance, purpose limitation, and consent lifecycle"
      />

      {feedback && (
        <div className="p-3 bg-positive-tint text-positive border border-positive/30 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">DPDP Consent Coverage</span>
          <span className="text-2xl font-semibold text-positive tabular-nums">99.1%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Field Masking Enforcement</span>
          <span className="text-2xl font-semibold text-positive tabular-nums">100%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Pending Erasure Requests</span>
          <span className="text-2xl font-semibold text-text tabular-nums">{purgeStatus === 'pending' ? '1' : '0'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Data retention & purge schedules">
          <div className="space-y-3 text-xs text-text">
            <div className="p-3 rounded bg-surface-subtle flex justify-between items-center">
              <span>Emergency SOS Call Recordings</span>
              <strong className="text-text">Purge after 180 days</strong>
            </div>
            <div className="p-3 rounded bg-surface-subtle flex justify-between items-center">
              <span>Biomarker / Vital Measurement Raw Logs</span>
              <strong className="text-text">Retain 3 years (Clinical trend)</strong>
            </div>
            <div className="p-3 rounded bg-surface-subtle flex justify-between items-center">
              <span>Session Attendance Records</span>
              <strong className="text-text">Retain 5 years (CSR Audit)</strong>
            </div>
            <div className="p-3 rounded bg-surface-subtle flex justify-between items-center">
              <span>Cryptographic Audit Log Hash Chain</span>
              <strong className="text-text">Immutable (Permanent)</strong>
            </div>
          </div>
        </Card>

        <Card title="Right to erasure / data withdrawal queue">
          <div className="space-y-3 text-xs text-text-secondary">
            <p>
              In accordance with DPDP regulations, elders or authorized legal guardians can request complete withdrawal of their health logs and profile.
            </p>
            {purgeStatus === 'pending' ? (
              <div className="p-4 rounded bg-surface-subtle border border-border space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-text block">Rameshwar Kulkarni</span>
                    <span className="text-text-secondary tabular-nums">ID: SC-KA-BLR-019 • Hub: Bengaluru</span>
                  </div>
                  <StatusChip label="Identity verified by NM" status="active" />
                </div>
                <div className="p-2.5 bg-critical-tint text-critical rounded border border-critical/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 stroke-[1.5]" />
                  <span>
                    Warning: This action permanently deletes all personal identifiers, health records, and WhatsApp conversation logs. Irrevocable.
                  </span>
                </div>
                <div>
                  <label className="block text-text font-semibold mb-1">
                    Type <strong>CONFIRM PURGE</strong> to authorize erasure:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="CONFIRM PURGE"
                    className="w-full px-3 py-2 text-xs rounded border border-border focus:outline-none focus:border-accent bg-surface text-text"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={confirmText.trim() !== 'CONFIRM PURGE'}
                    onClick={handleExecutePurge}
                  >
                    Execute irrevocable purge
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded bg-surface-subtle border border-border text-center text-xs text-text-secondary">
                No pending data deletion requests in queue.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

