import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldAlert, KeyRound, AlertCircle } from 'lucide-react';

export const MfaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyMfa } = useAuthStore();

  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo') || '/';

  const [totp, setTotp] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRecoveryMode) {
      if (recoveryCode.trim().length < 8) {
        setError('Please enter a valid 8-character recovery code.');
        return;
      }
      navigate(returnTo);
      return;
    }

    const res = verifyMfa(totp);
    if (res.success) {
      navigate(returnTo);
    } else {
      setError(res.error || 'Invalid 6-digit authenticator code. (Demo code: 123456)');
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-7 bg-bg-subtle border-b border-border-hairline text-text-muted text-xs flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Mandatory Two-Factor Authentication</span>
        <Link to="/login" className="text-accent hover:underline">
          Cancel & Return to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-bg-base border border-border-strong rounded p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Administrative and Management personas enforce mandatory multi-factor authentication (MFA). Enter the 6-digit code from your authenticator app.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-danger-bg text-danger text-xs rounded border border-danger/30 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {!isRecoveryMode ? (
              <div>
                <Input
                  label="6-Digit Authenticator Code"
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, ''))}
                  helperText="Mock TOTP: 123456"
                  required
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <Input
                  label="Single-Use Recovery Code"
                  type="text"
                  placeholder="e.g. VAYO-8842-RECV"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  helperText="Enter one of your 8-character emergency backup codes"
                  required
                  autoFocus
                />
              </div>
            )}

            <Button type="submit" variant="primary" size="md" className="w-full mt-4">
              {isRecoveryMode ? 'Verify Recovery Code' : 'Authorize Session'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border-hairline text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRecoveryMode(!isRecoveryMode);
                setError(null);
              }}
              className="text-accent hover:underline font-semibold inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isRecoveryMode ? 'Use Authenticator App instead' : 'Lost device? Use emergency recovery code'}
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
