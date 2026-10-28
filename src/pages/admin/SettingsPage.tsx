import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { mockStore } from '@/mock/store';
import { useAuthStore } from '@/store/authStore';
import { Settings, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { SystemSettings } from '@/api/contracts';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const data = mockStore.getData();

  const [settings, setSettings] = useState<SystemSettings>(data.settings);
  const [saved, setSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
              <span className="text-[11px] text-text-muted mt-1 block">Default: 30 days</span>
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Attendance Lock Window (Hours)</label>
              <input
                type="number"
                value={settings.attendanceLockHours}
                onChange={(e) => setSettings({ ...settings, attendanceLockHours: parseInt(e.target.value, 10) || 24 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
              <span className="text-[11px] text-text-muted mt-1 block">Corrections needed after lock</span>
            </div>

            <div>
              <label className="font-semibold text-text-primary block mb-1">Monthly Message Volume Cap</label>
              <input
                type="number"
                value={settings.whatsappMessageVolumeCap}
                onChange={(e) => setSettings({ ...settings, whatsappMessageVolumeCap: parseInt(e.target.value, 10) || 10000 })}
                className="w-full border border-border-hairline rounded p-2.5 bg-bg-base text-text-primary focus:ring-1 focus:ring-accent tabular-nums"
              />
              <span className="text-[11px] text-text-muted mt-1 block">10,000 monthly pilot limit</span>
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
    </div>
  );
};
