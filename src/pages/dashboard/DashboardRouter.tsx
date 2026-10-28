import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { RanmDashboard } from './RanmDashboard';
import { CmDashboard } from './CmDashboard';
import { VfDashboard } from './VfDashboard';
import { CtDashboard } from './CtDashboard';
import { SaDashboard } from './SaDashboard';
import { CdDashboard } from './CdDashboard';
import { PmDashboard } from './PmDashboard';
import { SpDashboard } from './SpDashboard';
import { ScPortal } from '../seniors/ScPortal';
import { FmPortal } from '../family/FmPortal';

export const DashboardRouter: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  switch (user.role) {
    case 'SA':
      return <SaDashboard />;
    case 'NM':
    case 'RA':
      return <RanmDashboard />;
    case 'PM':
      return <PmDashboard />;
    case 'CM':
      return <CmDashboard />;
    case 'VF':
      return <VfDashboard />;
    case 'CT':
      return <CtDashboard />;
    case 'CD':
      return <CdDashboard />;
    case 'SP':
      return <SpDashboard />;
    case 'SC':
      return <ScPortal />;
    case 'FM':
      return <FmPortal />;
    default:
      return <RanmDashboard />;
  }
};
