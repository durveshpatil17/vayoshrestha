import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, RotateCcw, AlertCircle } from 'lucide-react';

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOtp } = useAuthStore();

  const queryParams = new URLSearchParams(location.search);
  const phone = queryParams.get('phone') || '9822011223';
  const returnTo = queryParams.get('returnTo') || '/';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-focus next box
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    const res = loginWithOtp(phone, fullOtp);
    if (res.success) {
      navigate(returnTo);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setError('Maximum OTP verification attempts exceeded. Please try again after 15 minutes.');
      } else {
        setError(`Invalid OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining. (Mock OTP: 123456)`);
      }
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-[26px] bg-bg-subtle border-b border-border-hairline text-text-muted text-[11px] font-medium flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Senior Authentication</span>
        <Link to="/login" className="text-accent hover:underline">
          Back to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-bg-base border border-border-strong rounded p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl font-semibold text-text-primary tracking-tight mb-2">
            Verify One-Time Password
          </h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            A 6-digit verification code has been dispatched via SMS to{' '}
            <strong className="text-text-primary font-mono">{phone}</strong>.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-danger-bg text-danger text-xs rounded border border-danger/30 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={attemptsLeft <= 0}
                  className="w-11 h-12 text-center text-lg font-bold font-mono border border-border-strong rounded bg-bg-base text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:bg-bg-subtle"
                />
              ))}
            </div>

            <p className="text-xs text-text-muted font-mono">
              Demo Valid OTP: <span className="font-bold text-text-primary">123456</span>
            </p>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={attemptsLeft <= 0 || otp.join('').length < 6}
            >
              Verify & Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted">
            <span>Didn't receive the code?</span>
            {resendTimer > 0 ? (
              <span className="font-mono text-text-disabled">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-accent font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
