import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuthStore } from '@/store/authStore';
import { ROLES } from '@/permissions/matrix';
import { Shield, KeyRound, Smartphone, Globe, Laptop, CheckCircle2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, textSize, setTextSize } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions' | 'preferences'>('profile');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <PageHeader
        title="My Account & Security"
        description="Manage your profile information, multi-factor credentials, active sessions, and display preferences."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]}
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-border-hairline mb-6 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 border-b-2 -mb-[1px] ${
            activeTab === 'profile' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 border-b-2 -mb-[1px] ${
            activeTab === 'security' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Password & MFA
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-2.5 border-b-2 -mb-[1px] ${
            activeTab === 'sessions' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Active Sessions
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-2.5 border-b-2 -mb-[1px] ${
            activeTab === 'preferences' ? 'border-accent text-accent font-semibold' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Display & Preferences
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-bg-base border border-border-hairline rounded p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border-hairline">
            <div className="w-14 h-14 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center font-serif text-xl font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">{user?.fullName}</h3>
              <p className="text-xs text-text-muted">{user?.email || user?.phone}</p>
              <span className="inline-block mt-1 text-[11px] font-mono text-accent bg-accent-tint px-2 py-0.5 rounded font-semibold">
                {user?.role} · {ROLES[user?.role || 'SA']?.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-muted block mb-0.5">Assigned Ekta Hubs</span>
              <span className="font-semibold text-text-primary">
                {user?.assignedCentres && user.assignedCentres.length > 0
                  ? user.assignedCentres.join(', ')
                  : 'All Organisation Hubs (HQ)'}
              </span>
            </div>
            <div>
              <span className="text-text-muted block mb-0.5">Account Status</span>
              <span className="text-success font-semibold">Active & Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & MFA */}
      {activeTab === 'security' && (
        <div className="max-w-xl space-y-6">
          {/* Password Change Form */}
          <div className="bg-bg-base border border-border-hairline rounded p-6">
            <h3 className="font-serif text-base font-semibold text-text-primary mb-1">
              Change Password
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Enter your current password and choose a new 10+ character passphrase.
            </p>

            {passwordSaved && (
              <div className="mb-4 p-3 bg-success-bg text-success text-xs rounded border border-success/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password successfully updated.</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="sm" className="mt-2">
                Update Password
              </Button>
            </form>
          </div>

          {/* MFA Status */}
          <div className="bg-bg-base border border-border-hairline rounded p-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-accent" />
                <h3 className="font-serif text-sm font-semibold text-text-primary">
                  Two-Factor Authentication (MFA)
                </h3>
              </div>
              <p className="text-xs text-text-muted max-w-sm">
                Protects your account with an extra verification code from Google Authenticator or Microsoft Authenticator.
              </p>
            </div>
            <StatusChip
              label={user?.mfaEnabled ? 'Enforced & Active' : 'Optional for Role'}
              variant={user?.mfaEnabled ? 'active' : 'neutral'}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="max-w-xl bg-bg-base border border-border-hairline rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base font-semibold text-text-primary">
                Active Devices & Sessions
              </h3>
              <p className="text-xs text-text-muted">Devices currently authenticated to your account.</p>
            </div>
            <Button variant="outline" size="sm">
              Sign Out Other Devices
            </Button>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-bg-subtle rounded border border-border-hairline flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-semibold text-text-primary">Current Web Session (macOS · Chrome)</div>
                  <div className="text-[11px] text-text-muted">Pune, Maharashtra · IP 103.21.124.8 · Active now</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded">
                This Device
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Display & Preferences */}
      {activeTab === 'preferences' && (
        <div className="max-w-xl bg-bg-base border border-border-hairline rounded p-6 space-y-6">
          <div>
            <h3 className="font-serif text-base font-semibold text-text-primary mb-1">
              Accessibility Text Scale
            </h3>
            <p className="text-xs text-text-muted mb-3">
              Enlarge interface font sizes to accommodate comfortable reading for senior staff and elders.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTextSize('normal')}
                className={`flex-1 p-3 rounded border text-xs text-center ${
                  textSize === 'normal' ? 'border-accent bg-accent-tint/30 font-semibold' : 'border-border-hairline hover:bg-bg-subtle'
                }`}
              >
                Standard (14px)
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`flex-1 p-3 rounded border text-sm text-center ${
                  textSize === 'large' ? 'border-accent bg-accent-tint/30 font-semibold' : 'border-border-hairline hover:bg-bg-subtle'
                }`}
              >
                Large (18px)
              </button>
              <button
                onClick={() => setTextSize('xlarge')}
                className={`flex-1 p-3 rounded border text-base text-center ${
                  textSize === 'xlarge' ? 'border-accent bg-accent-tint/30 font-semibold' : 'border-border-hairline hover:bg-bg-subtle'
                }`}
              >
                Extra Large (22px)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border-hairline">
            <h3 className="font-serif text-base font-semibold text-text-primary mb-1">
              Language Preference
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['English', 'Hindi (हिंदी)', 'Marathi (मराठी)', 'Gujarati (ગુજરાતી)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setPreferredLanguage(lang)}
                  className={`p-2 rounded border text-xs text-left ${
                    preferredLanguage === lang ? 'border-accent bg-accent-tint/30 font-semibold text-accent' : 'border-border-hairline hover:bg-bg-subtle text-text-primary'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
