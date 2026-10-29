import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DefinitionsPage: React.FC = () => {
  const definitions = [
    {
      term: 'Registered Senior Citizen',
      canonical:
        'A senior citizen aged 60 and above who has completed onboarding: full legal name + language preference + at least one validated next-of-kin emergency contact + explicit DPDP safety consent recorded.',
      rule: 'Senior citizen record with consentRecorded == true and emergency contacts count >= 1.',
      example: 'Ramesh Rao has completed the 7-step onboarding flow. His record is Registered.',
    },
    {
      term: 'Active Senior (14-Day Window)',
      canonical:
        'A registered senior citizen who responded to any automated WhatsApp message (button tap or text reading) within the rolling 14-day window (window configurable in Admin Settings).',
      rule: 'Senior Citizen with response timestamp >= (CurrentTime - 14 Days).',
      example: 'Senior tapped "Taken" 5 days ago: Active. Senior last replied 18 days ago: Inactive.',
    },
    {
      term: 'Emergency SOS Alert Latency',
      canonical:
        'The precise elapsed duration in milliseconds from senior webhook trigger ingestion to real-time regional dashboard render across the event queue.',
      rule: 'Measured latencyMs stamped on SosEvent across BroadcastChannel (simulated target < 1,000 ms).',
      example: 'Senior taps SOS -> webhook queued -> board alerts in 184 ms.',
    },
    {
      term: 'Medication Confirmation Rate',
      canonical:
        'The operational proportion of automated daily medication reminder templates confirmed as Taken by seniors.',
      rule: 'Formula: (Medication Confirmations "Taken") ÷ (Total Utility Reminders Delivered). Benchmark > 75%.',
      example: '842 reminders delivered, 685 confirmed Taken = 81.4% confirmation rate.',
    },
    {
      term: 'Vitals Logging Rate',
      canonical:
        'The proportion of expected blood pressure or glucose readings successfully logged via text parser.',
      rule: 'Formula: (Actual Readings Logged) ÷ (Expected Scheduled Readings). Benchmark > 60%.',
      example: '1,000 enrolled seniors expected to log weekly: 642 logged = 64.2% adherence.',
    },
    {
      term: 'Cellular SMS Fallback',
      canonical:
        'An offline transactional SMS automatically pushed to registered Next-of-Kin when mobile data connectivity is interrupted mid-transaction during an SOS event.',
      rule: 'Fired when networkStatusAtTrigger == "DISCONNECTED" or data receipt times out within 45 seconds.',
      example: 'Senior loses mobile network; gateway immediately routes DLT-registered SMS to daughter.',
    },
    {
      term: 'Differential Privacy: Small-Number Suppression (<5)',
      canonical:
        'Strict statistical disclosure control rule where any aggregate demographic or health cell with a count between 1 and 4 is rendered as "<5".',
      rule: 'If count > 0 and count < 5, display "<5" in all CSR / Donor Reviewer views.',
      example: 'A chapter with 3 critical flag cases displays "<5" to prevent individual re-identification.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <PageHeader
        title="Pilot Measurement Definitions & Metric Standards"
        description="Canonical mathematical formulations governing all pilot KPI cards, charts, and reports (Source of Truth)"
      />

      <div className="p-4 bg-surface-subtle border-l-4 border-accent rounded text-xs text-text-primary flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-accent font-semibold block">
            Institutional Measurement Integrity:
          </strong>
          Every metric displayed across Vayoshreshtha adheres strictly to these standardized pilot
          specifications. No estimations or unsupported calculations are permitted.
        </div>
      </div>

      <div className="space-y-4">
        {definitions.map((d) => (
          <div key={d.term} className="bg-white border border-border-hairline rounded p-5 space-y-2">
            <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              {d.term}
            </h3>
            <p className="text-xs text-text-primary leading-relaxed">{d.canonical}</p>
            <div className="p-2.5 bg-surface-subtle border border-border-hairline rounded text-xs tabular-nums space-y-1">
              <div>
                <strong className="text-text-muted">Computation Rule:</strong> {d.rule}
              </div>
              <div>
                <strong className="text-text-muted">Standard Example:</strong> {d.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
