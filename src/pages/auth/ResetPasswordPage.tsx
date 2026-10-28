import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Check, X as Cross, AlertTriangle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const isTokenExpired = token === 'expired-token';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password Policy Checks (min 10 chars, , lowercase, digit, symbol)
  const hasMinLength = newPassword.length >= 10;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

  const criteriaMet = [hasMinLength, hasUpperCase, hasLowerCase, hasDigit, hasSymbol].filter(Boolean).length;
  const strengthLabel = criteriaMet <= 2 ? 'Weak' : criteriaMet <= 4 ? 'Moderate' : 'Strong';
  const strengthColor = criteriaMet <= 2 ? 'bg-danger' : criteriaMet <= 4 ? 'bg-warning' : 'bg-success';

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (criteriaMet < 4) {
      setError('Please choose a stronger password meeting the security criteria.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  if (isTokenExpired) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-bg-base border border-danger/30 rounded p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-danger-bg text-danger flex items-center justify-center mx-auto mb-4 border border-danger/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              Password Reset Link Expired
            </h2>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              This password reset link is invalid or has expired for your protection (15-minute maximum lifetime).
            </p>
            <Button variant="primary" size="md" className="w-full" onClick={() => navigate('/forgot-password')}>
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-[26px] bg-bg-subtle border-b border-border-hairline text-text-muted text-[11px] font-medium flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Set New Password</span>
        <Link to="/login" className="text-accent hover:underline">
          Cancel & Return to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-bg-base border border-border-strong rounded p-8 text-left">
          <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center mb-4 border border-accent/20">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Set New Password
          </h2>
          <p className="text-xs text-text-muted mb-6">
            Create a secure password complying with the Vayoh Vikas organizational access policy.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-danger-bg text-danger text-xs rounded border border-danger/30 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-success-bg text-success text-xs rounded border border-success/30">
              Password successfully updated! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(null);
              }}
              required
              autoFocus
            />

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="space-y-2 p-3 bg-bg-subtle rounded border border-border-hairline">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Password Strength:</span>
                  <span className="font-semibold text-text-primary">{strengthLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-border-hairline rounded-full overflow-hidden flex">
                  <div
                    className={`h-full ${strengthColor} transition-all duration-300`}
                    style={{ width: `${(criteriaMet / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-success' : 'text-text-muted'}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : <Cross className="w-3 h-3" />} Min 10 characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasUpperCase ? 'text-success' : 'text-text-muted'}`}>
                    {hasUpperCase ? <Check className="w-3 h-3" /> : <Cross className="w-3 h-3" />} Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${hasLowerCase ? 'text-success' : 'text-text-muted'}`}>
                    {hasLowerCase ? <Check className="w-3 h-3" /> : <Cross className="w-3 h-3" />} Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${hasDigit ? 'text-success' : 'text-text-muted'}`}>
                    {hasDigit ? <Check className="w-3 h-3" /> : <Cross className="w-3 h-3" />} Number digit
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full mt-4">
              Update Password & Continue
            </Button>
          </form>
        </div>
      </div>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
