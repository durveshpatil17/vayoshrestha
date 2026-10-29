import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Users,
  MapPin,
  CheckCircle,
  Clock,
  Shield,
  UserX,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Lock,
} from 'lucide-react';

export const FieldAssociateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState('HUB-PUN');
  const [isCertified, setIsCertified] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Deactivation Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('Relocation');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deactivateSuccess, setDeactivateSuccess] = useState(false);

  const handleDeactivate = () => {
    if (confirmPhrase.trim() !== 'CONFIRM DEACTIVATE') return;
    setIsActive(false);
    setShowDeactivateModal(false);
    setDeactivateSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Back breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <button
          type="button"
          onClick={() => navigate('/field-network/associates')}
          className="hover:text-accent flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Associates Roster</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="p-6 bg-bg-surface border border-border rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-xl">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-text-primary">Ramakant Shinde</h1>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-positive-tint text-positive'
                    : 'bg-critical-tint text-critical'
                }`}
              >
                {isActive ? 'Active Associate' : 'Deactivated'}
              </span>
            </div>
            <div className="text-xs text-text-muted flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Pune Ekta Hub (Shivajinagar)
              </span>
              <span>·</span>
              <span className="tabular-nums">+91 98220 99001</span>
              <span>·</span>
              <span>Joined 12 Aug 2026</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Button
              variant="secondary"
              size="md"
              className="text-critical border-critical/30 hover:bg-critical-tint/30"
              icon={<UserX className="w-4 h-4" />}
              onClick={() => setShowDeactivateModal(true)}
            >
              Deactivate Associate
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsActive(true)}
            >
              Reactivate Account
            </Button>
          )}
        </div>
      </div>

      {deactivateSuccess && (
        <div className="p-4 bg-critical-tint/50 border border-critical/30 rounded-xl text-xs text-critical flex items-center justify-between">
          <span>Associate account deactivated and access revoked. Audit entry committed.</span>
          <button
            type="button"
            onClick={() => setDeactivateSuccess(false)}
            className="font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Peers Onboarded</div>
          <div className="text-2xl font-semibold text-accent tabular-nums mt-1">14</div>
          <div className="text-[11px] text-text-muted mt-0.5">Double consent verified</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Total Activity Logs</div>
          <div className="text-2xl font-semibold text-text-primary tabular-nums mt-1">48</div>
          <div className="text-[11px] text-text-muted mt-0.5">Visits and check-ins</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Training Status</div>
          <div className="text-base font-semibold text-positive flex items-center gap-1.5 mt-2">
            <CheckCircle className="w-4 h-4" />
            {isCertified ? 'DPDP Certified' : 'Pending Modules'}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Modules 1 &amp; 2 completed</div>
        </div>

        <div className="p-4 bg-bg-surface border border-border rounded-xl">
          <div className="text-xs font-medium text-text-muted">Last Synchronization</div>
          <div className="text-sm font-semibold text-text-primary tabular-nums mt-2">
            12 min ago
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">Median latency: 24 min</div>
        </div>
      </div>

      {/* Configuration & Assignment Settings */}
      <div className="p-5 bg-bg-surface border border-border rounded-xl space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">
          Operational Assignment &amp; Certification Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              Assigned Ekta Hub Chapter
            </label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs focus:border-accent"
            >
              <option value="HUB-PUN">Pune Ekta Hub (Shivajinagar)</option>
              <option value="HUB-NSK">Nashik Ekta Hub (Gangapur)</option>
              <option value="HUB-NAG">Nagpur Ekta Hub (Dharampeth)</option>
              <option value="HUB-BLR">Bengaluru Ekta Hub (Malleshwaram)</option>
            </select>
            <p className="text-[11px] text-text-muted mt-1">
              Limits peer association and task dispatch to this chapter geofence.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              Certification Override (Programme Manager)
            </label>
            <button
              type="button"
              onClick={() => setIsCertified(!isCertified)}
              className={`w-full h-10 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                isCertified
                  ? 'border-positive/40 bg-positive-tint/40 text-positive'
                  : 'border-critical/40 bg-critical-tint/40 text-critical'
              }`}
            >
              <span>{isCertified ? 'Certified: DPDP & Ethics Trained' : 'Needs Refresher / Retraining'}</span>
              <span className="text-[11px] underline">Toggle Status</span>
            </button>
            <p className="text-[11px] text-text-muted mt-1">
              Certified associates are authorized to capture Consent 1 in the field.
            </p>
          </div>
        </div>
      </div>

      {/* Deactivation Modal Safeguard */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-critical font-semibold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Deactivate Associate Account</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Deactivating this associate will immediately revoke their mobile access to the Field Terminal (<code className="text-text-primary">/field</code>). All queued and synced peer records will be preserved in the audit log.
            </p>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Deactivation Reason *
              </label>
              <select
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-bg-surface text-text-primary text-xs"
              >
                <option value="Relocation">Relocation / Moved out of Hub area</option>
                <option value="Voluntary Resignation">Voluntary Resignation / Personal</option>
                <option value="Health Constraints">Health Constraints / Elder Care</option>
                <option value="Policy Violation">Policy or Ethics Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Type <strong className="text-critical">CONFIRM DEACTIVATE</strong> to proceed:
              </label>
              <Input
                placeholder="CONFIRM DEACTIVATE"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="bg-critical hover:bg-critical/90 text-white"
                disabled={confirmPhrase.trim() !== 'CONFIRM DEACTIVATE'}
                onClick={handleDeactivate}
              >
                Confirm Deactivation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
