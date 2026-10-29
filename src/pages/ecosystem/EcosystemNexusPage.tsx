import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitMerge,
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  Activity,
  FileCheck2,
  Ticket,
  Scale,
  Smartphone,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getImpactPacks } from '@/domain/telemetry/packBuilder';
import { SERVICE_REQUESTS, PARTNER_REGISTRY } from '@/domain/routing/engine';
import { REGISTERED_VOUCHERS } from '@/domain/vouchers/voucherEngine';
import { SEED_LESSONS } from '@/domain/learning/learningEngine';

export const EcosystemNexusPage: React.FC = () => {
  const packs = getImpactPacks();
  const requests = SERVICE_REQUESTS;
  const partners = PARTNER_REGISTRY;
  const vouchers = REGISTERED_VOUCHERS;
  const lessons = SEED_LESSONS;

  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const totalVouchersRedeemedInr = vouchers
    .filter((v) => v.status === 'redeemed')
    .reduce((acc, v) => acc + v.faceValueInr, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ecosystem Strategic Nexus Architecture"
        subtitle="End-to-end digital infrastructure connecting verified partners, senior field associates, and elders."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Ecosystem Nexus' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/verify"
              className="px-3.5 py-2 text-xs font-semibold text-text-secondary border border-border rounded-lg hover:bg-page flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              Public Verification Gateway
            </Link>
            <Link
              to="/simulator"
              className="px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg hover:bg-accent/90 flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              Cross-Ecosystem Simulator
            </Link>
          </div>
        }
      />

      {/* Strategic Framing Banner */}
      <div className="p-6 bg-bg-surface border border-border rounded-xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-accent">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg  font-semibold text-text">
              The Vayoshrestha Aggregation Thesis
            </h2>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-3xl">
              Vayoh Vikas does not deliver proprietary hospitals, labs, or legal counsel. Instead, Vayoshrestha
              acts as the verified digital conduit and governance layer connecting senior citizens with
              regulated third-party partners through deterministic capacity routing, single-use vouchers,
              and tamper-evident policy evidence.
            </p>
          </div>
        </div>

        {/* Live Ecosystem Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border">
          <div className="p-3 bg-page border border-border rounded-lg text-center space-y-0.5">
            <div className="text-xs text-text-secondary">Ecosystem Partners</div>
            <div className="text-xl  font-semibold text-accent">{partners.length}</div>
            <div className="text-xs text-emerald-800">Verified & Active</div>
          </div>

          <div className="p-3 bg-page border border-border rounded-lg text-center space-y-0.5">
            <div className="text-xs text-text-secondary">Deterministic Routes</div>
            <div className="text-xl  font-semibold text-accent">{requests.length}</div>
            <div className="text-xs text-emerald-800">100% Decision Audited</div>
          </div>

          <div className="p-3 bg-page border border-border rounded-lg text-center space-y-0.5">
            <div className="text-xs text-text-secondary">Vouchers Claimed</div>
            <div className="text-xl  font-semibold text-accent">₹{totalVouchersRedeemedInr.toLocaleString()}</div>
            <div className="text-xs text-emerald-800">Crockford Base-32</div>
          </div>

          <div className="p-3 bg-page border border-border rounded-lg text-center space-y-0.5">
            <div className="text-xs text-text-secondary">Sealed Impact Packs</div>
            <div className="text-xl  font-semibold text-accent">
              {packs.filter((p) => p.status === 'released').length}
            </div>
            <div className="text-xs text-emerald-800">SHA-256 Verified</div>
          </div>

          <div className="p-3 bg-page border border-border rounded-lg text-center space-y-0.5 col-span-2 sm:col-span-1">
            <div className="text-xs text-text-secondary">Privacy Defense</div>
            <div className="text-xl  font-semibold text-accent">k ≥ 5</div>
            <div className="text-xs text-emerald-800">DPDP 2023 Compliant</div>
          </div>
        </div>
      </div>

      {/* The 4 Interconnected Layers Diagram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">
            Ecosystem Architecture Matrix (Layers 1 to 4)
          </h3>
          <span className="text-xs text-text-secondary">Click any layer to view operational components</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Layer 1: Telemetry & Policy Evidence */}
          <div
            onClick={() => setSelectedLayer(1)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
              selectedLayer === 1
                ? 'bg-emerald-50/40 border-accent'
                : 'bg-bg-surface border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-accent font-semibold flex items-center justify-center text-xs">
                  L1
                </div>
                <div>
                  <h4 className="text-base  font-semibold text-text">
                    Layer 1: Telemetry & Policy Evidence
                  </h4>
                  <div className="text-xs text-accent font-semibold">Aggregated Impact & Cryptographic Proofs</div>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Synthesizes raw field events into k-anonymised (k ≥ 5) macro indicators. Generates tamper-evident
              SHA-256 signed PDF impact dossiers for CSR donors, government bodies, and insurers.
            </p>

            <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs">
              <Link
                to="/telemetry"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Cohort Dashboard (k ≥ 5)
              </Link>
              <Link
                to="/telemetry/trends"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Macro Health Trends
              </Link>
              <Link
                to="/telemetry/packs"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Impact Packs
              </Link>
              <Link
                to="/verify"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Public Verify Gateway
              </Link>
            </div>
          </div>

          {/* Layer 2: Partner Aggregation & Routing */}
          <div
            onClick={() => setSelectedLayer(2)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
              selectedLayer === 2
                ? 'bg-emerald-50/40 border-accent'
                : 'bg-bg-surface border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-accent font-semibold flex items-center justify-center text-xs">
                  L2
                </div>
                <div>
                  <h4 className="text-base  font-semibold text-text">
                    Layer 2: Partner Aggregation & Routing
                  </h4>
                  <div className="text-xs text-accent font-semibold">Deterministic Routing & Subsidies</div>
                </div>
              </div>
              <GitMerge className="w-5 h-5 text-accent" />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Deterministic, capacity-aware routing fabric for hospitals, labs, legal aid, and financial advisors.
              Issues single-use Crockford Base-32 vouchers and handles encrypted pro-bono legal intakes.
            </p>

            <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs">
              <Link
                to="/routing"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Partner Routing Fabric
              </Link>
              <Link
                to="/vouchers"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Digital Vouchers
              </Link>
              <Link
                to="/partner/vouchers/redeem"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Redemption Terminal
              </Link>
              <Link
                to="/legal-intake"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Pro-Bono Legal Intake
              </Link>
            </div>
          </div>

          {/* Layer 3: Field Network Operations */}
          <div
            onClick={() => setSelectedLayer(3)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
              selectedLayer === 3
                ? 'bg-emerald-50/40 border-accent'
                : 'bg-bg-surface border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-accent font-semibold flex items-center justify-center text-xs">
                  L3
                </div>
                <div>
                  <h4 className="text-base  font-semibold text-text">
                    Layer 3: Field Network Operations
                  </h4>
                  <div className="text-xs text-accent font-semibold">Elder Field Associates & Double Consent</div>
                </div>
              </div>
              <Activity className="w-5 h-5 text-accent" />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Mobile-first field terminal for active elder associates (Role SF). Enforces double-consent onboarding,
              in-browser WebCrypto AES-GCM local encryption, 2-decimal coarse geo-stamping, and offline queueing.
            </p>

            <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs">
              <Link
                to="/field"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Mobile Field Terminal (/field)
              </Link>
              <Link
                to="/field-network"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Staff Operations Hub
              </Link>
              <Link
                to="/field-network/associates"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Field Associates Roster
              </Link>
              <Link
                to="/field-network/sync"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Sync Telemetry Monitor
              </Link>
            </div>
          </div>

          {/* Layer 4: Virtual Literacy & Community Circles */}
          <div
            onClick={() => setSelectedLayer(4)}
            className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
              selectedLayer === 4
                ? 'bg-emerald-50/40 border-accent'
                : 'bg-bg-surface border-border hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-accent font-semibold flex items-center justify-center text-xs">
                  L4
                </div>
                <div>
                  <h4 className="text-base  font-semibold text-text">
                    Layer 4: Virtual Literacy & Community
                  </h4>
                  <div className="text-xs text-accent font-semibold">Bite-Sized Lessons & Gamification</div>
                </div>
              </div>
              <BookOpen className="w-5 h-5 text-accent" />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              4-domain bite-sized micro-lessons with WhatsApp chat bubble simulation. Daily drip campaigns with
              quiet hours (21:00-08:00) policy, community webinars, and Mastermind quizzes with anonymous leaderboards.
            </p>

            <div className="pt-2 border-t border-border flex flex-wrap gap-2 text-xs">
              <Link
                to="/learning"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Micro-Lessons Library
              </Link>
              <Link
                to="/learning/series"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Drip Campaigns & Quiet Hours
              </Link>
              <Link
                to="/learning/webinars"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Webinars & Channels
              </Link>
              <Link
                to="/learning/quizzes"
                className="px-2.5 py-1 bg-page border border-border rounded hover:border-accent text-text font-semibold"
              >
                Regional Mastermind Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Note */}
      <div className="p-4 bg-emerald-50 border border-accent/20 rounded-xl flex items-center justify-between text-xs">
        <div className="text-text-secondary">
          <strong className="text-accent">Integrated Ecosystem:</strong> All 4 layers operate with role-based default-deny permissions, immutable audit hash chaining, and zero external network leaks.
        </div>
        <Link
          to="/simulator"
          className="text-accent font-semibold flex items-center gap-1 hover:underline"
        >
          Open Phone Simulator
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
