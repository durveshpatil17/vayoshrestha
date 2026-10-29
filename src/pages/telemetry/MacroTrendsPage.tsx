import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Activity,
  Calendar,
  Filter,
  ArrowLeft,
  Shield,
  Download,
  AlertTriangle,
} from 'lucide-react';

export const MacroTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeWindow, setTimeWindow] = useState<'30d' | '60d' | '90d'>('90d');

  // 90-day macro trend weekly points
  const bloodPressureTrend = [
    { week: 'W1', normal: 78, elevated: 16, crisis: 6 },
    { week: 'W2', normal: 80, elevated: 15, crisis: 5 },
    { week: 'W3', normal: 81, elevated: 15, crisis: 4 },
    { week: 'W4', normal: 82, elevated: 14, crisis: 4 },
    { week: 'W5', normal: 84, elevated: 13, crisis: 3 },
    { week: 'W6', normal: 85, elevated: 12, crisis: 3 },
    { week: 'W7', normal: 86, elevated: 12, crisis: 2 },
    { week: 'W8', normal: 87, elevated: 11, crisis: 2 },
  ];

  const vaccineUptakeTrend = [
    { month: 'Month 1', flu: 42, pneumo: 38, covid: 72 },
    { month: 'Month 2', flu: 61, pneumo: 58, covid: 84 },
    { month: 'Month 3', flu: 74, pneumo: 73, covid: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <span
              onClick={() => navigate('/telemetry')}
              className="hover:text-accent cursor-pointer"
            >
              Telemetry
            </span>
            <span>/</span>
            <span className="text-text-primary font-medium">Macro Trends</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Longitudinal Health &amp; Policy Trends
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            90-day aggregated macro indicators tracking clinical stabilization and insurance exclusion rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['30d', '60d', '90d'] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setTimeWindow(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timeWindow === w
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {w.toUpperCase()} Trend
            </button>
          ))}
        </div>
      </div>

      {/* Trend Card 1: Blood Pressure Anomaly Stabilization */}
      <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Blood Pressure Cohort Stabilization (90 Days)
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Percentage of weekly readings within target systolic/diastolic thresholds (&lt;140/90 mmHg).
            </p>
          </div>
          <span className="text-xs font-semibold text-positive flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +9% Target Compliance
          </span>
        </div>

        {/* Visual Trend Bars */}
        <div className="grid grid-cols-8 gap-2 pt-2">
          {bloodPressureTrend.map((pt) => (
            <div key={pt.week} className="space-y-1 text-center">
              <div className="h-32 flex flex-col justify-end bg-bg-subtle/40 rounded p-1 gap-1">
                <div
                  className="w-full bg-critical rounded-sm transition-all"
                  style={{ height: `${pt.crisis * 2}%` }}
                  title={`Crisis: ${pt.crisis}%`}
                />
                <div
                  className="w-full bg-critical-tint rounded-sm transition-all"
                  style={{ height: `${pt.elevated * 1.5}%` }}
                  title={`Elevated: ${pt.elevated}%`}
                />
                <div
                  className="w-full bg-accent rounded-sm transition-all"
                  style={{ height: `${pt.normal * 0.9}%` }}
                  title={`Target: ${pt.normal}%`}
                />
              </div>
              <span className="text-[11px] font-medium text-text-muted block">{pt.week}</span>
              <span className="text-[10px] font-semibold text-text-primary block tabular-nums">
                {pt.normal}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 border-t border-border-hairline text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-accent inline-block" />
            Target BP (&lt;140/90)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-critical-tint border border-critical/30 inline-block" />
            Elevated Watch Band
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-critical inline-block" />
            Crisis Flags (&gt;180)
          </span>
        </div>
      </div>

      {/* Trend Card 2: Vaccine Adoption Month-by-Month */}
      <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Vaccine Uptake Progression (Pilot Quarters)
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Progress in self-reported adult vaccination awareness across three cohort checkpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vaccineUptakeTrend.map((m) => (
            <div
              key={m.month}
              className="p-4 bg-bg-subtle/50 rounded-xl border border-border-hairline space-y-3"
            >
              <div className="font-semibold text-sm text-text-primary">{m.month}</div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-text-muted mb-0.5">
                    <span>COVID-19 Booster</span>
                    <span className="font-semibold text-text-primary tabular-nums">{m.covid}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-hairline rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${m.covid}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-text-muted mb-0.5">
                    <span>Influenza (Annual)</span>
                    <span className="font-semibold text-text-primary tabular-nums">{m.flu}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-hairline rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${m.flu}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-text-muted mb-0.5">
                    <span>Pneumococcal</span>
                    <span className="font-semibold text-text-primary tabular-nums">{m.pneumo}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border-hairline rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${m.pneumo}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
