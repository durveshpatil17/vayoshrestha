import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Ribbon: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('vayoshrestha_ribbon_dismissed') === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('vayoshrestha_ribbon_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Prototype environment notice"
      className="bg-informative-tint border-b border-accent/20 px-6 py-1.5 text-xs text-text flex items-center justify-between select-none shrink-0"
    >
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-accent stroke-[1.5] shrink-0" />
        <span className="font-normal text-text">
          Prototype · synthetic data only · Vayoh Vikas NGO pilot
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-text-secondary hidden sm:inline">
          Active persona: <strong className="text-text font-semibold">{user?.fullName} ({user?.role})</strong>
        </span>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="text-text-secondary hover:text-text p-0.5 rounded-control transition-colors"
        >
          <X className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>
    </aside>
  );
};
