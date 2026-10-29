import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck2,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export const PrivacyStatementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'principles' | 'dictionary' | 'differencing'>('principles');
  const [testDelta, setTestDelta] = useState<number>(3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telemetry Privacy & Anonymisation Statement"
        subtitle="Cryptographic privacy guarantees, k-anonymity (k ≥ 5), complementary suppression, and data minimization."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Ecosystem Telemetry', href: '/telemetry' },
          { label: 'Privacy Statement' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('principles')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'principles'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Mathematical Guarantees
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'dictionary'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Data Dictionary (Inclusion vs Purged)
        </button>
        <button
          onClick={() => setActiveTab('differencing')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'differencing'
              ? 'border-accent text-accent font-semibold'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Query Differencing Defense
        </button>
      </div>

      {activeTab === 'principles' && (
        <div className="space-y-6">
          <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg  font-semibold text-text">
                  The Four Pillars of Vayoshreshtha Ecosystem Telemetry
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  All ecosystem reports, public dashboards, and policy evidence exports enforce differential
                  privacy constraints at the database extraction layer before rendering or serialization.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-border rounded-lg bg-page space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <EyeOff className="w-4 h-4" />
                  <span>1. Strict k-Anonymity (k ≥ 5)</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Every cohort cell presented must aggregate at least 5 distinct individuals. Any cell with 1 to 4
                  individuals is automatically suppressed and masked as <span className="font-semibold text-text">"&lt; 5 (Suppressed)"</span>.
                  Singular individuals cannot be re-identified by demographic cross-tabulation.
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg bg-page space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>2. Complementary Secondary Suppression</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Suppressing only one cell in a row enables an attacker to deduce its value using the formula
                  <span className="font-semibold text-text"> Target = Total - Sum(Other Cells)</span>.
                  The telemetry engine automatically identifies and suppresses the second-smallest cell in the row
                  so mathematical recovery is mathematically impossible.
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg bg-page space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <Database className="w-4 h-4" />
                  <span>3. Coarse Spatial & Temporal Binning</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Field geo-stamps are truncated to 2 decimal places (~1.1 km bounding box) during collection. In
                  telemetry views, geographic resolution is further clamped to Chapter (Hub) or District. Timestamps
                  are rounded to weekly or monthly epoch bins.
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg bg-page space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <FileCheck2 className="w-4 h-4" />
                  <span>4. Purpose-Restricted Categorisation</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Vaccination coverage is grouped strictly into 5 generalized buckets: None, 1 dose, Completed
                  primary, Booster, Unknown. Manufacturer names, lot numbers, clinic sites, and adverse reactions
                  are completely stripped from telemetry pipelines.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              Mathematical Proof of Complementary Suppression
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Suppose a chapter has 100 members in an age bracket: 80 in Ward A, 18 in Ward B, and 2 in Ward C.
              Primary suppression masks Ward C as &lt;5. Without complementary suppression:
              <br />
              <span className="font-semibold text-text">Ward C = 100 - (80 + 18) = 2</span> (Identity exposed!).
              <br />
              With Vayoshreshtha complementary suppression, Ward B (18) is also suppressed. The observer sees:
              Ward A = 80, Ward B = Suppressed, Ward C = Suppressed, Total = 100.
              The observer only knows that Ward B + Ward C = 20, keeping both individuals fully anonymous.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'dictionary' && (
        <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg  font-semibold text-text">
              Telemetry Data Dictionary
            </h2>
            <p className="text-sm text-text-secondary">
              Exhaustive inventory of telemetry attributes showing what is retained, aggregated, or strictly excluded.
            </p>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-page text-text-secondary border-b border-border">
                <tr>
                  <th className="p-3 font-semibold">Data Category</th>
                  <th className="p-3 font-semibold">Included in Telemetry (Aggregated)</th>
                  <th className="p-3 font-semibold">Strictly Purged / Never Collected</th>
                  <th className="p-3 font-semibold">Privacy Protection Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-semibold text-text">Demographics</td>
                  <td className="p-3 text-text">Age bracket (e.g. 60-69, 70-79), Gender distribution</td>
                  <td className="p-3 text-negative font-semibold">Exact date of birth, Full name, Aadhaar / ABHA number</td>
                  <td className="p-3 text-text-secondary">k ≥ 5 suppression, decadal binning</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Geography</td>
                  <td className="p-3 text-text">Ekta Hub (Chapter), District name</td>
                  <td className="p-3 text-negative font-semibold">Continuous GPS trails, street address, postal pin codes</td>
                  <td className="p-3 text-text-secondary">2-decimal field blur (~1 km), chapter aggregation</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Vitals & Health</td>
                  <td className="p-3 text-text">90-day cohort systolic/diastolic stabilization trends, vaccine category</td>
                  <td className="p-3 text-negative font-semibold">Doctor notes, diagnostic clinical histories, prescription brands</td>
                  <td className="p-3 text-text-secondary">Non-clinical wellness aggregates, 5-bucket vaccine coarsening</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Service Referrals</td>
                  <td className="p-3 text-text">Category volumes (Legal, Transport, Food), Completion rates</td>
                  <td className="p-3 text-negative font-semibold">Case details, legal affidavit texts, personal dispute notes</td>
                  <td className="p-3 text-text-secondary">SLA time-series aggregates, partner capacity counts</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text">Financial & Vouchers</td>
                  <td className="p-3 text-text">Redemption rates by chapter, campaign allocation totals</td>
                  <td className="p-3 text-negative font-semibold">Bank account numbers, UPI IDs, household income</td>
                  <td className="p-3 text-text-secondary">Single-use Crockford tokens, cryptographic hash only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'differencing' && (
        <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg  font-semibold text-text">
              Query Differencing Attack Simulation
            </h2>
            <p className="text-sm text-text-secondary">
              A malicious analyst can issue two queries: "Seniors with Hypertension in Chapter Pune" (N = 100)
              and "Seniors with Hypertension in Chapter Pune EXCEPT Senior X" (N = 99).
              The delta reveals Senior X's confidential health condition.
            </p>
          </div>

          <div className="p-5 border border-border rounded-lg bg-page space-y-4">
            <h3 className="text-sm font-semibold text-text">
              Interactive Differencing Engine Inspector
            </h3>
            <p className="text-xs text-text-secondary">
              Simulate an analyst querying cohort filters with varying intersection overlap.
            </p>

            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-text-secondary">
                Filter Intersection Delta:
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={testDelta}
                onChange={(e) => setTestDelta(parseInt(e.target.value, 10))}
                className="w-48 accent-brand-primary"
              />
              <span className="text-sm font-semibold text-text">{testDelta} records</span>
            </div>

            <div className="pt-2">
              {testDelta < 5 ? (
                <div className="p-4 bg-red-50 border border-negative/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-negative shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-negative">
                      Query Blocked by Telemetry Security Engine
                    </h4>
                    <p className="text-xs text-negative/90 mt-1">
                      Intersection delta ({testDelta}) is strictly less than k = 5.
                      This query matches the fingerprint of an active Differencing Attack.
                      Result: HTTP 422 Unprocessable Query (Differencing violation logged in audit chain).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-accent/30 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-accent">
                      Query Allowed & Anonymised
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Intersection delta ({testDelta}) satisfies k ≥ 5 constraint.
                      Aggregated cohort counts are safely emitted with standard complementary suppression.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-emerald-50 border border-accent/20 rounded-xl flex items-center justify-between">
        <div className="text-xs text-text-secondary">
          <span className="font-semibold text-accent">Regulatory Alignment:</span>{' '}
          Complies with India Digital Personal Data Protection (DPDP) Act 2023, ABDM Health Data Management Policy, and DISHA Guidelines.
        </div>
        <a
          href="/ecosystem"
          className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline"
        >
          View Ecosystem Nexus Map
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
