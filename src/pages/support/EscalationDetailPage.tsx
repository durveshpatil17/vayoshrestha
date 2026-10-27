import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { calculateSlaStatus } from '@/domain/escalation';
import { AlertOctagon, Clock, ShieldAlert, CheckCircle2, ArrowLeft, User, Phone, FileText } from 'lucide-react';
import { HealthEscalation } from '@/api/contracts';

export const EscalationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const escalation = data.escalations.find((e) => e.id === id);

  const [currentStatus, setCurrentStatus] = useState<HealthEscalation['status']>(
    escalation?.status || 'Open'
  );
  const [resolutionSummary, setResolutionSummary] = useState(escalation?.resolutionSummary || '');
  const [handoverNotes, setHandoverNotes] = useState(escalation?.handoverNotes || '');
  const [assignedExpertId, setAssignedExpertId] = useState(escalation?.assignedExpertId || 'u-ct-1');
  const [saved, setSaved] = useState(false);

  if (!escalation) {
    return (
      <div className="p-8 text-center bg-bg-base border border-border-hairline rounded">
        <h3 className="font-serif text-lg font-semibold text-text-primary">Escalation Case Not Found</h3>
        <Link to="/support/escalations" className="mt-4 inline-block text-accent font-medium">← Back to Queue</Link>
      </div>
    );
  }

  const member = data.seniorCitizens.find((m) => m.id === escalation.memberId);
  const centre = data.centres.find((c) => c.id === escalation.centreId);
  const sla = calculateSlaStatus(escalation.createdAt, escalation.slaHours);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    mockStore.updateData((draft) => {
      const target = draft.escalations.find((e) => e.id === escalation.id);
      if (target) {
        target.status = currentStatus;
        target.resolutionSummary = resolutionSummary;
        target.handoverNotes = handoverNotes;
        target.assignedExpertId = assignedExpertId;
        if (currentStatus === 'Acknowledged' && !target.acknowledgedAt) {
          target.acknowledgedAt = new Date().toISOString();
        }
        if (currentStatus === 'Resolved' && !target.resolvedAt) {
          target.resolvedAt = new Date().toISOString();
        }
      }
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Care Team',
      user?.role || 'CT',
      'UPDATE',
      'HealthEscalation',
      escalation.id,
      `Updated escalation status to ${currentStatus}. Resolution note: ${resolutionSummary || 'In progress'}`,
      { status: escalation.status },
      { status: currentStatus, resolutionSummary, handoverNotes },
      escalation.centreId
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={`Escalation Case ${escalation.id}`}
        description={`${escalation.severity} Severity Distress Intake • ${member?.fullName} (${centre?.name})`}
        breadcrumb={[
          { label: 'Health Support', href: '/support/requests' },
          { label: 'Escalations Queue', href: '/support/escalations' },
          { label: escalation.id },
        ]}
        actions={
          <Link to="/support/escalations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Queue
            </Button>
          </Link>
        }
      />

      {/* Mandatory Non-Clinical Notice */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong>Non-Clinical Boundary Notice:</strong> Antigravity and Vayoshreshtha software never provide medical diagnosis.
          Care Team personnel must verify with the senior or family proxy and engage local primary health centers or emergency medical services as warranted.
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Case timeline updated. Centre coordinator notified of handover disposition.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Case Assessment Left Rail */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif text-base font-semibold text-text-primary">Clinical Triage Intake</h3>
              <StatusChip
                label={escalation.status}
                variant={escalation.status === 'Resolved' ? 'active' : sla.isBreached ? 'danger' : 'warning'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Senior Citizen</span>
                <span className="font-semibold text-text-primary text-sm">{member?.fullName}</span>
                <span className="text-text-muted block mt-0.5">Contact: {member?.phone}</span>
              </div>

              <div>
                <span className="text-text-muted block">Intake Source</span>
                <span className="font-semibold text-text-primary">{escalation.source}</span>
                <span className="text-text-muted block mt-0.5">Centre: {centre?.name}</span>
              </div>

              <div>
                <span className="text-text-muted block">Trigger Keywords Identified</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {escalation.triggerKeywords.map((kw) => (
                    <span key={kw} className="font-mono text-[11px] px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-text-muted block">SLA Commitment ({escalation.slaHours} Hours)</span>
                <span className={`font-semibold text-sm ${sla.isBreached ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {sla.formattedRemaining}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border-hairline">
              <span className="text-xs font-medium text-text-muted block mb-1">Reported Distress Summary:</span>
              <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-primary leading-relaxed">
                {escalation.summary}
              </div>
            </div>
          </div>

          {/* Action / Resolution Form */}
          <form onSubmit={handleUpdate} className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-text-primary">Clinical Specialist Action & Handover</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Lifecycle Status</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as any)}
                  className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="Open">Open (Pending Review)</option>
                  <option value="Acknowledged">Acknowledged (Clinician Contacting)</option>
                  <option value="InProgress">In Progress (Assessment Underway)</option>
                  <option value="Resolved">Resolved / Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">Assign Expert Care Lead</label>
                <select
                  value={assignedExpertId}
                  onChange={(e) => setAssignedExpertId(e.target.value)}
                  className="w-full text-xs border border-border-hairline rounded p-2 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
                >
                  <option value="u-ct-1">Sister Mary Teresa Fernandez (Geriatric Nurse)</option>
                  <option value="u-pm-1">Sunita Menon (Programme Lead)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Handover Instructions to Field Coordinator
              </label>
              <textarea
                rows={3}
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="e.g. Advised local coordinator to have family accompany elder to clinic for physical assessment..."
                className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
              />
            </div>

            {currentStatus === 'Resolved' && (
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">
                  Final Resolution Outcome Summary (FR-42)
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Record definitive clinical handover outcome, family contact status, or referral conclusion..."
                  className="w-full text-xs border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent leading-relaxed"
                />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save & Update Case
              </Button>
            </div>
          </form>
        </div>

        {/* Case Timeline & Audit Stream Right Rail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4 shadow-sm text-xs">
            <h4 className="font-serif text-sm font-semibold text-text-primary border-b border-border-hairline pb-2">
              SLA & Timeline Audit Log
            </h4>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border-hairline">
              <div className="flex items-start gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-rose-300">
                  !
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Distress Trigger Triggered</div>
                  <div className="text-text-muted">{escalation.createdAt.replace('T', ' ').slice(0, 16)}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">Source: {escalation.source}</div>
                </div>
              </div>

              {escalation.acknowledgedAt && (
                <div className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-amber-300">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">Case Acknowledged by Clinician</div>
                    <div className="text-text-muted">{escalation.acknowledgedAt.replace('T', ' ').slice(0, 16)}</div>
                  </div>
                </div>
              )}

              {escalation.resolvedAt && (
                <div className="flex items-start gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 z-10 border border-emerald-300">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Case Resolved & Logged</div>
                    <div className="text-text-muted">{escalation.resolvedAt.replace('T', ' ').slice(0, 16)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
