import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-96 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto select-none">
      <ShieldAlert className="w-10 h-10 text-critical stroke-[1.5] mb-3" />
      <span className="text-xs font-semibold text-text-secondary mb-1">
        HTTP 403
      </span>
      <h1 className="text-page-title text-text mb-2">
        You don't have access to this page
      </h1>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Your role <strong className="text-text font-semibold">{effectiveRole}</strong> lacks the required permission:{' '}
        <span className="bg-surface-subtle px-1.5 py-0.5 rounded-chip text-xs border border-border-subtle tabular-nums text-text">
          {missingPermission}
        </span>
        {requiredRole && <> (requires role {requiredRole})</>}.
      </p>
      <div className="flex items-center gap-2">
        <Button variant="default" icon={<ArrowLeft className="w-4 h-4 stroke-[1.5]" />} onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    </div>
  );
};
