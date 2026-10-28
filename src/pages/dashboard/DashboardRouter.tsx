import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { RanmDashboard } from './RanmDashboard';
import { CmDashboard } from './CmDashboard';
import { VfDashboard } from './VfDashboard';
import { CtDashboard } from './CtDashboard';
import { SaDashboard } from './SaDashboard';
import { CdDashboard } from './CdDashboard';
import { SimulatorPage } from '../simulator/SimulatorPage';

export const DashboardRouter: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  switch (user.role) {
    case 'SA':
      return <SaDashboard />;
    case 'NM':
    case 'RA':
      return <RanmDashboard />;
    case 'CM':
      return <CmDashboard />;
    case 'VF':
      return <VfDashboard />;
    case 'CT':
      return <CtDashboard />;
    case 'CD':
      return <CdDashboard />;
    case 'SC':
      return <SimulatorPage />;
    default:
      return <RanmDashboard />;
  }
};
