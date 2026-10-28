import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RoleCode, ROLES } from '@/permissions/matrix';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Eye, EyeOff, Lock, Phone, Mail, AlertTriangle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithPassword, loginWithOtp, switchPersona } = useAuthStore();

  const [authMode, setAuthMode] = useState<'staff' | 'senior'>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Return-to validation (Enforcement Rule 8: same-origin only)
  const queryParams = new URLSearchParams(location.search);
  const returnToRaw = queryParams.get('returnTo');
  const returnTo = returnToRaw && returnToRaw.startsWith('/') && !returnToRaw.startsWith('//') ? returnToRaw : '/';

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithPassword(email, password);
      setIsLoading(false);

      if (res.success) {
        if (res.requiresMfa) {
          navigate(`/mfa?returnTo=${encodeURIComponent(returnTo)}`);
        } else {
          navigate(returnTo);
        }
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 250);
  };

  const handleSeniorOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    // Proceed to OTP screen with phone parameter
    navigate(`/verify-otp?phone=${encodeURIComponent(phone)}&returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handlePersonaClick = (role: RoleCode) => {
    switchPersona(role);
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      {/* Top Banner Ribbon */}
      <div className="h-[26px] bg-bg-subtle border-b border-border-hairline text-text-muted text-[11px] font-medium flex items-center justify-between px-6">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Vayoshreshtha Prototype · Synthetic Data Only · Vayoh Vikas NGO
        </span>
        <Link to="/privacy" className="text-accent hover:underline">
          Privacy & DPDP Notice
        </Link>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded bg-accent text-white font-semibold text-2xl flex items-center justify-center mx-auto mb-3">
              V
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Vayoshreshtha Ecosystem
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Digital Community Senior-Care Platform · Vayoh Vikas
            </p>
          </div>

          {/* Authentication Box */}
          <div className="bg-bg-base border border-border-strong rounded p-6">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-border-hairline mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('staff');
                  setError(null);
                }}
                className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 -mb-[1px] ${
                  authMode === 'staff'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Staff & Partners
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('senior');
                  setError(null);
                }}
                className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 -mb-[1px] ${
                  authMode === 'senior'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Senior Citizen & Family
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-bg text-danger text-xs rounded border border-danger/30 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tab 1: Staff & Partners Form */}
            {authMode === 'staff' && (
              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="name@vayohvikas.org or partner@domain.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-primary">Password</label>
                    <Link to="/forgot-password" tabIndex={-1} className="text-xs text-accent hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={handleKeyUp}
                      placeholder="Enter account password"
                      className="w-full rounded bg-bg-base border border-border-strong text-text-primary placeholder:text-text-disabled text-sm px-3 py-2 pr-10 focus:outline-none focus:border-accent"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {capsLockActive && (
                    <p className="text-[11px] text-warning mt-1 flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3" /> Caps Lock is ON
                    </p>
                  )}
                  <p className="text-[11px] text-text-muted mt-1 tabular-nums">
                    Demo Staff Password: <span className="font-semibold text-text-primary">Demo@1234</span>
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Sign In to Workspace
                </Button>
              </form>
            )}

            {/* Tab 2: Senior Citizen & Family Form */}
            {authMode === 'senior' && (
              <form onSubmit={handleSeniorOtpSubmit} className="space-y-4">
                <div className="p-3 bg-bg-subtle rounded border border-border-hairline text-xs text-text-muted leading-relaxed">
                  Senior Citizens and authorized family members sign in securely using a 6-digit One-Time Password (OTP) sent to their registered mobile.
                </div>

                <Input
                  label="Registered Mobile Number"
                  type="tel"
                  placeholder="e.g. 9822011223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  helperText="Enter 10-digit mobile number linked to Ekta Hub records"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Request Secure OTP
                </Button>
              </form>
            )}
          </div>

          {/* Prototype Quick Access Switcher Panel */}
          <div className="mt-6 bg-bg-subtle border border-border-hairline rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent" />
                Prototype 1-Click Access Panel (10 Personas)
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-3 leading-normal">
              Click any persona below to simulate authorized role access, scope restrictions, and data masking:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'u-sa-1', role: 'SA', name: 'Rajesh Varma', title: 'System Admin (MFA)' },
                { id: 'u-nm-1', role: 'NM', name: 'Vandana Sharma', title: 'NGO Management' },
                { id: 'u-ra-west', role: 'RA', name: 'Arjun Nambiar', title: 'Reg. Admin (West)' },
                { id: 'u-ra-south', role: 'RA', name: 'Priya Raman', title: 'Reg. Admin (South)' },
                { id: 'u-cm-pun', role: 'CM', name: 'Sunita Patil', title: 'Chap. Mgr (Pune)' },
                { id: 'u-cm-blr', role: 'CM', name: 'Karthik S.', title: 'Chap. Mgr (Bengaluru)' },
                { id: 'u-vf-1', role: 'VF', name: 'Field Volunteer', title: 'Field Volunteer' },
                { id: 'u-ct-1', role: 'CT', name: 'Care Responder', title: 'Care Responder' },
                { id: 'u-cd-1', role: 'CD', name: 'CSR Reviewer', title: 'CSR / Donor (Agg)' },
                { id: 'u-sc-1', role: 'SC', name: 'Senior Citizen', title: 'Senior Simulator' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (p.role === 'SC') {
                      switchPersona(p.role as any);
                      navigate('/simulator');
                    } else {
                      switchPersona(p.role as any);
                      navigate(returnTo);
                    }
                  }}
                  className="text-left px-2.5 py-1.5 rounded bg-bg-base border border-border-hairline hover:border-accent hover:bg-accent-tint/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary text-[11px]">{p.title}</span>
                    <span className="tabular-nums text-[9px] text-accent font-semibold px-1 bg-accent-tint rounded">
                      {p.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted truncate mt-0.5">{p.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Digital Senior-Care Platform · Vayoh Vikas NGO · Indian Eldercare Pilot
      </footer>
    </div>
  );
};
