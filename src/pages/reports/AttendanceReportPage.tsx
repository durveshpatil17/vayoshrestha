import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockStore } from '@/mock/store';
import { Calendar, Users, CheckCircle2, TrendingUp } from 'lucide-react';

export const AttendanceReportPage: React.FC = () => {
  const data = mockStore.getData();

  const totalAttendance = data.attendanceRecords.filter((r) => r.status === 'Present').length;
  const uniqueAttendees = new Set(data.attendanceRecords.filter((r) => r.status === 'Present').map((r) => r.memberId)).size;
  const repeatTurnoutRatio = uniqueAttendees > 0 ? (totalAttendance / uniqueAttendees).toFixed(1) : '1.0';

  const weekdayData = [
    { day: 'Monday', attendance: 340, note: 'Gentle Yoga & Vitals Check' },
    { day: 'Tuesday', attendance: 420, note: 'Physiotherapy & Mobility Camp' },
    { day: 'Wednesday', attendance: 390, note: 'Devotional Bhajan & Social Circle' },
    { day: 'Thursday', attendance: 450, note: 'Digital Literacy & Banking Circle' },
    { day: 'Friday', attendance: 480, note: 'Nutrition & Doctor Consultation' },
    { day: 'Saturday', attendance: 520, note: 'Intergenerational Cultural Meet' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Attendance & Turnout Patterns"
        description="Fidelity comparison of cumulative attendance marks versus unique elder individuals (FR-46)"
        breadcrumb={[
          { label: 'Reports', href: '/reports' },
          { label: 'Attendance Patterns' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Total Attendance Marks</div>
          <div className="text-2xl font-serif font-bold text-text-primary mt-1">{totalAttendance}</div>
          <div className="text-xs text-text-muted mt-0.5">Physical presences recorded</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Unique Individual Seniors</div>
          <div className="text-2xl font-serif font-bold text-accent mt-1">{uniqueAttendees}</div>
          <div className="text-xs text-text-muted mt-0.5">Distinct senior citizens</div>
        </div>

        <div className="bg-bg-base border border-border-hairline rounded p-4">
          <div className="text-xs text-text-muted">Average Sessions Per Senior</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{repeatTurnoutRatio}x</div>
          <div className="text-xs text-text-muted mt-0.5">High repeat engagement factor</div>
        </div>
      </div>

      {/* Weekday Distribution Table */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm">
        <h4 className="font-serif text-sm font-semibold text-text-primary">Weekday Turnout Trends</h4>

        <div className="space-y-3">
          {weekdayData.map((w) => (
            <div key={w.day} className="space-y-1 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-text-primary">{w.day} ({w.note})</span>
                <span className="font-mono text-text-primary font-semibold">{w.attendance} Attendees</span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${(w.attendance / 600) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
