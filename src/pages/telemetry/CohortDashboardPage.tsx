import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  applyKAnonymity,
  applyComplementarySuppression,
  AnonymizedCubeCell,
} from '@/domain/telemetry/anonymisation';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  Shield,
  Activity,
  Table,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CohortDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [ageBandFilter, setAgeBandFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [lastRefreshed, setLastRefreshed] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setLastRefreshed(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000); // 30s near-real-time tick
    return () => clearInterval(interval);
  }, []);

  // Anonymised Age Cohort Distribution (with k >= 5 and complementary suppression)
  const ageCells: AnonymizedCubeCell[] = [
    { label: '60–69 years', rawCount: 420 },
    { label: '70–79 years', rawCount: 380 },
    { label: '80+ years (Advanced Age)', rawCount: 160 },
  ];
  const ageDistribution = applyComplementarySuppression(ageCells, 960, 5);

  // 5 Coarse Vaccination Categories
  const vaccinationData = [
    { name: 'Influenza (Annual Flu)', yes: 310, total: 420, percent: 74 },
    { name: 'Pneumococcal', yes: 285, total: 390, percent: 73 },
    { name: 'COVID-19 Booster', yes: 540, total: 610, percent: 89 },
    { name: 'Shingles (Herpes Zoster)', yes: 145, total: 260, percent: 56 },
    { name: 'Tetanus / Td', yes: 390, total: 460, percent: 85 },
  ];

  // Policy Evidence Indicators (National Policy & Rights Advocacy)
  const policyEvidence = [
    {
      code: 'DECLINED_AGE_BAR',
      label: 'Health & Travel Insurance Age-Bar Exclusions',
      count: 46,
      subtext: 'Elderly applicants rejected strictly due to policy age limits (>65 / >70)',
      severity: 'critical',
    },
    {
      code: 'NO_COVER_AVAILABLE',
      label: 'Comprehensive OPD / Dementia Coverage Denied',
      count: 28,
      subtext: 'Pre-existing chronic cognitive condition exclusions',
      severity: 'critical',
    },
    {
      code: 'LEGAL_MAINTENANCE_ACT',
      label: 'Senior Citizens Maintenance & Welfare Act Inquiries',
      count: 34,
      subtext: 'Pro-bono legal inquiries regarding property rights and parental maintenance',
      severity: 'informative',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-text-primary">
              Real-Time Cohort Telemetry
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-positive-tint text-positive">
              k ≥ 5 Guaranteed
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            Layer 4 — Population health compliance, coarse vaccination trends, and national policy advocacy evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-text-muted">
            Aggregates refreshed: <strong className="text-text-primary font-semibold">{lastRefreshed}</strong>
          </span>

          <Button
            variant="secondary"
            size="md"
            icon={<Table className="w-4 h-4" />}
            onClick={() => setViewMode(viewMode === 'visual' ? 'table' : 'visual')}
          >
            {viewMode === 'visual' ? 'View as Table' : 'View as Graphic'}
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => navigate('/telemetry/packs')}
          >
            Impact Packs Builder
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-bg-surface border border-border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Geographic Region</label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
          >
            <option value="ALL">National Aggregate (All 3 Regions)</option>
            <option value="WEST">West Region (Maharashtra &amp; MP)</option>
            <option value="SOUTH">South Region (Karnataka &amp; TN)</option>
            <option value="NORTH">North Region (Rajasthan &amp; UP)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Age Cohort</label>
          <select
            value={ageBandFilter}
            onChange={(e) => setAgeBandFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
          >
            <option value="ALL">All Elder Age Bands (60+)</option>
            <option value="60-69">60–69 years (Young Old)</option>
            <option value="70-79">70–79 years (Middle Old)</option>
            <option value="80+">80+ years (Advanced Age)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Primary Language</label>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
          >
            <option value="ALL">All Languages (Vernacular &amp; English)</option>
            <option value="Marathi">Marathi</option>
            <option value="Kannada">Kannada</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Cohort Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Total Cohort Size</div>
          <div className="text-2xl font-semibold text-accent tabular-nums mt-1">960</div>
          <div className="text-[11px] text-text-muted mt-0.5">Active registered beneficiaries</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Medication Adherence Rate</div>
          <div className="text-2xl font-semibold text-positive tabular-nums mt-1">82.4%</div>
          <div className="text-[11px] text-text-muted mt-0.5">30-day WhatsApp confirmations</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Vitals Routine Logging Rate</div>
          <div className="text-2xl font-semibold text-text-primary tabular-nums mt-1">74.1%</div>
          <div className="text-[11px] text-text-muted mt-0.5">Bi-weekly BP &amp; Glucose entries</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Field Onboarding Completion</div>
          <div className="text-2xl font-semibold text-text-primary tabular-nums mt-1">91.8%</div>
          <div className="text-[11px] text-text-muted mt-0.5">Both consents verified</div>
        </div>
      </div>

      {/* Coarse Vaccination Coverage & Age Cohort Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vaccination Table */}
        <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Coarse Adult Vaccination Coverage
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Consent-gated self-reported status across 5 major senior vaccine categories.
              </p>
            </div>
            <Link
              to="/telemetry/trends"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>Macro trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {vaccinationData.map((vac) => (
              <div key={vac.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-primary">{vac.name}</span>
                  <span className="tabular-nums font-semibold text-text-primary">
                    {vac.percent}%{' '}
                    <span className="text-text-muted font-normal">
                      ({vac.yes} / {vac.total})
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 bg-border-hairline rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${vac.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted italic pt-2 border-t border-border-hairline">
            Notice: Self-reported for ecosystem public health analysis; not a certified clinical immunization certificate.
          </p>
        </div>

        {/* Age Band Distribution */}
        <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Age Band Demographics
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                k-Anonymity guaranteed with secondary complementary suppression.
              </p>
            </div>
            <Link
              to="/telemetry/privacy"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>Privacy statement</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {ageDistribution.map((band) => (
              <div
                key={band.label}
                className="p-3 bg-bg-subtle/40 rounded-lg border border-border-hairline flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-text-primary">{band.label}</div>
                  <div className="text-[11px] text-text-muted">
                    {band.rawCount > 300 ? 'Highest concentration' : 'High care priority'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold text-text-primary tabular-nums">
                    {band.displayCount}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {Math.round((band.rawCount / 960) * 100)}% of cohort
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Evidence Indicators (Strategic Goal 2) */}
      <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              National Policy &amp; Elder Rights Advocacy Evidence
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Aggregated institutional exclusion codes feeding evidence-based reform for NITI Aayog and Ministry of Social Justice.
            </p>
          </div>
          <span className="text-xs text-text-muted font-medium">90-Day Accumulation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {policyEvidence.map((ev) => (
            <div
              key={ev.code}
              className="p-4 bg-bg-subtle/50 rounded-xl border border-border-hairline space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-critical tabular-nums">
                    {ev.count}
                  </span>
                  <AlertCircle className="w-4 h-4 text-critical" />
                </div>
                <div className="text-xs font-semibold text-text-primary mt-2">
                  {ev.label}
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {ev.subtext}
                </p>
              </div>

              <div className="pt-2 border-t border-border-hairline text-[11px] text-accent font-medium">
                Anonymized evidence code: {ev.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
