import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Filter } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FilterBar } from '@/components/data/FilterBar';

export const AttendanceHistoryPage: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState('HUB-PUN');

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/attendance" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Attendance
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">History heatmap</span>
      </div>

      <PageHeader
        title="Attendance history & engagement heatmap"
        subtitle="Longitudinal participation records, session consistency, and exportable logs"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Export CSV
          </Button>
        }
      />

      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
        searchPlaceholder="Filter members..."
        filters={[
          {
            key: 'hub',
            label: 'Ekta Hub',
            value: selectedHub,
            onChange: setSelectedHub,
            options: [
              { label: 'Pune Hub (HUB-PUN)', value: 'HUB-PUN' },
              { label: 'Nashik Hub (HUB-NSK)', value: 'HUB-NSK' },
              { label: 'Bengaluru Hub (HUB-BLR)', value: 'HUB-BLR' },
            ],
          },
        ]}
      />

      <Card title="October 2026 Participation Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)]">
                <th className="py-2.5 px-3 font-semibold min-w-[160px]">Senior Member</th>
                <th className="py-2.5 px-2 font-semibold">Rate</th>
                {days.map((d) => (
                  <th key={d} className="py-2.5 px-1 font-semibold text-center w-6 tabular-nums">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                { name: 'Kamala Devi (SEN-001)', rate: '92%', pattern: [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0] },
                { name: 'Ramesh Kulkarni (SEN-002)', rate: '85%', pattern: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1] },
                { name: 'Shantaram Deshpande (SEN-003)', rate: '64%', pattern: [0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0] },
                { name: 'Sulabha Joshi (SEN-004)', rate: '100%', pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                { name: 'Dattatray Pawar (SEN-005)', rate: '78%', pattern: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1] },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-hover)]">
                  <td className="py-2.5 px-3 font-semibold text-[var(--text)] whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-[var(--positive)] tabular-nums">
                    {row.rate}
                  </td>
                  {row.pattern.map((val, dIdx) => (
                    <td key={dIdx} className="py-2.5 px-1 text-center">
                      <span
                        className={`inline-block w-4 h-4 rounded-sm ${
                          val === 1
                            ? 'bg-[var(--positive)]'
                            : 'bg-[var(--border-subtle)]'
                        }`}
                        title={`Day ${dIdx + 1}: ${val === 1 ? 'Attended' : 'No attendance'}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-[var(--positive)]" /> Attended session
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-[var(--border-subtle)]" /> No session / Absent
          </span>
        </div>
      </Card>
    </div>
  );
};

