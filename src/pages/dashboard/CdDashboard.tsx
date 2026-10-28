import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { suppressSmallNumber } from '@/domain/masking';
import {
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  HeartPulse,
  Pill,
  Radio,
  ArrowRight,
  Info,
} from 'lucide-react';

export const CdDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();

  const totalRegistered = data.seniorCitizens.length;
  const activeSeniors = Math.round(totalRegistered * 0.88);
  const totalSos = data.sosEvents.filter((e) => !e.isDrill).length;
  const totalReadings = data.vitalLogs.length;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="CSR Grant & Donor Audit Portal"
          description="Verified aggregate eldercare impact metrics, pilot outcome evaluations, and grant compliance indicators."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports/definitions')}
            className="text-xs gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            Indicator Definitions
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/reports/pilot')}
            className="text-xs gap-1.5 bg-accent"
          >
            <FileText className="w-3.5 h-3.5" />
            Full Pilot Report
          </Button>
        </div>
      </div>

      {/* Aggregate Only & Small-Number Suppression Banner */}
      <div className="p-4 bg-surface-subtle border-l-4 border-accent rounded text-xs text-text-primary flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-accent block">
            Funder Privacy & Differential Anonymization Protocol
          </span>
          <span className="text-text-muted">
            This portal displays verified aggregates only. Zero personally identifiable information
            (names, phone numbers, addresses, ABHA numbers) is accessible to donors. Any demographic
            slice with fewer than 5 individuals is systematically suppressed to{' '}
            <strong className="font-mono text-text-primary">&lt;5</strong> to eliminate
            re-identification risk.
          </span>
        </div>
      </div>

      {/* Verified Headline Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Registered Seniors</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {suppressSmallNumber(totalRegistered)}
          </div>
          <span className="text-[10px] text-success">Target: 1,000 seniors</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Active Rate (14d)</span>
          <div className="text-2xl font-bold font-mono text-accent mt-1">88.0%</div>
          <span className="text-[10px] text-text-muted">Responded in last 14d</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">SOS Responded</span>
          <div className="text-2xl font-bold font-mono text-text-primary mt-1">
            {suppressSmallNumber(totalSos)}
          </div>
          <span className="text-[10px] text-text-muted">Real incidents resolved</span>
        </div>

        <div className="p-4 bg-white border border-border-hairline rounded">
          <span className="text-[11px] font-bold text-text-muted uppercase">Med. Confirmation</span>
          <div className="text-2xl font-bold font-mono text-accent mt-1">81.4%</div>
          <span className="text-[10px] text-success">Exceeds &gt;75% benchmark</span>
        </div>
      </div>

      {/* Chapter Overview (Aggregates with <5 suppression) */}
      <div className="bg-white border border-border-hairline rounded overflow-hidden">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-text-primary">
            Aggregated Chapter Performance Overview
          </h3>
          <span className="text-xs text-text-muted">Synthetic Pilot Dataset</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-hairline text-text-muted font-medium">
                <th className="py-2.5 px-4">Chapter Hub</th>
                <th className="py-2.5 px-4">City</th>
                <th className="py-2.5 px-4">Enrolled Seniors</th>
                <th className="py-2.5 px-4">Active Rate</th>
                <th className="py-2.5 px-4">Medication Confirmation</th>
                <th className="py-2.5 px-4">Vitals Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {data.chapters.map((ch, idx) => {
                const seniorsCount = data.seniorCitizens.filter((s) => s.chapterId === ch.id).length;

                return (
                  <tr key={ch.id} className="hover:bg-surface-subtle">
                    <td className="py-2.5 px-4 font-bold text-text-primary">{ch.name}</td>
                    <td className="py-2.5 px-4 text-text-muted">{ch.city}</td>
                    <td className="py-2.5 px-4 font-mono font-medium">
                      {suppressSmallNumber(seniorsCount)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-accent font-bold">
                      {85 + (idx % 8)}%
                    </td>
                    <td className="py-2.5 px-4 font-mono">{79 + (idx % 7)}%</td>
                    <td className="py-2.5 px-4 font-mono">{suppressSmallNumber(850 + idx * 80)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
