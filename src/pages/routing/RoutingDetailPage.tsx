import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GitMerge,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  HelpCircle,
  RefreshCw,
  Phone,
  User,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  SERVICE_REQUESTS,
  PARTNER_REGISTRY,
  reassignRequest,
  ServiceRoutingRequest,
} from '@/domain/routing/engine';

export const RoutingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRoutingRequest | undefined>(() =>
    SERVICE_REQUESTS.find((r) => r.id === id)
  );

  const [isReassigning, setIsReassigning] = useState<boolean>(false);
  const [selectedNewPartner, setSelectedNewPartner] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('');

  if (!request) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl  font-semibold text-text">Request Not Found</h2>
        <p className="text-sm text-text-secondary">The service routing request does not exist.</p>
        <Link
          to="/routing"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Routing Queue
        </Link>
      </div>
    );
  }

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewPartner || !reassignReason) return;

    const updated = reassignRequest(request.id, selectedNewPartner, reassignReason);
    setRequest({ ...updated });
    setIsReassigning(false);
  };

  const decision = request.decisionRecord;

  // Filter possible alternative partners for same category
  const alternativePartners = PARTNER_REGISTRY.filter(
    (p) => p.category === request.category && p.id !== request.assignedPartnerId
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Routing Decision Record: ${request.id}`}
        subtitle={`Deterministic Assignment Audit for ${request.seniorName} (${request.category.replace('_', ' ')})`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partners', href: '/partners' },
          { label: 'Routing Fabric', href: '/routing' },
          { label: request.id },
        ]}
        actions={
          <button
            onClick={() => setIsReassigning(true)}
            className="px-3.5 py-2 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-emerald-50/50 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Reassign Partner
          </button>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Request Details & Decision Record */}
        <div className="lg:col-span-2 space-y-6">
          {/* Senior & Request Overview */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Service Request Context
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Senior Citizen</div>
                <div className="font-semibold text-text">{request.seniorName}</div>
                <div className="text-text-secondary">{request.seniorPhone}</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Service Domain</div>
                <div className="font-semibold text-accent ">
                  {request.category.replace('_', ' ')}
                </div>
                <div className="text-text-secondary">Assisted referral</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Region & Language</div>
                <div className="font-semibold text-text ">{request.region}</div>
                <div className="text-text-secondary">{request.language}</div>
              </div>

              <div className="p-3 bg-page border border-border rounded-lg space-y-1">
                <div className="text-text-secondary">Current Status</div>
                <div className="font-semibold text-text ">{request.status.replace('_', ' ')}</div>
                <div className="text-text-secondary">{new Date(request.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {request.notes && (
              <div className="p-3 bg-page border border-border rounded-lg text-xs">
                <span className="font-semibold text-text-secondary">Intake Notes: </span>
                <span className="text-text">{request.notes}</span>
              </div>
            )}
          </div>

          {/* Transparent Decision Record */}
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-accent" />
                  Deterministic Engine Audit Trail ("Why this partner")
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Full evaluation matrix of all candidate partners registered in this service domain.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold">
                Strategy: {decision?.strategyUsed || 'least-loaded'}
              </span>
            </div>

            {decision ? (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-page text-text-secondary border-b border-border">
                      <tr>
                        <th className="p-3 font-semibold">Candidate Partner</th>
                        <th className="p-3 font-semibold">Current Active Load</th>
                        <th className="p-3 font-semibold">Capacity Cap</th>
                        <th className="p-3 font-semibold">Eligibility Verdict</th>
                        <th className="p-3 font-semibold">Notes / Disqualification Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {decision.candidatesEvaluated.map((c) => {
                        const isSelected = c.partnerId === decision.selectedPartnerId;
                        return (
                          <tr
                            key={c.partnerId}
                            className={isSelected ? 'bg-emerald-50/40' : undefined}
                          >
                            <td className="p-3 font-semibold text-text">
                              {c.partnerName}
                            </td>
                            <td className="p-3 text-text-secondary">
                              {c.activeLoad} active
                            </td>
                            <td className="p-3 text-text-secondary">
                              {c.maxCapacity} daily
                            </td>
                            <td className="p-3">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 text-accent font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Selected (Optimal)
                                </span>
                              ) : c.eligible ? (
                                <span className="text-text-secondary font-semibold">
                                  Eligible (Higher load)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-negative font-semibold">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Disqualified
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-text-secondary">
                              {isSelected
                                ? 'Least loaded among eligible partners'
                                : c.rejectionReason || 'Tie-break fallback'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-page border border-border rounded-lg flex items-center justify-between text-xs text-text-secondary">
                  <span>Matched Engine Rule: <strong className="text-text">{decision.ruleIdMatched}</strong></span>
                  <span>Evaluated At: <strong className="text-text">{new Date(decision.timestamp).toLocaleString()}</strong></span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-page border border-border rounded-lg text-xs text-text-secondary">
                Legacy request: decision record generated prior to Layer 2 audit trail engine.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assigned Partner Card & SLA Monitor */}
        <div className="space-y-6">
          <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              Assigned Partner
            </h3>

            <div className="p-4 border border-border rounded-lg bg-page space-y-3">
              <div className="font-semibold text-sm text-text">
                {request.assignedPartnerName || 'Unassigned'}
              </div>

              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-text ">{request.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned At:</span>
                  <span className="text-text">{request.assignedAt ? new Date(request.assignedAt).toLocaleDateString() : 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Routing Strategy:</span>
                  <span className="text-text">Deterministic Capacity Load-Balanced</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-accent/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-accent font-semibold text-xs">
                <Clock className="w-4 h-4" />
                <span>Working SLA Window: 24h</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                If the partner does not acknowledge or contact the senior citizen within the SLA window,
                the request is automatically flagged for reassignment to the secondary candidate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Reassignment Modal / Drawer */}
      {isReassigning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-surface border border-border rounded-xl max-w-lg w-full p-6 space-y-4 ">
            <h3 className="text-base  font-semibold text-text">
              Reassign Service Request
            </h3>
            <p className="text-xs text-text-secondary">
              Manually route {request.seniorName}'s request to an alternative verified partner.
              The change will be logged in the immutable audit trail.
            </p>

            <form onSubmit={handleReassign} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text-secondary">Select Alternative Partner:</label>
                <select
                  value={selectedNewPartner}
                  onChange={(e) => setSelectedNewPartner(e.target.value)}
                  required
                  className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none"
                >
                  <option value="">-- Choose verified partner --</option>
                  {alternativePartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.currentActiveAssigned}/{p.dailyMaxCapacity} active)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary">Reason for Manual Reassignment:</label>
                <textarea
                  rows={3}
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  placeholder="e.g. Senior requested specialist at alternative hospital; language preference update..."
                  required
                  className="w-full p-2 bg-page border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReassigning(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-text-secondary hover:bg-page font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
