import React from 'react';
import { useAuthStore } from '@/store/authStore';

export const Ribbon: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      aria-label="Prototype environment notice"
      className="h-[26px] bg-surface-subtle border-b border-border text-text-secondary text-xs flex items-center justify-between px-6 select-none shrink-0"
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-chip bg-accent" />
        <span>Vayoshreshtha Prototype · Synthetic data only · Vayoh Vikas NGO Pilot</span>
      </div>
      <div className="flex items-center gap-3">
        <span>Active Persona: <strong className="text-text font-semibold">{user?.fullName} ({user?.role})</strong></span>
        <span className="text-border-strong">|</span>
        <span className="tabular-nums">Pilot Day 42 of 90</span>
      </div>
    </aside>
  );
};
