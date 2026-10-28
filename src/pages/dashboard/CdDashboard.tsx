import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '@/mock/store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiTile } from '@/components/ui/KpiTile';
import { MessageStrip } from '@/components/ui/MessageStrip';
import { suppressSmallNumber } from '@/domain/masking';
import {
  FileText,
  Info,
} from 'lucide-react';

export const CdDashboard: React.FC = () => {
  const navigate = useNavigate();
  const data = mockStore.getData();

  const totalRegistered = data.seniorCitizens.length;
  const totalSos = data.sosEvents.filter((e) => !e.isDrill).length;
  const totalReadings = data.vitalLogs.length;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* 1. Anonymization Protocol Notice */}
      <MessageStrip
        type="informative"
        message="Funder privacy and differential anonymization protocol: This portal presents verified cohort aggregates only. Zero personally identifiable information is accessible. Demographic slices with fewer than 5 individuals are systematically suppressed to eliminate re-identification risk."
      />

      {/* 2. Page Header */}
      <PageHeader
        title="CSR Grant and Donor Audit Portal"
        description="Verified aggregate eldercare impact metrics, pilot outcome evaluations, and grant compliance indicators."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/reports/definitions')}
              className="gap-1.5"
            >
              <Info className="w-4 h-4" strokeWidth={1.5} />
              Indicator Definitions
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/reports/pilot')}
              className="gap-1.5"
            >
              <FileText className="w-4 h-4" strokeWidth={1.5} />
              Full Pilot Report
            </Button>
          </div>
        }
      />

      {/* 3. Exactly 4 Headline Numeric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          title="Registered seniors"
          value={suppressSmallNumber(totalRegistered)}
          statusLine="Target: 1,000 seniors"
          status="positive"
        />
        <KpiTile
          title="Active engagement rate"
          value="88.0%"
          statusLine="Responded in last 14 days"
          status="positive"
        />
        <KpiTile
          title="SOS incidents resolved"
          value={suppressSmallNumber(totalSos)}
          statusLine="Real-world emergencies resolved"
          status="positive"
        />
        <KpiTile
          title="Medication confirmation"
          value="81.4%"
          statusLine="Exceeds > 75.0% benchmark"
          status="positive"
        />
      </div>

      {/* 4. Secondary Grant Metrics (Key-Value List) */}
      <Card
        title="Grant compliance indicators"
        subtitle="Operational metrics monitored under corporate social responsibility guidelines"
        padding="md"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
          <div>
            <div className="text-xs text-text-secondary">Vital signs logged</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">{suppressSmallNumber(totalReadings)}</div>
            <div className="text-xs text-text-secondary mt-0.5">Systolic BP and glucose entries</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Pilot elapsed duration</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">42 / 90 days</div>
            <div className="text-xs text-text-secondary mt-0.5">Multi-chapter field evaluation</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Operating chapters</div>
            <div className="text-xl font-semibold text-text tabular-nums mt-1">{data.chapters.length} hubs</div>
            <div className="text-xs text-text-secondary mt-0.5">Tier 1 and Tier 2 cities in India</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Audit compliance score</div>
            <div className="text-xl font-semibold text-positive tabular-nums mt-1">100%</div>
            <div className="text-xs text-text-secondary mt-0.5">Dual-authorization sign-offs verified</div>
          </div>
        </div>
      </Card>

      {/* 5. Chapter Overview Table */}
      <Card padding="none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Aggregated chapter performance overview
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Verified outcomes by regional implementation partner chapter
            </p>
          </div>
          <span className="text-xs text-text-secondary tabular-nums">
            {data.chapters.length} chapters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-subtle border-b border-border text-text-secondary font-semibold h-10">
                <th className="py-2 px-4">Chapter hub</th>
                <th className="py-2 px-4">City</th>
                <th className="py-2 px-4 text-right">Enrolled seniors</th>
                <th className="py-2 px-4 text-right">Active rate</th>
                <th className="py-2 px-4 text-right">Medication confirmation</th>
                <th className="py-2 px-4 text-right">Vitals logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.chapters.map((ch, idx) => {
                const seniorsCount = data.seniorCitizens.filter((s) => s.chapterId === ch.id).length;

                return (
                  <tr
                    key={ch.id}
                    className="h-12 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-2 px-4 font-semibold text-text">{ch.name}</td>
                    <td className="py-2 px-4 text-text-secondary">{ch.city}</td>
                    <td className="py-2 px-4 text-right tabular-nums text-text">
                      {suppressSmallNumber(seniorsCount)}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums text-accent font-semibold">
                      {85 + (idx % 8)}%
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums text-text">
                      {79 + (idx % 7)}%
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums text-text">
                      {suppressSmallNumber(850 + idx * 80)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
