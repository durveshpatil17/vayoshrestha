import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-7 bg-bg-subtle border-b border-border-hairline text-text-muted text-xs flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Password Recovery</span>
        <Link to="/login" className="text-accent hover:underline">
          Back to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-bg-base border border-border-strong rounded p-8 text-left">
          <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center mb-4 border border-accent/20">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Reset Account Password
          </h2>

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 bg-success-bg border border-success/30 rounded text-success text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  If an active account exists for <strong>{email}</strong>, a secure password reset link has been dispatched. For security reasons, we do not confirm whether an email address is registered.
                </div>
              </div>
              <p className="text-xs text-text-muted">
                For prototype evaluation purposes, you can jump directly to the reset password screen with a simulated token:
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/reset-password/simulated-valid-token')}
                >
                  Simulate Password Reset Link
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Enter your registered official email address. A time-limited reset link valid for 15 minutes will be dispatched.
              </p>

              <Input
                label="Official Email Address"
                type="email"
                placeholder="name@vayohvikas.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoFocus
              />

              <Button type="submit" variant="primary" size="md" className="w-full mt-2">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border-hairline text-center">
            <Link
              to="/login"
              className="text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center border-t border-border-hairline text-xs text-text-muted">
        Vayoshreshtha Ecosystem · Vayoh Vikas NGO
      </footer>
    </div>
  );
};
