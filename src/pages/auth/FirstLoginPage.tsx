import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export const FirstLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedCodeOfConduct, setAcceptedCodeOfConduct] = useState(false);
  const [acceptedDpdp, setAcceptedDpdp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptedCodeOfConduct || !acceptedDpdp) {
      setError('You must acknowledge and accept both institutional policies to proceed.');
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between">
      <div className="h-[26px] bg-bg-subtle border-b border-border-hairline text-text-muted text-[11px] font-medium flex items-center justify-between px-6">
        <span>Vayoshreshtha Prototype · Initial Account Activation</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-lg bg-bg-base border border-border-strong rounded p-8 text-left">
          <div className="w-12 h-12 rounded-full bg-accent-tint text-accent flex items-center justify-center mb-4 border border-accent/20">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            First Login · Account Setup
          </h2>
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Welcome to the Vayoshreshtha Digital Eldercare Ecosystem. To protect senior citizen data, you are required to change your initial temporary password and formalize your safeguarding commitments.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-danger-bg text-danger text-xs rounded border border-danger/30 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Create New Personal Password"
              type="password"
              placeholder="Minimum 10 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Safeguarding Policy Acknowledgements */}
            <div className="space-y-3 pt-3 border-t border-border-hairline text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedCodeOfConduct}
                  onChange={(e) => setAcceptedCodeOfConduct(e.target.checked)}
                  className="rounded border-border-strong text-accent focus:ring-accent w-4 h-4 mt-0.5"
                />
                <span className="text-text-primary leading-normal">
                  I agree to adhere to the <strong>Vayoh Vikas Eldercare Code of Conduct</strong>, ensuring respect, dignity, and zero exploitation of senior citizens.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedDpdp}
                  onChange={(e) => setAcceptedDpdp(e.target.checked)}
                  className="rounded border-border-strong text-accent focus:ring-accent w-4 h-4 mt-0.5"
                />
                <span className="text-text-primary leading-normal">
                  I acknowledge my statutory obligations under the <strong>Digital Personal Data Protection (DPDP) Act</strong> to maintain strict confidentiality of senior citizen profiles, contact details, and consent preferences.
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-4">
              Activate Account & Enter Platform
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
