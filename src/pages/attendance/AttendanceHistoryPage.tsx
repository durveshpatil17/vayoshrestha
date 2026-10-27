import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { ExportDialog } from '@/components/data/ExportDialog';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Can } from '@/permissions/Can';
import { Download, Calendar, Search, Building2, CheckCircle2 } from 'lucide-react';

export const AttendanceHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [centreFilter, setCentreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Present' | 'Absent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExport, setShowExport] = useState(false);

  const accessibleCentres = useMemo(() => {
    if (user?.role === 'CC' || user?.role === 'VF') {
      return data.centres.filter((c) => user.assignedCentres?.includes(c.id));
    }
    return data.centres;
  }, [data.centres, user]);

  const records = useMemo(() => {
    return data.attendanceRecords.filter((r) => {
      // Centre scoping
      if (user?.role === 'CC' || user?.role === 'VF') {
        if (user.assignedCentres && user.assignedCentres.length > 0 && !user.assignedCentres.includes(r.centreId)) {
          return false;
        }
      }
      if (centreFilter !== 'all' && r.centreId !== centreFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.memberName.toLowerCase().includes(q) ||
          r.membershipId.toLowerCase().includes(q) ||
          r.sessionDate.includes(q)
        );
      }
      return true;
    });
  }, [data.attendanceRecords, user, centreFilter, statusFilter, searchQuery]);

  const exportColumns = [
    { key: 'sessionDate', label: 'Date' },
    { key: 'membershipId', label: 'Membership ID' },
    { key: 'memberName', label: 'Senior Citizen' },
    { key: 'centreId', label: 'Centre ID' },
    { key: 'status', label: 'Attendance' },
    { key: 'recordedBy', label: 'Recorded By' },
    { key: 'corrected', label: 'Corrected Flag' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Attendance Ledger & History"
        description="Comprehensive longitudinal record of senior participation across all centres (FR-22)"
        breadcrumb={[
          { label: 'Attendance', href: '/attendance' },
          { label: 'History' },
        ]}
        actions={
          <Can capability="dataExports" action="read">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(true)}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export Records
            </Button>
          </Can>
        }
      />

      {/* Filter Bar */}
      <div className="bg-bg-base border border-border-hairline p-4 rounded flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search senior or membership ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border-hairline rounded bg-bg-base text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            />
          </div>

          <select
            value={centreFilter}
            onChange={(e) => setCentreFilter(e.target.value)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Accessible Centres</option>
            {accessibleCentres.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-border-hairline rounded px-2.5 py-1.5 bg-bg-base text-text-primary text-xs focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing <strong>{records.length}</strong> recorded marks
        </div>
      </div>

      {/* History Ledger Table */}
      <div className="bg-bg-base border border-border-hairline rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-subtle border-b border-border-hairline text-text-muted font-medium text-xs">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Membership ID</th>
              <th className="py-3 px-4">Senior Citizen</th>
              <th className="py-3 px-4">Centre</th>
              <th className="py-3 px-4">Recorded By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline text-text-primary">
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  No attendance records found matching filters.
                </td>
              </tr>
            ) : (
              records.slice(0, 50).map((r) => {
                const centre = data.centres.find((c) => c.id === r.centreId);
                return (
                  <tr key={r.id} className="hover:bg-bg-subtle/40">
                    <td className="py-3 px-4 text-xs font-mono">{r.sessionDate}</td>
                    <td className="py-3 px-4 font-mono text-xs text-text-muted">{r.membershipId}</td>
                    <td className="py-3 px-4 font-medium">
                      <Link to={`/members/${r.memberId}`} className="text-text-primary hover:text-accent underline decoration-dotted">
                        {r.memberName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs text-text-muted">{centre?.name || r.centreId}</td>
                    <td className="py-3 px-4 text-xs text-text-muted">{r.recordedBy}</td>
                    <td className="py-3 px-4">
                      <StatusChip
                        label={r.status}
                        variant={r.status === 'Present' ? 'active' : 'neutral'}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {r.corrected ? (
                        <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          Audited Correction
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {records.length > 50 && (
          <div className="p-3 bg-bg-subtle text-center text-xs text-text-muted border-t border-border-hairline">
            Displaying first 50 of {records.length} records. Use Export Records to download complete ledger.
          </div>
        )}
      </div>

      <ExportDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Export Attendance History"
        data={records}
        columns={exportColumns}
        defaultFileName="vayoshrestha_attendance_ledger"
      />
    </div>
  );
};
