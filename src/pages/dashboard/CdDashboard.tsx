import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockStore } from '@/mock/store';
import { useNavigate } from 'react-router-dom';
import { suppressSmallNumber } from '@/domain/masking';
import {
  FileText,
  ShieldCheck,
  Download,
  Building2,
  Calendar,
  CheckSquare,
} from 'lucide-react';

export const CdDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();

  const totalRegistered = data.seniorCitizens.length;
  const activeMembers = data.seniorCitizens.filter((s) => s.isActive).length;
  const totalAttendanceMarks = data.attendanceRecords.filter((a) => a.status === 'Present').length;
  const uniqueAttendees = new Set(data.attendanceRecords.filter((a) => a.status === 'Present').map((a) => a.memberId)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CSR Grant & Donor Audit Portal"
        description="Verified aggregate eldercare impact metrics, released pilot evaluations, and grant compliance documentation."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'CSR Reviewer' }]}
        primaryAction={
          <Button
            variant="primary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => navigate('/reports/csr')}
          >
            View Released Grant Reports
          </Button>
        }
      />

      {/* Aggregate Only & Small-Number Suppression Banner */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-primary flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-accent font-semibold mb-0.5">Funder Data Privacy Protocol:</strong>
          This portal provides access to verified aggregate metrics only. Individual senior citizen personal information is strictly suppressed. Any group indicator with fewer than 5 members is displayed as <strong className="font-mono text-text-primary">&lt;5</strong> to eliminate re-identification risk.
        </div>
      </div>

      {/* Verified Headline Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Total Registered Elders</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {suppressSmallNumber(totalRegistered)}
          </div>
          <span className="text-[11px] text-success block mt-1">100% of 90-day pilot target</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Active Senior Citizens</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {suppressSmallNumber(activeMembers)}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Attended session in last 30d</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Unique Attendees</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {suppressSmallNumber(uniqueAttendees)}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Distinct beneficiaries</span>
        </div>

        <div className="p-4 bg-bg-base border border-border-hairline rounded">
          <span className="text-xs text-text-muted block mb-1">Total Attendance Marks</span>
          <div className="text-2xl font-bold font-serif text-text-primary tabular-nums">
            {suppressSmallNumber(totalAttendanceMarks)}
          </div>
          <span className="text-[11px] text-text-muted block mt-1">Verified session attendance</span>
        </div>
      </div>

      {/* Released CSR Evaluation Reports */}
      <div className="p-5 bg-bg-base border border-border-hairline rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
          <h3 className="font-serif text-base font-semibold text-text-primary">
            Formally Released Grant Documentation
          </h3>
          <StatusChip label="NGO Management Released" variant="approved" />
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded border border-border-hairline bg-bg-subtle/40 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-text-primary mb-1">
                Vayoshreshtha 90-Day Eldercare Pilot · Mid-Term Impact Review (Day 42)
              </h4>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Aggregated coverage across 6 Ekta Hubs: 1,000 senior records, attendance consistency rate, gender breakdown (~58% female), and digital literacy outcomes.
              </p>
              <div className="flex gap-4 mt-2 text-[10px] text-text-muted font-mono">
                <span>Release Date: 2026-10-27</span>
                <span>Approved by: Dr. Kalyani Sen (Director, NM)</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => navigate('/reports/csr')}
            >
              Inspect Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
