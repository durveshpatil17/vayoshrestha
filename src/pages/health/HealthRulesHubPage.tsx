import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThresholdRulesPage } from './ThresholdRulesPage';
import { SupportRulesPage } from '@/pages/support/SupportRulesPage';
import { Sliders, AlertTriangle } from 'lucide-react';

export const HealthRulesHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'thresholds';

  const tabs = [
    {
      key: 'thresholds',
      label: 'Vital thresholds',
      icon: <Sliders className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'warning-signs',
      label: 'Warning signs & escalation rules',
      icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clinical Rules & Thresholds Hub"
        description="Operational vital bounds, escalation triggers, and maker-checker approval policies"
      />

      <NavTabBar tabs={tabs} defaultTab="thresholds" />

      {currentTab === 'thresholds' && <ThresholdRulesPage />}
      {currentTab === 'warning-signs' && <SupportRulesPage />}
    </div>
  );
};

