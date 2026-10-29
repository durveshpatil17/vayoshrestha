import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Building2, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ChapterReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/reports" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Reports
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Chapters</span>
      </div>

      <PageHeader
        title="Chapter operational performance"
        subtitle="Throughput, registration targets, volunteer ratio compliance, and emergency drill performance"
        actions={
          <Button variant="outline" icon={<Download size={14} />}>
            Download report
          </Button>
        }
      />

      <Card title="Ekta Hub Comparative Overview">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="py-2.5 px-3 font-semibold">Chapter</th>
                <th className="py-2.5 px-2 font-semibold">Region</th>
                <th className="py-2.5 px-2 font-semibold">Enrolled</th>
                <th className="py-2.5 px-2 font-semibold">Volunteers</th>
                <th className="py-2.5 px-2 font-semibold">Ratio</th>
                <th className="py-2.5 px-2 font-semibold">SOS Avg Response</th>
                <th className="py-2.5 px-3 font-semibold">Attendance SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                { name: 'Pune Ekta Hub (HUB-PUN)', reg: 'West', enrolled: 142, vol: 12, ratio: '1:12', sos: '84s', att: '98.4%' },
                { name: 'Nashik Ekta Hub (HUB-NSK)', reg: 'West', enrolled: 98, vol: 8, ratio: '1:12', sos: '102s', att: '96.2%' },
                { name: 'Bengaluru Ekta Hub (HUB-BLR)', reg: 'South', enrolled: 180, vol: 14, ratio: '1:13', sos: '76s', att: '99.1%' },
                { name: 'Nagpur Ekta Hub (HUB-NAG)', reg: 'West', enrolled: 85, vol: 6, ratio: '1:14', sos: '115s', att: '95.0%' },
              ].map((c, idx) => (
                <tr key={idx} className="hover:bg-surface-hover">
                  <td className="py-3 px-3 font-semibold text-text">{c.name}</td>
                  <td className="py-3 px-2 text-text-secondary">{c.reg}</td>
                  <td className="py-3 px-2 font-semibold text-text tabular-nums">{c.enrolled}</td>
                  <td className="py-3 px-2 text-text-secondary tabular-nums">{c.vol}</td>
                  <td className="py-3 px-2 text-positive font-semibold">{c.ratio}</td>
                  <td className="py-3 px-2 text-text tabular-nums">{c.sos}</td>
                  <td className="py-3 px-3 text-positive font-semibold tabular-nums">{c.att}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

