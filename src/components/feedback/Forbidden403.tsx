import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export interface Forbidden403Props {
  missingPermission?: string;
  requiredRole?: string;
  currentRole?: string;
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-warning-bg flex items-center justify-center text-warning mb-5 border border-warning/30">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <span className="text-xs font-semibold tracking-wider uppercase text-text-muted mb-1">
        Access Denied · HTTP 403
      </span>
      <h1 className="font-serif text-2xl font-semibold text-text-primary mb-3">
        Restricted Eldercare Capability
      </h1>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">
        Your current active persona (<strong>{effectiveRole}</strong>) is not authorized to view this resource.
        This screen requires capability <code className="bg-bg-subtle px-1.5 py-0.5 rounded text-xs border border-border-hairline">{missingPermission}</code>
        {requiredRole && <> or role <strong>{requiredRole}</strong></>}.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
