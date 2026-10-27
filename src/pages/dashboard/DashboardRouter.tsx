import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { NmPmDashboard } from './NmPmDashboard';
import { SaDashboard } from './SaDashboard';
import { CcDashboard } from './CcDashboard';
import { VfDashboard } from './VfDashboard';
import { SpDashboard } from './SpDashboard';
import { CtDashboard } from './CtDashboard';
import { CdDashboard } from './CdDashboard';
import { ScDashboard } from './ScDashboard';
import { FmDashboard } from './FmDashboard';

export const DashboardRouter: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  switch (user.role) {
    case 'SA':
      return <SaDashboard />;
    case 'NM':
    case 'PM':
      return <NmPmDashboard />;
    case 'CC':
      return <CcDashboard />;
    case 'VF':
      return <VfDashboard />;
    case 'SP':
      return <SpDashboard />;
    case 'CT':
      return <CtDashboard />;
    case 'CD':
      return <CdDashboard />;
    case 'SC':
      return <ScDashboard />;
    case 'FM':
      return <FmDashboard />;
    default:
      return <NmPmDashboard />;
  }
};
