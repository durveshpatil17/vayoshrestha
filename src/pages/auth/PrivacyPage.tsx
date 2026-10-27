import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-[26px] bg-bg-subtle border-b border-border-hairline text-text-muted text-[11px] font-medium flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Public Privacy & Consent Charter</span>
        <Link to="/login" className="text-accent hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Return to Login
        </Link>
      </div>

      <main className="flex-1 max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-accent-tint text-accent flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Governance & Data Protection
            </span>
            <h1 className="font-serif text-3xl font-semibold text-text-primary tracking-tight">
              Privacy & Consent Notice
            </h1>
          </div>
        </div>

        <div className="text-xs text-text-muted mb-8 pb-4 border-b border-border-hairline flex items-center gap-4">
          <span>Policy Version: <strong className="text-text-primary">v2.1 (October 2026)</strong></span>
          <span>Applicable Entity: <strong className="text-text-primary">Vayoh Vikas NGO</strong></span>
          <span>DPDP Act 2023 Compliant</span>
        </div>

        <div className="space-y-6 text-sm text-text-primary leading-relaxed">
          <section className="p-4 bg-bg-subtle rounded border border-border-hairline">
            <h2 className="font-serif text-base font-semibold mb-2">1. Our Core Commitment to Senior Citizens</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              At Vayoh Vikas, technology exists to support human field delivery, not replace it. We collect only minimal essential information to coordinate community programmes, ensure session safety, and facilitate voluntary health or legal assistance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">2. Data Minimisation Principles</h2>
            <ul className="space-y-2 text-xs text-text-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong>No Aadhaar or Biometric Collection:</strong> We never record Aadhaar numbers, fingerprints, facial scans, or biometric data.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong>No Detailed Medical Histories:</strong> We do not maintain diagnostic medical records. Health requests are strictly routed to empanelled charitable professionals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span><strong>Masked Contact Information:</strong> Field volunteers and partners view masked phone numbers. Unmasking is logged with an audited justification.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">3. Purpose of Processing</h2>
            <p className="text-xs text-text-muted leading-relaxed mb-2">
              We process senior citizen information strictly for:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-text-muted">
              <li>Issuing community membership cards and managing Ekta Hub seating capacity.</li>
              <li>Marking daily attendance and coordinating volunteer follow-up check-ins.</li>
              <li>Sending WhatsApp session reminders, timetable changes, and educational tips (only with recorded consent).</li>
              <li>Connecting seniors with vetted community partners (clinics, physiotherapists, legal aid) upon their express request.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">4. Right to Withdraw Consent & "STOP" Messaging</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Any senior citizen or authorized proxy can withdraw communication consent at any time. Sending the word <strong>STOP</strong> to the Vayoh Vikas WhatsApp channel immediately halts automated messages without affecting community centre access.
            </p>
          </section>

          <section className="p-4 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted">
            <h3 className="font-semibold text-text-primary mb-1">Grievance Officer Contact</h3>
            <p>Adv. Smita Ranade · Data Protection Officer, Vayoh Vikas NGO</p>
            <p>Email: <span className="font-mono text-text-primary">grievance@vayohvikas.org</span> · Phone: +91 98220 00100</p>
          </section>
        </div>
      </main>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
