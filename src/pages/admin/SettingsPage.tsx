import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Settings, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Sliders, ExternalLink, Rocket } from 'lucide-react';
import { SystemSettings } from '@/api/contracts';
import { TaskService } from '@/services/tasks';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [settings, setSettings] = useState<SystemSettings>(data.settings);
  const [saved, setSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [goLiveStatus, setGoLiveStatus] = useState<'pending' | 'authorized'>('pending');
  const [goLiveFeedback, setGoLiveFeedback] = useState<string | null>(null);

  const handleAuthorizeGoLive = () => {
    setGoLiveStatus('authorized');
    TaskService.completeTask('TASK-P15-001');
    mockStore.writeAudit(
      user?.id || 'u-nm-1',
      (user as any)?.name || user?.fullName || 'Nandita Rao',
      user?.role || 'NM',
      'APPROVE',
      'SETTINGS',
      'HUB-MYS-01',
      'Authorized chapter go-live milestone for Mysore Heritage Hub (HUB-MYS-01). Pilot operational.',
      'Go-live readiness sign-off'
    );
    mockStore.persist();

    setGoLiveFeedback('Chapter go-live authorized. Ekta Hub activated in live operational cluster.');
    setTimeout(() => setGoLiveFeedback(null), 5000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    mockStore.updateData((draft) => {
      draft.settings = settings;
    });

    mockStore.writeAudit(
      user?.id || 'unknown',
      user?.fullName || 'Admin',
      'SA',
      'UPDATE',
      'SETTINGS',
      'settings-global',
      'Updated institutional pilot parameters and feature flags',
      'Administrative configuration change',
      { before: data.settings, after: settings }
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to completely reset all demo data back to the clean deterministic seed? All changes will be wiped.')) {
      mockStore.resetToDefault();
      setSettings(mockStore.getData().settings);
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Institutional System Parameters & Governance"
        description="Configure pilot dates, registration targets, active-member thresholds, feature flags, and demo data state (FR-50)"
        breadcrumb={[
          { label: 'Admin', href: '/admin/settings' },
          { label: 'Settings' },
        ]}
        actions={
          <Button variant="danger" size="sm" onClick={handleResetDemoData}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Reset Demo Seed Data
          </Button>
        }
      />

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters saved and committed to local store.</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo store reset cleanly. Reloading environment...</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Pilot Parameters */}
        <div className="bg-bg-base border border-border-hairline rounded p-6 space-y-4">
          <h3 className="text-base font-semibold text-text-primary">1. Pilot Scope & Targets (FR-50)</h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-text-primary block mb-1">Organisation Name</label>
              <input
                type="text"
                value={settings.organisationName}
                onChange={(e) => setSettings({ ...settings, organisationName: e.target.value })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Pilot Senior Registration Target</label>
              <input
                type="number"
                value={settings.pilotRegistrationTarget}
                onChange={(e) => setSettings({ ...settings, pilotRegistrationTarget: parseInt(e.target.value, 10) || 1000 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Pilot Start Date</label>
              <input
                type="date"
                value={settings.pilotStartDate}
                onChange={(e) => setSettings({ ...settings, pilotStartDate: e.target.value })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Pilot End Date (90 Days)</label>
              <input
                type="date"
                value={settings.pilotEndDate}
                onChange={(e) => setSettings({ ...settings, pilotEndDate: e.target.value })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Operating Window Configurations */}
        <div className="bg-bg-base border border-border-hairline rounded p-6 space-y-4">
          <h3 className="text-base font-semibold text-text-primary">2. Canonical Window Thresholds</h3>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-text-primary block mb-1">Active Member Window (Days)</label>
              <input
                type="number"
                value={settings.activeMemberWindowDays}
                onChange={(e) => setSettings({ ...settings, activeMemberWindowDays: parseInt(e.target.value, 10) || 30 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
              <span className="text-xs text-text-muted mt-1 block">Default: 30 days</span>
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Attendance Lock Window (Hours)</label>
              <input
                type="number"
                value={settings.attendanceLockHours}
                onChange={(e) => setSettings({ ...settings, attendanceLockHours: parseInt(e.target.value, 10) || 24 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
              <span className="text-xs text-text-muted mt-1 block">Corrections needed after lock</span>
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Monthly Message Volume Cap</label>
              <input
                type="number"
                value={settings.whatsappMessageVolumeCap}
                onChange={(e) => setSettings({ ...settings, whatsappMessageVolumeCap: parseInt(e.target.value, 10) || 10000 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
              <span className="text-xs text-text-muted mt-1 block">10,000 monthly pilot limit</span>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-bg-base border border-border-hairline rounded p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-hairline pb-2">
            <h3 className="text-base font-semibold text-text-primary">3. Post-Pilot Feature Flags</h3>
            <span className="text-xs text-text-muted">Gated for pilot stability</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.featureFlags.voiceCheckins}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    featureFlags: { ...settings.featureFlags, voiceCheckins: e.target.checked },
                  })
                }
                className="mt-0.5 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-semibold text-text-primary">Automated Voice Check-Ins (FR-41)</div>
                <div className="text-text-muted">Simulates scheduled outbound IVR calls to isolated seniors.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.featureFlags.familyAccess}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    featureFlags: { ...settings.featureFlags, familyAccess: e.target.checked },
                  })
                }
                className="mt-0.5 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-semibold text-text-primary">Family Member Portal (Group O)</div>
                <div className="text-text-muted">Allows authorized adult children to view bookings with recorded consent.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.featureFlags.advancedReferrals}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    featureFlags: { ...settings.featureFlags, advancedReferrals: e.target.checked },
                  })
                }
                className="mt-0.5 rounded text-accent focus:ring-accent"
              />
              <div>
                <div className="font-semibold text-text-primary">Advanced Service Partner Triage (FR-34)</div>
                <div className="text-text-muted">Direct partner appointment booking and shared records panel.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="sm">
            Save System Settings
          </Button>
        </div>
      </form>

      {/* Process P15: Real-time Pilot Readiness Checklist & Chapter Go-Live Milestone Authorization */}
      <div className="bg-surface border border-border rounded-container p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text flex items-center gap-2">
              <Rocket className="w-4 h-4 text-accent stroke-[1.5]" />
              Chapter Go-Live Readiness Checklist (Process P15)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Automated operational readiness evaluation across staff, emergency routing, and statutory privacy controls.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-secondary block">Readiness score</span>
            <span className="text-lg font-semibold text-positive tabular-nums">100% (5/5 gates passed)</span>
          </div>
        </div>

        {goLiveFeedback && (
          <div className="p-3 bg-positive-tint text-positive border border-positive/30 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
            <span>{goLiveFeedback}</span>
          </div>
        )}

        <div className="divide-y divide-border-subtle text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5] shrink-0" />
              <div>
                <span className="font-semibold text-text block">1. Chapter Localities & Hub Profiles</span>
                <span className="text-text-secondary">3 model hubs active (Pune, Nashik, Bengaluru); geographic boundaries defined.</span>
              </div>
            </div>
            <Link to="/admin/chapters" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Verify chapters <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5] shrink-0" />
              <div>
                <span className="font-semibold text-text block">2. Chapter Staff Roster Allocation</span>
                <span className="text-text-secondary">All required roles (CM, VF, CT, RA) staffed with assigned credentials.</span>
              </div>
            </div>
            <Link to="/admin/chapters" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Review roster <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5] shrink-0" />
              <div>
                <span className="font-semibold text-text block">3. Emergency SOS Dispatch & Telephony Fallback</span>
                <span className="text-text-secondary">Automated WhatsApp interactive buttons + SMS fallback latency &lt;1.5s.</span>
              </div>
            </div>
            <Link to="/sos" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Test SOS routing <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5] shrink-0" />
              <div>
                <span className="font-semibold text-text block">4. Deterministic Service Partner Network</span>
                <span className="text-text-secondary">Accredited diagnostic labs, clinics, and subsidized grocery partners active.</span>
              </div>
            </div>
            <Link to="/partners" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Inspect partners <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-positive stroke-[1.5] shrink-0" />
              <div>
                <span className="font-semibold text-text block">5. DPDP Consent & Cryptographic Audit Hash Chain</span>
                <span className="text-text-secondary">Double consent machine online; SHA-256 genesis block validated.</span>
              </div>
            </div>
            <Link to="/admin/data-governance" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Audit governance <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Milestone approval authority: <strong>NGO Management (NM)</strong>
          </span>
          {goLiveStatus === 'authorized' ? (
            <span className="text-xs font-semibold text-positive flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
              Go-live authorized: Pilot chapter active
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAuthorizeGoLive}
              icon={<Rocket className="w-4 h-4" />}
            >
              Authorize chapter go-live
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
