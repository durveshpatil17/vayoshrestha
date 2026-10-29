import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { ROLES, RoleCode, CapabilityCode, PERMISSION_MATRIX } from '@/permissions/matrix';
import { ShieldCheck, ShieldAlert, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

export const RolesMatrixPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeRole, setActiveRole] = useState<RoleCode>('CM');
  const [requestSent, setRequestSent] = useState(false);

  const capabilitiesList = Object.keys(PERMISSION_MATRIX) as CapabilityCode[];

  const handleRequestMatrixChange = () => {
    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Admin',
      'SA',
      'UPDATE',
      'SETTINGS',
      activeRole,
      `Requested role permission matrix update for ${activeRole}. Forwarded to NM for approval.`,
      'Matrix policy update',
      { role: activeRole },
      undefined
    );

    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Role & Permission Matrix Governance"
        description="Formal capability allocation across 10 institutional roles and 31 system capabilities (FR-50)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Roles Matrix' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleRequestMatrixChange}>
            Request Matrix Modification (NM Approval Required)
          </Button>
        }
      />

      {requestSent && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Matrix modification request lodged in the Maker-Checker Approvals Queue for Executive Director review.</span>
        </div>
      )}

      {/* Mandatory Separation of Duty Guardrail */}
      <div className="p-4 bg-bg-subtle border border-border-hairline rounded text-xs text-text-muted flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Institutional Separation of Duties (FR-50):</strong> Under no circumstances can
          System Administrators (SA) grant themselves clinical permissions, nor can any single user unilaterally alter the matrix without
          independent secondary approval from NGO Management (NM). Maker ≠ Checker enforced.
        </div>
      </div>

      {/* Role Picker Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ROLES).map(([code, def]) => (
          <button
            key={code}
            onClick={() => setActiveRole(code as RoleCode)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeRole === code
                ? 'bg-accent text-white '
                : 'bg-bg-base border border-border-hairline text-text-muted hover:text-text-primary'
            }`}
          >
            {code} — {def.name}
          </button>
        ))}
      </div>

      {/* Active Role Capabilities Grid */}
      <div className="bg-bg-base border border-border-hairline rounded p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-hairline pb-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Capabilities for {ROLES[activeRole].name} ({activeRole})
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Scope of Access: <strong>{ROLES[activeRole].scopeDescription}</strong> • {ROLES[activeRole].description}
            </p>
          </div>
          <span className="tabular-nums text-xs text-text-muted">{capabilitiesList.length} Total Capabilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilitiesList.map((capKey) => {
            const rule = PERMISSION_MATRIX[capKey][activeRole];
            const hasAccess = rule.actions.length > 0;

            return (
              <div
                key={capKey}
                className={`p-3 rounded border text-xs space-y-1.5 ${
                  hasAccess
                    ? 'border-border-hairline bg-bg-base'
                    : 'border-border-hairline/50 bg-bg-subtle/60 text-text-muted/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-text-primary tabular-nums text-xs">{capKey}</span>
                  {hasAccess ? (
                    <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-xs">
                      {rule.actions.join(', ')}
                    </span>
                  ) : (
                    <span className="text-text-muted text-xs">—</span>
                  )}
                </div>

                {hasAccess && (
                  <div className="text-xs text-text-muted flex items-center justify-between pt-1 border-t border-border-hairline/60">
                    <span>Scope: <strong>{rule.scope}</strong></span>
                    {rule.maskedFields && rule.maskedFields.length > 0 && <span className="text-amber-800 font-semibold">Masked Fields</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
