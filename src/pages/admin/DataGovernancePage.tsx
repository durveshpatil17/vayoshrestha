import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, Database } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DataGovernancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="DPDP Act data governance & privacy controls"
        subtitle="Digital Personal Data Protection Act compliance, purpose limitation, and consent lifecycle"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">DPDP Consent Coverage</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">99.1%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Field Masking Enforcement</span>
          <span className="text-2xl font-semibold text-[var(--positive)] tabular-nums">100%</span>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-[var(--border)]">
          <span className="text-xs text-[var(--text-secondary)] block">Pending Erasure Requests</span>
          <span className="text-2xl font-semibold text-[var(--text)] tabular-nums">0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Data retention & purge schedules">
          <div className="space-y-3 text-xs text-[var(--text)]">
            <div className="p-3 rounded bg-[var(--surface-subtle)] flex justify-between items-center">
              <span>Emergency SOS Call Recordings</span>
              <strong className="text-[var(--text)]">Purge after 180 days</strong>
            </div>
            <div className="p-3 rounded bg-[var(--surface-subtle)] flex justify-between items-center">
              <span>Biomarker / Vital Measurement Raw Logs</span>
              <strong className="text-[var(--text)]">Retain 3 years (Clinical trend)</strong>
            </div>
            <div className="p-3 rounded bg-[var(--surface-subtle)] flex justify-between items-center">
              <span>Session Attendance Records</span>
              <strong className="text-[var(--text)]">Retain 5 years (CSR Audit)</strong>
            </div>
            <div className="p-3 rounded bg-[var(--surface-subtle)] flex justify-between items-center">
              <span>Cryptographic Audit Log Hash Chain</span>
              <strong className="text-[var(--text)]">Immutable (Permanent)</strong>
            </div>
          </div>
        </Card>

        <Card title="Right to erasure / data withdrawal queue">
          <div className="space-y-3 text-xs text-[var(--text-secondary)]">
            <p>
              In accordance with DPDP regulations, elders or authorized legal guardians can request complete withdrawal of their health logs and profile.
            </p>
            <div className="p-4 rounded bg-[var(--surface-subtle)] border border-[var(--border)] text-center text-xs">
              No pending data deletion requests in queue.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
