import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FieldTelemetryCard } from '@/components/telemetry/FieldTelemetryCard';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Activity,
  RefreshCw,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const FieldNetworkOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Field Operations Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Layer 3 — Senior Field Associate network, double-consent onboardings, and offline telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => window.open('/field', '_blank')}
          >
            Launch Field Terminal (/field)
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Users className="w-4 h-4" />}
            onClick={() => navigate('/field-network/associates')}
          >
            Manage Associates (60)
          </Button>
        </div>
      </div>

      {/* Field Telemetry Card (Cross-Cutting Hero Component) */}
      <FieldTelemetryCard />

      {/* 3 Quick Action / Hub Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Associates Roster */}
        <Link
          to="/field-network/associates"
          className="p-5 bg-bg-surface rounded-xl border border-border hover:border-accent transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-accent-tint text-accent flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text-primary text-base group-hover:text-accent flex items-center justify-between">
              <span>Associates Roster</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              60 Senior Field Associates deployed across 9 Ekta Hub chapters. Chapter assignments, certification status, and deactivation safeguards.
            </p>
          </div>
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted mt-4">
            <span className="font-semibold text-text-primary">60 Active</span>
            <span className="text-positive font-medium">96% Certified</span>
          </div>
        </Link>

        {/* Card 2: Central Activity Audit Stream */}
        <Link
          to="/field-network/activity"
          className="p-5 bg-bg-surface rounded-xl border border-border hover:border-accent transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-accent-tint text-accent flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text-primary text-base group-hover:text-accent flex items-center justify-between">
              <span>Activity Stream</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Real-time audit log of peer visits and onboardings with privacy-preserving area labels (±1 km) and double consent state indicators.
            </p>
          </div>
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted mt-4">
            <span className="font-semibold text-text-primary">1,480 Synced</span>
            <span>Audited Logs</span>
          </div>
        </Link>

        {/* Card 3: Sync Queue Monitor */}
        <Link
          to="/field-network/sync"
          className="p-5 bg-bg-surface rounded-xl border border-border hover:border-accent transition-all flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-accent-tint text-accent flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text-primary text-base group-hover:text-accent flex items-center justify-between">
              <span>Sync Queue Telemetry</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Batch commit monitor, latency tracking, late-sync warnings (&gt;24h), and System Administrator retry actions.
            </p>
          </div>
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted mt-4">
            <span className="font-semibold text-text-primary">38m Median Delay</span>
            <span className="text-critical font-medium">4 Late Syncs</span>
          </div>
        </Link>
      </div>

      {/* DPDP Compliance & Architecture Banner */}
      <div className="p-4 bg-bg-subtle rounded-xl border border-border-hairline flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0" />
          <div>
            <div className="font-semibold text-text-primary">DPDP Double-Consent State Machine Enforced</div>
            <div className="mt-0.5">
              Peers onboarded by field associates require both in-person Consent 1 and independent WhatsApp Consent 2 before moving to Registered status.
            </div>
          </div>
        </div>
        <Link
          to="/onboarding"
          className="font-semibold text-accent hover:underline flex items-center gap-1"
        >
          <span>View Stalled Onboardings Queue</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
