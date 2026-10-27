import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { ExportDialog } from '@/components/data/ExportDialog';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Download, FileSpreadsheet, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

export const DataExportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [selectedDataset, setSelectedDataset] = useState<'members' | 'attendance' | 'referrals' | 'sessions'>('members');
  const [showExportModal, setShowExportModal] = useState(false);

  // Export history audit logs
  const exportAuditLogs = data.auditEvents.filter((a) => a.action === 'EXPORT');

  const getExportDataAndCols = () => {
    switch (selectedDataset) {
      case 'members':
        return {
          title: 'Senior Citizens Register',
          fileName: 'vayoshrestha_members_export',
          data: data.seniorCitizens,
          columns: [
            { key: 'membershipId', label: 'Membership ID' },
            { key: 'fullName', label: 'Full Name' },
            { key: 'gender', label: 'Gender' },
            { key: 'centreId', label: 'Centre' },
            { key: 'preferredLanguage', label: 'Language' },
            { key: 'status', label: 'Status' },
          ],
        };
      case 'attendance':
        return {
          title: 'Attendance Ledger',
          fileName: 'vayoshrestha_attendance_export',
          data: data.attendanceRecords,
          columns: [
            { key: 'sessionDate', label: 'Date' },
            { key: 'membershipId', label: 'Membership ID' },
            { key: 'memberName', label: 'Name' },
            { key: 'status', label: 'Attendance' },
            { key: 'recordedBy', label: 'Recorded By' },
          ],
        };
      case 'referrals':
        return {
          title: 'Referrals Pipeline',
          fileName: 'vayoshrestha_referrals_export',
          data: data.referrals,
          columns: [
            { key: 'id', label: 'Referral ID' },
            { key: 'memberName', label: 'Senior Name' },
            { key: 'memberAgeBand', label: 'Age Band' },
            { key: 'partnerName', label: 'Partner' },
            { key: 'serviceName', label: 'Service' },
            { key: 'urgency', label: 'Urgency' },
            { key: 'status', label: 'Status' },
          ],
        };
      default:
        return {
          title: 'Sessions Schedule',
          fileName: 'vayoshrestha_sessions_export',
          data: data.sessions,
          columns: [
            { key: 'id', label: 'Session ID' },
            { key: 'programmeTitle', label: 'Programme' },
            { key: 'centreName', label: 'Centre' },
            { key: 'date', label: 'Date' },
            { key: 'confirmedCount', label: 'Confirmed' },
          ],
        };
    }
  };

  const activeExportConfig = getExportDataAndCols();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Authorised Data Exports & Extraction"
        description="Governed CSV/PDF downloads with mandatory typed reason, PII watermarking, and audit logging (FR-49)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Data Exports' },
        ]}
      />

      {/* Security Governance Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Data Export Security Policy (FR-49):</strong> Every data extraction requires an explicit
          business justification. CSV exports include an immutable digital audit watermark with your user name, timestamp, and role.
          Formula injection risks (cells starting with <code className="font-mono text-text-primary">=, +, -, @</code>) are automatically neutralized.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Dataset Selection Box Left */}
        <div className="md:col-span-5 bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Select Dataset for Export</h4>

          <div className="space-y-2 text-xs">
            {[
              { id: 'members', label: 'Senior Citizens Register (FR-05)', count: data.seniorCitizens.length },
              { id: 'attendance', label: 'Attendance Ledger Marks (FR-22)', count: data.attendanceRecords.length },
              { id: 'referrals', label: 'Community Referrals (FR-32)', count: data.referrals.length },
              { id: 'sessions', label: 'Programme Sessions & Turnout', count: data.sessions.length },
            ].map((ds) => (
              <label
                key={ds.id}
                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${
                  selectedDataset === ds.id
                    ? 'border-accent bg-accent/5 text-text-primary font-semibold'
                    : 'border-border-hairline hover:bg-bg-subtle text-text-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dataset"
                    checked={selectedDataset === ds.id}
                    onChange={() => setSelectedDataset(ds.id as any)}
                    className="text-accent focus:ring-accent"
                  />
                  <span>{ds.label}</span>
                </div>
                <span className="font-mono text-[11px]">{ds.count} rows</span>
              </label>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="w-full mt-2"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Proceed to Export Dialog
          </Button>
        </div>

        {/* Export Audit Log Right Rail */}
        <div className="md:col-span-7 bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
          <h4 className="font-serif text-sm font-semibold text-text-primary">Historical Export Audit Trail (FR-49)</h4>

          <div className="divide-y divide-border-hairline text-xs">
            {exportAuditLogs.length === 0 ? (
              <p className="text-text-muted py-6 text-center">No recent export events logged.</p>
            ) : (
              exportAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">{log.entity} Export</div>
                    <div className="text-text-muted text-[11px]">
                      By {log.actorName} ({log.actorRole}) • Reason: "{log.reason || 'General reporting'}"
                    </div>
                  </div>
                  <div className="text-text-muted font-mono text-[10px]">
                    {log.timestamp.replace('T', ' ').slice(0, 16)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ExportDialog
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={activeExportConfig.title}
        data={activeExportConfig.data}
        columns={activeExportConfig.columns}
        defaultFileName={activeExportConfig.fileName}
      />
    </div>
  );
};
