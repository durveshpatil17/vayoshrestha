import React from 'react';
import {
  Shield,
  Layers,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Building2,
  Lock,
  Cpu,
  Info,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-surface border border-border rounded-container p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-container bg-accent-tint text-accent border border-accent/20 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-text">About Vayoshrestha</h1>
              <span className="px-2 py-0.5 rounded-full bg-accent-tint border border-accent/20 text-xs text-accent font-semibold">
                v4.0.0
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Vayoshrestha is an integrated digital senior-care ecosystem engineered for <strong>Vayoh Vikas</strong>, enabling community chapters (Ekta Hubs), field associates, and partner networks to deliver preventive care, social engagement, and life-safety emergency response.
            </p>
          </div>
        </div>
      </div>

      {/* Institutional Mission & Governance Notice */}
      <div className="bg-surface border border-border rounded-container p-6 space-y-4">
        <h2 className="text-base font-semibold text-text flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent stroke-[1.5]" />
          <span>Governance, Privacy & Regulatory Compliance</span>
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          This platform is designed to prototype compliance with India's Digital Personal Data Protection Act (DPDP-aligned prototype). All records are processed under documented consent protocols, with role-based access control (RBAC) enforced at all five architecture layers.
        </p>

        <div className="p-3 bg-surface-subtle border border-border rounded-control text-xs text-text-secondary leading-relaxed space-y-1">
          <div className="font-semibold text-text flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-accent stroke-[1.5]" />
            <span>Operational & Legal Disclaimer</span>
          </div>
          <p>
            Vayoshrestha operates as a demonstration prototype for CSR funders and NGO evaluation. All clinical triage algorithms, wellness escalations, and legal guidance records represent operational workflows and do not constitute statutory legal advice or licensed medical diagnoses.
          </p>
        </div>
      </div>

      {/* Platform Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-container p-5 space-y-2">
          <div className="flex items-center gap-2 text-text font-semibold text-sm">
            <Layers className="w-4 h-4 text-accent stroke-[1.5]" />
            <span>11 Enterprise Workspaces</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Consolidated navigation architecture modeled after SAP S/4HANA Fiori Launchpad and AWS Management Console, providing role-isolated workflows with $\le 8$ apps per workspace.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-container p-5 space-y-2">
          <div className="flex items-center gap-2 text-text font-semibold text-sm">
            <Lock className="w-4 h-4 text-accent stroke-[1.5]" />
            <span>Cryptographic Audit Trail</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every critical action across life-safety, consent, and user provisioning is recorded in an immutable, in-browser SHA-256 chained audit ledger ensuring provable tamper-evidence.
          </p>
        </div>
      </div>

      {/* CSR Funder Showcase & Demo Capabilities */}
      <div className="bg-surface border border-border rounded-container p-6 space-y-3">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent stroke-[1.5]" />
          <span>CSR Funder Demonstration Scenarios (S1–S6)</span>
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          The prototype includes a deterministic Scenario Engine and Ambient Operations Simulator designed specifically for corporate social responsibility (CSR) committee evaluations. Access the Demo Director anytime using <strong>Ctrl+Shift+D</strong> or the top banner button.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-control bg-surface-subtle border border-border space-y-1">
            <div className="font-semibold text-text">S1 & S2: Operations</div>
            <div className="text-text-secondary">Normal weekday rhythms across 9 hubs & monsoon heatwave broadcast with triage surge.</div>
          </div>
          <div className="p-3 rounded-control bg-surface-subtle border border-border space-y-1">
            <div className="font-semibold text-text">S3 & S4: Field & Life-Safety</div>
            <div className="text-text-secondary">Emergency SOS triage with 24h review & offline field terminal registration with deduplication.</div>
          </div>
          <div className="p-3 rounded-control bg-surface-subtle border border-border space-y-1">
            <div className="font-semibold text-text">S5 & S6: Governance & Audit</div>
            <div className="text-text-secondary">Quiet-hours delivery compliance & CSR impact pack generation with public verification at /verify.</div>
          </div>
        </div>
      </div>

      {/* Build & Technical Details */}
      <div className="bg-surface border border-border rounded-container p-6 space-y-3">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent stroke-[1.5]" />
          <span>System Information</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-text-secondary">Release Cycle</div>
            <div className="font-semibold text-text mt-0.5">Pass v4 (Real Workflows)</div>
          </div>
          <div>
            <div className="text-text-secondary">Environment</div>
            <div className="font-semibold text-text mt-0.5">Production Prototype</div>
          </div>
          <div>
            <div className="text-text-secondary">Design System</div>
            <div className="font-semibold text-text mt-0.5">Fiori Horizon + Cloudscape</div>
          </div>
          <div>
            <div className="text-text-secondary">Status</div>
            <div className="text-positive font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
