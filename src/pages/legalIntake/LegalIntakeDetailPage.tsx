import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lock,
  Unlock,
  Building2,
  User,
  FileCheck2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  getLegalCaseById,
  closeLegalCase,
  LEGAL_DISCLAIMER_NOTICE,
  CLOSURE_CODE_LABELS,
  LegalIntakeRecord,
  LegalClosureCode,
} from '@/domain/legal/legalIntake';
import { useAuthStore } from '@/store/authStore';

export const LegalIntakeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [legalCase, setLegalCase] = useState<LegalIntakeRecord | undefined>(() =>
    id ? getLegalCaseById(id) : undefined
  );

  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [selectedClosureCode, setSelectedClosureCode] = useState<LegalClosureCode>('declined_age_bar');
  const [isClosing, setIsClosing] = useState<boolean>(false);

  if (!legalCase) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl  font-semibold text-text">Legal Case Not Found</h2>
        <p className="text-sm text-text-secondary">The requested legal aid intake record does not exist.</p>
        <Link
          to="/legal-intake"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Legal Intake
        </Link>
      </div>
    );
  }

  const handleCloseCase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClosing(true);
    try {
      const updated = closeLegalCase(legalCase.id, selectedClosureCode);
      setLegalCase({ ...updated });
    } finally {
      setIsClosing(false);
    }
  };

  const isAdvocateOrManager =
    user?.role === 'SP' || user?.role === 'PM' || user?.role === 'NM' || user?.role === 'SA';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Legal Case: ${legalCase.id}`}
        subtitle={`${legalCase.category.replace('_', ' ')} · Senior: ${legalCase.seniorName}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Legal Intake', href: '/legal-intake' },
          { label: legalCase.id },
        ]}
      />

      {/* Statutory Disclaimer Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Statutory Disclaimer & Scope:</span>
          {LEGAL_DISCLAIMER_NOTICE}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Information & Confidential Narrative */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Intake Case Metadata
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Senior Citizen</div>
                <div className="font-semibold text-text">{legalCase.seniorName}</div>
                <div className="text-text-secondary">{legalCase.region.toUpperCase()} Chapter</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Category</div>
                <div className="font-semibold text-accent ">
                  {legalCase.category.replace('_', ' ')}
                </div>
                <div className="text-text-secondary">Civil Pro-Bono</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Assigned Advocate</div>
                <div className="font-semibold text-text">{legalCase.assignedAdvocateName}</div>
                <div className="text-text-secondary">{legalCase.partnerFirm}</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Case Status</div>
                <div className="font-semibold text-text ">
                  {legalCase.status.replace('_', ' ')}
                </div>
                <div className="text-text-secondary">
                  Filed: {new Date(legalCase.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Confidential Client Narrative (Partner Isolation) */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  Confidential Client Narrative & Dispute Evidence
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Protected under advocate-client privilege. Field staff see metadata only.
                </p>
              </div>

              {isAdvocateOrManager && (
                <button
                  type="button"
                  onClick={() => setIsDecrypted(!isDecrypted)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-text-secondary hover:bg-page flex items-center gap-1.5"
                >
                  {isDecrypted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-accent" />}
                  {isDecrypted ? 'Hide Narrative' : 'Decrypt with Partner Key'}
                </button>
              )}
            </div>

            {isDecrypted ? (
              <div className="p-4 bg-emerald-50/30 border border-accent/30 rounded-lg space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-text-secondary">Confidential Grievance Statement:</span>
                  <p className="text-text mt-1 leading-relaxed">{legalCase.confidentialNarrative}</p>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="font-semibold text-text-secondary">Contested Parties / Respondents:</span>
                  <div className="text-text font-semibold mt-0.5">{legalCase.contestedParties}</div>
                </div>

                {legalCase.policyExclusionDetails && (
                  <div className="pt-2 border-t border-border">
                    <span className="font-semibold text-text-secondary">Policy Evidence Detail:</span>
                    <div className="text-text mt-0.5">{legalCase.policyExclusionDetails}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 bg-page border border-border rounded-lg text-center space-y-2">
                <Lock className="w-5 h-5 text-text-secondary mx-auto" />
                <div className="text-xs font-semibold text-text">
                  Confidential Content Blinded
                </div>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  Only the assigned legal partner advocate or authorized manager can decrypt the full dispute
                  narrative and respondent identity.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Policy Evidence Closure */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-accent" />
              Policy Evidence & Closure
            </h3>

            {legalCase.status === 'closed' ? (
              <div className="p-4 bg-emerald-50 border border-accent/20 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-accent">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Case Closed & Logged</span>
                </div>
                <div>
                  <span className="text-text-secondary">Standardized Outcome Code:</span>
                  <div className="font-semibold text-text mt-1">
                    {legalCase.closureCode ? CLOSURE_CODE_LABELS[legalCase.closureCode] : 'Completed'}
                  </div>
                </div>
                <div className="text-text-secondary pt-1">
                  Closed on: {legalCase.closedAt ? new Date(legalCase.closedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCloseCase} className="space-y-3 text-xs">
                <p className="text-text-secondary">
                  When closing this inquiry, tag the resolution with a policy evidence code to feed into the
                  Insurance and Elder Protection Dossiers.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-text-secondary">Select Closure Outcome Code:</label>
                  <select
                    value={selectedClosureCode}
                    onChange={(e) => setSelectedClosureCode(e.target.value as LegalClosureCode)}
                    className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none"
                  >
                    <option value="declined_age_bar">Declined: Age-bar exclusion</option>
                    <option value="declined_no_cover">Declined: No cover available</option>
                    <option value="settled_maintenance_act">Settled via Senior Citizens Act 2007</option>
                    <option value="mediated_community_settlement">Settled via Ekta Hub community mediation</option>
                    <option value="pension_claim_sanctioned">EPFO / Pension grievance sanctioned</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isClosing}
                  className="w-full py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isClosing ? 'Recording...' : 'Close Case & Log Policy Evidence'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
