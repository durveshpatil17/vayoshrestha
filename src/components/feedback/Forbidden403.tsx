import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldDismiss24Regular, ArrowLeft16Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export interface Forbidden403Props {
  missingPermission?: string;
  requiredRole?: string;
  currentRole?: string;
  message?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({
  missingPermission = 'ADMIN_ACCESS',
  requiredRole,
  currentRole,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const effectiveRole = currentRole || user?.role || 'Guest';

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto select-none">
      <div className="w-12 h-12 rounded-full bg-critical-tint border border-critical/30 flex items-center justify-center text-critical mb-4">
        <ShieldDismiss24Regular className="w-6 h-6" />
      </div>
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
        HTTP 403
      </span>
      <h1 className="text-page-title text-text mb-2">
        You don't have access to this page
      </h1>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Your role <strong className="text-text font-semibold">{effectiveRole}</strong> lacks the required permission:{' '}
        <code className="bg-surface-subtle px-1.5 py-0.5 rounded-chip text-xs border border-border-subtle font-mono text-text">
          {missingPermission}
        </code>
        {requiredRole && <> (requires role {requiredRole})</>}.
      </p>
      <div className="flex items-center gap-2">
        <Button variant="default" icon={<ArrowLeft16Regular />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};
