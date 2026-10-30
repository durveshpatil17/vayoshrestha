import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavTabBar } from '@/ui/NavTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { CohortDashboardPage } from './CohortDashboardPage';
import { MacroTrendsPage } from './MacroTrendsPage';
import { PrivacyStatementPage } from './PrivacyStatementPage';
import { ExportRegistryPage } from './ExportRegistryPage';
import { BarChart3, TrendingUp, ShieldCheck, FileCheck2 } from 'lucide-react';

export const TelemetryHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'cohort';

  const tabs = [
    {
      key: 'cohort',
      label: 'Cohort dashboard',
      icon: <BarChart3 className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'trends',
      label: 'Macro trends',
      icon: <TrendingUp className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'privacy',
      label: 'Privacy statement & k-suppression',
      icon: <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
    {
      key: 'exports',
      label: 'Verified exports',
      icon: <FileCheck2 className="w-3.5 h-3.5 stroke-[1.5]" />,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Live Telemetry & Ecosystem Evidence Hub"
        description="Ecosystem-wide anonymised cohort insights, macro health trends, and cryptographic SHA-256 dossiers"
      />

      <NavTabBar tabs={tabs} defaultTab="cohort" />

      {currentTab === 'cohort' && <CohortDashboardPage />}
      {currentTab === 'trends' && <MacroTrendsPage />}
      {currentTab === 'privacy' && <PrivacyStatementPage />}
      {currentTab === 'exports' && <ExportRegistryPage />}
    </div>
  );
};
