import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sliders, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

export const SupportRulesPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Link to="/support/requests" className="hover:text-[var(--accent)] flex items-center gap-1">
          <ArrowLeft size={14} /> Health support
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-semibold">Rules</span>
      </div>

      <PageHeader
        title="Clinical escalation rules & thresholds"
        subtitle="Automated trigger criteria that escalate health readings to on-call physicians"
      />

      <div className="space-y-4">
        {[
          {
            param: 'Systolic Blood Pressure (SBP)',
            critical: '> 180 mmHg (Immediate Alert)',
            high: '> 160 mmHg on 2 consecutive readings (Escalate within 4 hours)',
            low: '< 90 mmHg (Hypotension alert)',
          },
          {
            param: 'Diastolic Blood Pressure (DBP)',
            critical: '> 110 mmHg',
            high: '> 100 mmHg on 2 consecutive readings',
            low: '< 60 mmHg',
          },
          {
            param: 'Fasting Blood Glucose',
            critical: '> 250 mg/dL or < 60 mg/dL (Hypoglycemia alert)',
            high: '> 180 mg/dL on 3 consecutive days',
            low: '< 70 mg/dL',
          },
        ].map((rule, idx) => (
          <Card key={idx} title={rule.param}>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-[var(--negative-tint)] text-[var(--negative)]">
                <span className="font-semibold block">Critical Tier-1</span>
                <span>{rule.critical}</span>
              </div>
              <div className="p-3 rounded bg-[var(--critical-tint)] text-[var(--critical)]">
                <span className="font-semibold block">High Tier-2</span>
                <span>{rule.high}</span>
              </div>
              <div className="p-3 rounded bg-[var(--surface-subtle)] text-[var(--text-secondary)]">
                <span className="font-semibold block">Low Band</span>
                <span>{rule.low}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

